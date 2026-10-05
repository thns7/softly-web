'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Logo } from '@/components/icons/logo';
import { ArrowRight, Instagram, Linkedin, Mail, Pin, Whatsapp } from '@/components/icons/ui-icons';
import { footerNav, legalNav, site, whatsappUrl } from '@/content/site';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const socials = [
  { label: 'Instagram', href: site.social.instagram, Icon: Instagram },
  { label: 'LinkedIn', href: site.social.linkedin, Icon: Linkedin },
  { label: 'WhatsApp', href: whatsappUrl(), Icon: Whatsapp },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    track('newsletter_submit', {});

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? 'Não foi possível inscrever.');
      setStatus('done');
      setMessage('Pronto. Você recebe o próximo Insights.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Tente novamente.');
    }
  }

  /* `bg-elevated` (--surface-2), e nao `bg-ink-800`: o valor cru da paleta
     escura deixava o rodape azul-escuro tambem no tema claro, com o texto do
     tema claro (escuro) por cima — ilegivel. */
  return (
    <footer className="relative isolate overflow-hidden bg-elevated pt-20">
      <div className="divider-glow absolute inset-x-0 top-0" />

      <div className="shell relative">
        <div className="grid gap-14 pb-16 lg:grid-cols-12">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-body-sm text-body">
              Engenharia de produto digital para empresas que precisam crescer. Sem template, sem
              enrolação, sem trava de fornecedor.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group grid h-11 w-11 place-items-center rounded-pill border border-line bg-surface/50 text-body transition-all duration-300 ease-expo hover:-translate-y-1 hover:border-brand/60 hover:text-brand-soft"
                >
                  <Icon className="h-[18px] w-[18px] transition-transform duration-300 ease-expo group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          {footerNav.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <h2 className="font-mono text-label uppercase text-muted">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-body-sm text-body transition-colors duration-micro ease-expo hover:text-brand-soft"
                    >
                      <span className="relative">
                        {item.label}
                        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-soft transition-transform duration-300 ease-expo group-hover:scale-x-100" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contato + newsletter */}
          <div className="lg:col-span-4">
            <h2 className="font-mono text-label uppercase text-muted">Contato</h2>
            <ul className="mt-5 space-y-3 text-body-sm">
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { location: 'footer' })}
                  className="inline-flex items-center gap-2.5 text-body transition-colors hover:text-brand-soft"
                >
                  <Whatsapp className="h-4 w-4 text-brand-soft" />
                  {site.contact.whatsappLabel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="inline-flex items-center gap-2.5 text-body transition-colors hover:text-brand-soft"
                >
                  <Mail className="h-4 w-4 text-brand-soft" />
                  {site.contact.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-body">
                <Pin className="h-4 w-4 text-brand-soft" />
                {site.contact.city} · {site.contact.state}
              </li>
            </ul>

            <form onSubmit={onSubmit} className="mt-8">
              <label htmlFor="newsletter-email" className="font-mono text-label uppercase text-muted">
                Insights no seu e-mail
              </label>
              <div className="mt-3 flex items-center gap-2 rounded-pill border border-line bg-surface/60 p-1.5 transition-colors duration-micro ease-expo focus-within:border-brand/70">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com.br"
                  /* 16px é o piso: abaixo disso o Safari do iPhone dá zoom na
                     página inteira ao focar o campo, e o usuário cai numa
                     viewport torta que ele não pediu. */
                  className="h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-title outline-none placeholder:text-muted md:h-10 md:text-body-sm"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-brand text-white transition-all duration-300 ease-expo hover:shadow-glow disabled:opacity-60 md:h-10 md:w-10"
                >
                  <span className="sr-only">Inscrever</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-0.5" />
                </button>
              </div>
              <p
                className={cn(
                  'mt-2 min-h-[1.25rem] text-body-sm',
                  status === 'error' ? 'text-red-300' : 'text-muted',
                )}
                role="status"
              >
                {message || 'Um e-mail por mês. Sem spam, cancele quando quiser.'}
              </p>
            </form>
          </div>
        </div>

        <div className="divider-glow" />

        <div className="flex flex-col gap-4 py-8 text-body-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.75rem]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors duration-micro hover:text-brand-soft"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('softly:open-consent'))}
              className="transition-colors duration-micro hover:text-brand-soft"
            >
              Preferências de cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
