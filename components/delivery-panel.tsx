'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Counter } from '@/components/motion/counter';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Painel "Padrão de entrega" — o momento autoral da página.
 *
 * A tese de movimento do site é que a página se comporta como um instrumento
 * que se calibra conforme você rola (ver lib/motion.ts). Este painel é onde
 * essa ideia aparece inteira, uma vez só:
 *
 *   1. uma varredura de luz atravessa a superfície, de cima a baixo;
 *   2. cada linha acende em sequência e o dígito rola até o valor;
 *   3. a barra procura a marca e o marcador trava em cima dela;
 *   4. o rótulo do canto passa de "calibrando" para "aferido".
 *
 * Número e barra partem do mesmo gatilho de propósito: antes cada um tinha o
 * seu, e a barra ficava cheia enquanto o número ainda subia — o painel exibia
 * 100% para um valor de 62%, que é o contrário do que ele promete.
 *
 * Custo: as três barras animam `transform: scaleX` e o marcador `translateX`.
 * A varredura é uma faixa de 1px com `translate3d`. Nada aqui força layout.
 */
type Row = {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  /** Posição da marca no trilho, de 0 a 1. */
  mark: number;
  /** O que a marca significa, lido por leitor de tela junto com o valor. */
  scale: string;
};

const ROWS: Row[] = [
  {
    label: 'Carregamento no celular',
    value: 1.1,
    decimals: 1,
    suffix: 's',
    mark: 0.86,
    scale: 'quanto mais alto, mais rápido que a média do setor',
  },
  {
    label: 'Lighthouse (performance)',
    value: 98,
    suffix: '/100',
    mark: 0.98,
    scale: 'de 0 a 100',
  },
  {
    label: 'Prazo médio de entrega',
    value: 5.2,
    decimals: 1,
    suffix: ' semanas',
    mark: 0.62,
    scale: 'do aceite da proposta ao lançamento',
  },
];

/**
 * Largura do trilho em pixels. O marcador precisa dela porque anda em `x`
 * (transform) e não em `left` — animar `left` recalcularia layout a cada
 * quadro, e a regra do projeto é transform/opacity apenas.
 */
function useTrackWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export function DeliveryPanel({
  className,
  delay = 0,
  layout = 'column',
}: {
  className?: string;
  delay?: number;
  /** 'row' distribui as três leituras lado a lado — usado na faixa larga
   *  logo abaixo do hero, onde há largura de sobra e empilhar deixaria o
   *  bloco alto e estreito no meio de uma seção que é horizontal. */
  layout?: 'column' | 'row';
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  /**
   * A leitura dispara ao entrar na viewport, COM PRAZO DE SEGURANÇA.
   *
   * Só o IntersectionObserver não serve: se ele não disparar — aba em
   * segundo plano, WebView, janela oculta — o painel fica parado em zero,
   * exibindo "0,0s / 0/100" como se fosse o valor real. Para um bloco que
   * existe para mostrar número aferido, esse é o pior estado possível, e é
   * pior que animar cedo demais.
   *
   * Então: o que vier primeiro entre "entrou na tela" e 4 segundos de vida.
   */
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (inView) {
      setArmed(true);
      return;
    }
    const timer = window.setTimeout(() => setArmed(true), 4000);
    return () => window.clearTimeout(timer);
  }, [inView]);

  const run = armed && !reduced;

  return (
    <div
      ref={ref}
      className={cn(
        'surface-3 relative isolate overflow-hidden rounded-bento p-6 lg:p-8',
        className,
      )}
    >
      {/* 1. varredura — passa uma única vez, quando o painel entra */}
      {run ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px animate-scan bg-line-glow"
          style={{ animationDelay: `${delay + 0.15}s` }}
        />
      ) : null}

      <div className="relative flex items-center justify-between gap-4">
        <p className="font-mono text-label uppercase text-brand-soft">Padrão de entrega</p>
        <Status run={run} reduced={reduced} delay={delay} />
      </div>

      <ul
        className={cn(
          'relative mt-7',
          layout === 'row' ? 'grid gap-8 sm:grid-cols-3 sm:gap-10' : 'space-y-6',
        )}
      >
        {ROWS.map((row, index) => (
          <PanelRow
            key={row.label}
            row={row}
            armed={armed}
            reduced={reduced}
            delay={delay + 0.35 + index * 0.14}
          />
        ))}
      </ul>

      <div className={cn('divider-glow', layout === 'row' ? 'my-8' : 'my-7')} />

      <p className={cn('relative text-body-sm text-body', layout === 'row' && 'max-w-3xl')}>
        Todo projeto sai com escopo, prazo e preço fechados. Você acompanha em ambiente de testes
        desde a primeira semana.
      </p>
    </div>
  );
}

function PanelRow({
  row,
  armed,
  reduced,
  delay,
}: {
  row: Row;
  armed: boolean;
  reduced: boolean;
  delay: number;
}) {
  const track = useTrackWidth<HTMLDivElement>();
  const seek = reduced ? { duration: 0 } : { duration: 1.1, ease: EASE_EXPO, delay };

  /**
   * Cada elemento animado leva o seu próprio alvo explícito — nem
   * `animate={undefined}` (sem alvo o Framer ignora o `initial` e renderiza
   * o elemento cru: era o que deixava as três barras cheias enquanto o
   * número ainda subia), nem variante herdada por nome, que não atravessa os
   * elementos comuns entre o container animado e estes filhos.
   */
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={
        armed
          ? {
              opacity: 1,
              y: 0,
              transition: reduced ? { duration: 0.15 } : { duration: 0.6, ease: EASE_EXPO, delay },
            }
          : { opacity: 0, y: 10 }
      }
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-body-sm text-body">{row.label}</span>
        <span className="font-mono text-body-sm text-title">
          <Counter
            value={row.value}
            decimals={row.decimals ?? 0}
            suffix={row.suffix}
            duration={1.2}
          />
        </span>
      </div>

      {/* Trilho: a barra procura a marca e o marcador trava em cima dela */}
      <div
        ref={track.ref}
        role="meter"
        aria-valuenow={Math.round(row.mark * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${row.label}: ${row.scale}`}
        className="relative mt-2.5 h-1 w-full rounded-pill bg-line/60"
      >
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-pill bg-gradient-to-r from-brand to-accent"
          initial={{ scaleX: 0 }}
          animate={armed ? { scaleX: row.mark, transition: seek } : { scaleX: 0 }}
        />
        {/* O marcador só aparece depois que o trilho foi medido — sem isso ele
            piscaria na borda esquerda no primeiro quadro. */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-2.5 w-2.5 rounded-pill border-2 border-bg bg-accent shadow-[0_0_12px_rgb(var(--glow)/0.9)]"
          style={{ marginLeft: -5, marginTop: -5 }}
          initial={{ x: 0, opacity: 0 }}
          animate={
            armed && track.width
              ? { x: track.width * row.mark, opacity: 1, transition: seek }
              : { x: 0, opacity: 0 }
          }
        />
      </div>
    </motion.li>
  );
}

/**
 * O rótulo do canto conta em que ponto a leitura está. Sem ele a varredura
 * seria só um brilho bonito; com ele o painel diz o que está fazendo.
 */
function Status({ run, reduced, delay }: { run: boolean; reduced: boolean; delay: number }) {
  if (reduced || !run) {
    return <span className="font-mono text-label uppercase text-muted">Aferido · 2026</span>;
  }

  return (
    <span className="relative font-mono text-label uppercase">
      <motion.span
        className="absolute right-0 top-0 whitespace-nowrap text-accent"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 0.3, delay: delay + 1.8 } }}
      >
        Calibrando
      </motion.span>
      <motion.span
        className="whitespace-nowrap text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4, delay: delay + 2 } }}
      >
        Aferido · 2026
      </motion.span>
    </span>
  );
}
