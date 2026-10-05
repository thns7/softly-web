'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from '@/components/icons/ui-icons';
import { HeroBackground } from '@/components/hero-background';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { primaryNav } from '@/content/site';
import { EASE_EXPO } from '@/lib/motion';


export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[86vh] items-center overflow-hidden">
      <HeroBackground />

      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO } }}
              className="eyebrow"
            >
              Erro 404
            </motion.p>

            <h1 className="mt-6 text-display-hero text-title">
              <SplitText text="Essa página saiu do ar." mode="word" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO, delay: 0.3 } }}
              className="mt-6 max-w-lg text-lead text-body"
            >
              O endereço não existe mais, ou nunca existiu. Acontece. Volte para o início ou vá
              direto para o que você procurava.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_EXPO, delay: 0.45 } }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" trailing={<ArrowRight className="h-5 w-5" />}>
                <Link href="/">Voltar para o início</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/#contato">Falar com a Softly</Link>
              </Button>
            </motion.div>

            <motion.nav
              aria-label="Atalhos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.6 } }}
              className="mt-12"
            >
              <p className="font-mono text-label uppercase text-muted">Atalhos</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex rounded-pill border border-line bg-surface/40 px-4 py-2 text-body-sm text-body transition-colors duration-micro hover:border-brand/50 hover:text-title"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          {/* Composição do 404 */}
          <div className="lg:col-span-5">
            <motion.svg
              viewBox="0 0 420 220"
              className="w-full"
              initial="hidden"
              animate="visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="notfound" x1="0" y1="0" x2="420" y2="220" gradientUnits="userSpaceOnUse">
                  <stop stopColor="rgb(var(--brand-soft))" />
                  <stop offset="1" stopColor="rgb(var(--accent))" />
                </linearGradient>
              </defs>

              {[
                'M78 30 30 138h74M104 30v160',
                'M210 30c-30 0-46 24-46 80s16 80 46 80 46-24 46-80-16-80-46-80Z',
                'M356 30l-48 108h74M382 30v160',
              ].map((d, index) => (
                <motion.path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="url(#notfound)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  variants={{
                    hidden: { pathLength: 0, opacity: 0.15 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1.3, ease: EASE_EXPO, delay: 0.2 + index * 0.18 },
                    },
                  }}
                />
              ))}

              {/* o "sinal" que se perdeu */}
              <motion.circle
                cx="210"
                cy="110"
                r="9"
                fill="rgb(var(--accent))"
                variants={{
                  hidden: { scale: 1, opacity: 1 },
                  visible: {
                    scale: [1, 1.4, 0],
                    opacity: [1, 1, 0],
                    transition: { duration: 1.6, ease: EASE_EXPO, delay: 1.2 },
                  },
                }}
                style={{ transformOrigin: '210px 110px' }}
              />
            </motion.svg>
          </div>
        </div>
      </div>
    </section>
  );
}
