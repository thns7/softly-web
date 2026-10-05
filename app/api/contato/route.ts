import { NextResponse } from 'next/server';
import { site } from '@/content/site';
import { clientKey, rateLimit } from '@/lib/rate-limit';
import { contactSchema } from '@/lib/validators';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Recebe o formulário de contato.
 *
 * Camadas de proteção:
 *  1. rate limit por IP (5 envios por minuto)
 *  2. honeypot — o campo `website` precisa chegar vazio
 *  3. validação com o mesmo schema Zod usado no cliente
 *
 * Entrega (na ordem em que for configurada):
 *  - CONTACT_WEBHOOK_URL  → POST cru do lead (Make, n8n, Zapier, CRM…)
 *  - RESEND_API_KEY       → e-mail para CONTACT_TO_EMAIL
 *  - nenhuma das duas     → registra no log do servidor e responde 200
 *    (útil em desenvolvimento; ver README para configurar)
 */
export async function POST(request: Request) {
  const limit = rateLimit(`contato:${clientKey(request.headers)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { message: 'Muitas tentativas seguidas. Tente novamente em um minuto.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Requisição inválida.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { message: first?.message ?? 'Confira os campos e tente de novo.' },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot preenchido = robô. Responde 200 para não dar pista ao spammer.
  if (data.website) {
    return NextResponse.json({ message: 'Recebido.' }, { status: 200 });
  }

  const lead = {
    nome: data.name,
    whatsapp: data.phone,
    email: data.email || 'não informado',
    tipoDeProjeto: data.projectType,
    mensagem: data.message || 'não informado',
    estimativa: data.estimate
      ? `R$ ${data.estimate.total.toLocaleString('pt-BR')} · ~${data.estimate.weeks} semanas · ${data.estimate.summary}`
      : 'não informado',
    origem: data.source ?? 'site',
    recebidoEm: new Date().toISOString(),
  };

  try {
    const webhook = process.env.CONTACT_WEBHOOK_URL;
    if (webhook) {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!response.ok) throw new Error(`Webhook respondeu ${response.status}`);
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL ?? site.contact.email;
    if (resendKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? 'Softly <site@softly.com.br>',
          to: [to],
          reply_to: data.email || undefined,
          subject: `Novo lead do site: ${data.name} (${data.projectType})`,
          text: Object.entries(lead)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n'),
        }),
      });
      if (!response.ok) throw new Error(`Resend respondeu ${response.status}`);
    }

    if (!webhook && !resendKey) {
      // eslint-disable-next-line no-console
      console.info('[contato] lead recebido (sem integração configurada):', lead);
    }

    return NextResponse.json({ message: 'Recebido. Respondemos em até 1 dia útil.' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[contato] falha ao entregar o lead:', error);
    return NextResponse.json(
      { message: 'Não conseguimos enviar agora. Chame no WhatsApp que respondemos na hora.' },
      { status: 502 },
    );
  }
}
