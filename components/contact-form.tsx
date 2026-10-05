'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight, Check, Whatsapp } from '@/components/icons/ui-icons';
import { useEstimateStore } from '@/components/estimate-store';
import { Button } from '@/components/ui/button';
import { Field, Honeypot } from '@/components/ui/field';
import { site, whatsappUrl } from '@/content/site';
import { track } from '@/lib/analytics';
import { formatCurrency } from '@/lib/format';
import { contactSchema, type ContactInput } from '@/lib/validators';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  'Site ou landing page',
  'Aplicativo',
  'Sistema ou SaaS',
  'Automação e IA',
] as const;

/**
 * Formulário curto (4 campos) — validação com Zod no cliente e no servidor.
 * Traz junto a estimativa da calculadora, quando o visitante usou.
 * O honeypot é invisível e precisa chegar vazio na API.
 */
export function ContactForm({ compact = false }: { compact?: boolean }) {
  const { estimate } = useEstimateStore();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', phone: '', email: '', projectType: PROJECT_TYPES[0], website: '' },
  });

  const projectType = watch('projectType');

  const onSubmit = handleSubmit(async (values) => {
    setStatus('sending');
    setServerError('');
    track('form_submit', { projectType: values.projectType, hasEstimate: Boolean(estimate) });

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          source: compact ? 'cta-final' : 'contato',
          ...(estimate ? { estimate } : {}),
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? 'Não foi possível enviar agora.');

      setStatus('success');
      track('form_success', { projectType: values.projectType });
    } catch (error) {
      setStatus('error');
      setServerError(error instanceof Error ? error.message : 'Tente novamente em instantes.');
      track('form_error', {});
    }
  });

  const whatsappHandoff = () => {
    const values = getValues();
    const lines = [
      `Olá! Sou ${values.name || 'um visitante do site'}.`,
      `Tipo de projeto: ${values.projectType}.`,
      estimate ? `Estimativa da calculadora: ${formatCurrency(estimate.total)} (${estimate.summary}).` : '',
      'Podemos conversar?',
    ].filter(Boolean);
    return whatsappUrl(lines.join(' '));
  };

  return (
    <div className="relative">
      {/* Sem `AnimatePresence mode="wait"`: esse modo mantém o ramo que sai
          montado enquanto o novo entra e mexe no DOM por fora do React, que é
          o padrão que derrubava a navegação a partir da home. A troca aqui é
          de mão única (formulário → sucesso), então a entrada em CSS basta. */}
      {status === 'success' ? (
        <div className="animate-enter-up flex flex-col items-start gap-5">
            <span className="grid h-16 w-16 place-items-center rounded-pill border border-accent/40 bg-accent/12">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                {/* Traço do "certo" desenhado por CSS: o comprimento do path
                    é 24,3 unidades, então dasharray/dashoffset nesse valor
                    cobrem a linha inteira. */}
                <path
                  d="m4 12.5 5 5L20 6.5"
                  stroke="rgb(var(--accent))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  className="animate-draw-check"
                />
              </svg>
            </span>
            <div>
              <p className="font-display text-display-sm text-title">Recebemos. Agora é com a gente.</p>
              <p className="mt-3 max-w-md text-body-sm text-body">
                {site.contact.responseTime} Se preferir adiantar, chame no WhatsApp: a conversa já
                vai pré-preenchida com o que você escolheu.
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              leading={<Whatsapp className="h-5 w-5" />}
              onClick={() => track('whatsapp_click', { location: 'form-success' })}
            >
              <a href={whatsappHandoff()} target="_blank" rel="noopener noreferrer">
                Continuar no WhatsApp
              </a>
            </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="relative">
            <Honeypot />
            <input type="hidden" {...register('website')} />

            <div className={cn('grid gap-4', compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2')}>
              <Field
                label="Seu nome"
                autoComplete="name"
                {...register('name')}
                error={errors.name?.message}
              />
              <Field
                label="WhatsApp com DDD"
                inputMode="tel"
                autoComplete="tel"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <Field
                label="E-mail (opcional)"
                type="email"
                autoComplete="email"
                className="sm:col-span-2"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <fieldset className="mt-6">
              <legend className="font-mono text-label uppercase text-muted">
                Tipo de projeto
              </legend>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={projectType === type}
                    onClick={() => setValue('projectType', type, { shouldValidate: true })}
                    className={cn(
                      'rounded-pill border px-4 py-2.5 text-body-sm transition-all duration-300 ease-expo',
                      projectType === type
                        ? 'border-brand bg-brand/15 text-title'
                        : 'border-line bg-surface/40 text-body hover:border-brand/50',
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.projectType ? (
                <p role="alert" className="mt-2 text-body-sm text-red-300">
                  {errors.projectType.message}
                </p>
              ) : null}
            </fieldset>

            {/* Estimativa vinda da calculadora */}
            {estimate ? (
              <div className="animate-enter-up mt-6 flex items-start gap-3 rounded-card border border-accent/35 bg-accent/8 p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p className="text-body-sm text-body">
                    <span className="font-bold text-title">
                      Estimativa anexada: {formatCurrency(estimate.total)}
                    </span>
                    <br />
                    {estimate.summary}
                  </p>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={status === 'sending'}
                trailing={<ArrowRight className="h-5 w-5" />}
              >
                {status === 'sending' ? 'Enviando…' : 'Quero minha proposta'}
              </Button>
              <p className="text-body-sm text-muted">{site.contact.responseTime}</p>
            </div>

            {status === 'error' ? (
              <p role="alert" className="mt-4 text-body-sm text-red-300">
                {serverError}
              </p>
            ) : null}
          </form>
      )}
    </div>
  );
}
