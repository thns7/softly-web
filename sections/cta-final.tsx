'use client';

import { ContactForm } from '@/components/contact-form';
import { HeroBackground } from '@/components/hero-background';
import { Mail, Whatsapp } from '@/components/icons/ui-icons';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { site, whatsappUrl } from '@/content/site';
import { track } from '@/lib/analytics';

/**
 * CTA final — segundo momento "hero" da página.
 * É aqui que mora o segundo (e último) título com revelação por caractere.
 */
export function CtaFinal() {
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="relative isolate overflow-hidden">
      <HeroBackground variant="cta" />
      <div className="divider-glow absolute inset-x-0 top-0" />

      <div className="shell section-y">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <Reveal>
              <p className="eyebrow">
                <span className="text-muted">09</span>
                Contato
              </p>
            </Reveal>

            <h2
              id="contato-titulo"
              className="mt-6 text-display-xl text-title"
              aria-label="Conta o problema. A gente volta com o plano."
            >
              <SplitText text="Conta o problema." mode="char" whileInView aria="none" />
              <SplitText
                text="A gente volta com o plano."
                mode="word"
                whileInView
                delay={0.24}
                aria="none"
                className="text-brand-soft"
              />
            </h2>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-md text-lead text-body">
                Preencha quatro campos. Em até um dia útil você recebe um diagnóstico inicial, a
                faixa de investimento e o prazo, sem reunião obrigatória para saber o preço.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { location: 'cta-final' })}
                  className="group flex items-center gap-4 rounded-card border border-line/70 bg-surface/40 p-4 transition-all duration-300 ease-expo hover:-translate-y-1 hover:border-brand/50"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-pill bg-brand/15 text-brand-soft">
                    <Whatsapp className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-label uppercase text-muted">WhatsApp</span>
                    <span className="block text-body-sm text-title">
                      {site.contact.whatsappLabel}
                    </span>
                  </span>
                </a>

                <a
                  href={`mailto:${site.contact.email}`}
                  className="group flex items-center gap-4 rounded-card border border-line/70 bg-surface/40 p-4 transition-all duration-300 ease-expo hover:-translate-y-1 hover:border-brand/50"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-pill bg-brand/15 text-brand-soft">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-label uppercase text-muted">E-mail</span>
                    <span className="block text-body-sm text-title">{site.contact.email}</span>
                  </span>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
            <div className="surface-3 rounded-bento p-7 lg:p-10">
              <ContactForm compact />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
