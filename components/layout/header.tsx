'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/icons/logo';
import { ArrowUpRight, Close, Menu } from '@/components/icons/ui-icons';
import { useSmoothScroll } from '@/components/motion/smooth-scroll';
import { Button } from '@/components/ui/button';
import { useScrollPast } from '@/hooks/use-scroll-past';
import { primaryNav, site } from '@/content/site';
import { track } from '@/lib/analytics';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Header fixo.
 * - Transparente no topo; após 80px ganha backdrop-blur e borda inferior.
 * - A palavra "Softly" recolhe (logo compacta) quando compacto.
 * - Link de navegação com sublinhado que cresce da esquerda.
 * - No mobile, menu em tela cheia com entrada em cascata.
 */
export function Header() {
  const scrolled = useScrollPast(80);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { stop: stopScroll, start: startScroll } = useSmoothScroll();

  useEffect(() => setOpen(false), [pathname]);

  /* Travar o fundo enquanto o menu está aberto.
     `overflow: hidden` no body NÃO segura o Safari do iPhone — a página
     continua rolando atrás do painel e, ao fechar, reaparece noutro ponto da
     leitura. O que segura é tirar o body do fluxo, guardando a posição para
     devolver na saída. O Lenis é parado junto: com o body fixo ele leria
     scroll zero e brigaria com a restauração. */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { body } = document;
    const previous = body.getAttribute('style') ?? '';

    stopScroll();
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.insetInline = '0';
    body.style.overflow = 'hidden';

    return () => {
      body.setAttribute('style', previous);
      window.scrollTo(0, y);
      startScroll();
    };
  }, [open, startScroll, stopScroll]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-expo',
          scrolled
            ? 'border-b border-line/70 bg-bg/72 shadow-e2 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent shadow-none',
        )}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <Link
            href="/"
            className="relative z-10 -ml-1 rounded-pill p-1"
            aria-label="Softly, página inicial"
          >
            <Logo compact={scrolled} />
          </Link>

          {/* Os links só aparecem depois que a página rola. Na primeira tela
              o header fica com marca e um botão — o hero é para decidir
              olhar, não para escolher destino.

              `focus-within` é o que mantém isso acessível: quem navega por
              teclado e chega na nav ainda no topo faz ela aparecer ao
              receber foco, em vez de tabular às cegas por links invisíveis. */}
          <nav
            aria-label="Navegação principal"
            className={cn(
              'hidden transition-[opacity,transform] duration-500 ease-expo focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 lg:block',
              scrolled
                ? 'pointer-events-auto translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-1 opacity-0',
            )}
          >
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative inline-flex px-3.5 py-2 text-body-sm text-body transition-colors duration-micro ease-expo hover:text-title"
                  >
                    {item.label}
                    <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-gradient-to-r from-brand to-accent transition-transform duration-300 ease-expo group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex"
              trailing={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => track('cta_click', { location: 'header' })}
            >
              <Link href="/#contato">Falar com a Softly</Link>
            </Button>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              className="grid h-11 w-11 place-items-center rounded-pill border border-line bg-surface/60 text-title lg:hidden"
            >
              <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
              {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            key="menu"
            className="fixed inset-0 z-[95] bg-bg/96 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.55, ease: EASE_EXPO } }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.4, ease: EASE_EXPO } }}
          >
            <nav
              aria-label="Navegação principal (mobile)"
              className="shell flex h-full flex-col justify-center gap-2 pb-[max(6rem,calc(env(safe-area-inset-bottom)+4rem))] pt-[var(--header-h)]"
            >
              {primaryNav.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.12 + index * 0.06, duration: 0.6, ease: EASE_EXPO },
                  }}
                >
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-4 border-b border-line/60 py-4 font-display text-display-md text-title"
                  >
                    <span className="font-mono text-label text-brand-soft">
                      0{index + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.45, duration: 0.6, ease: EASE_EXPO } }}
                className="mt-8 flex flex-col gap-4"
              >
                <Button asChild size="lg" trailing={<ArrowUpRight className="h-5 w-5" />}>
                  <Link href="/#contato">Falar com a Softly</Link>
                </Button>
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="font-mono text-body-sm text-muted underline-offset-4 hover:text-brand-soft"
                  >
                    {site.contact.email}
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
