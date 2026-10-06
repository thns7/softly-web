'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-reduced-motion';
import { keyMetric } from '@/content/key-metric';
import { cn } from '@/lib/utils';

/**
 * "O número" — o momento autoral da página, controlado pelo scroll.
 *
 * A frase da seção diz que, antes de escrever código, a gente descobre qual
 * número precisa mudar. A sequência faz isso na frente de quem rola:
 *
 * 1. A tela se enche de métricas de um negócio qualquer. É o ruído do dia a
 *    dia: tudo parece importante, nada se destaca.
 * 2. Rolando, todas apagam menos uma, que acende. É a descoberta.
 * 3. Essa uma viaja até o centro, cresce e fica azul.
 * 4. A frase chega embaixo dela.
 *
 * A rolagem é a investigação: andar a página é estreitar o problema.
 *
 * COMO É FEITO
 * Uma função só, `apply(p)`, recebe o progresso e escreve estilo direto nos
 * elementos. Nada de re-render do React por quadro, e nada de componente do
 * Framer Motion: a projeção de layout dele mexe no DOM por fora do React e já
 * derrubou a navegação deste site (ver commit 188be59). Do Framer só se usa
 * `useScroll`, que apenas lê a rolagem.
 *
 * O número que viaja é FLIP: ele é renderizado no tamanho FINAL e começa
 * encolhido exatamente em cima da métrica original (posição e escala medidas
 * na tela). No fim a escala é 1, então o número grande sai nítido, sem texto
 * ampliado. Ele usa `translate` 2D de propósito: `translate3d` promoveria uma
 * camada de GPU e o navegador ampliaria a textura borrada em vez de redesenhar
 * as letras.
 *
 * O campo só anima opacidade. Se ele também andasse, a medição da origem do
 * número ficaria errada no meio da sequência.
 *
 * Substitui a seção "Sinal" (vídeo da mão puxando um fio, 48 quadros, 1,6 MB).
 * Esta não baixa nenhum arquivo.
 */

const { metrics, chosen, caption, statement } = keyMetric;
const chosenMetric = metrics[chosen]!;

/**
 * Desvio de cada célula da grade, em px. A dispersão é quase toda VERTICAL:
 * os rótulos longos ("TEMPO DE CARREGAMENTO") já ocupam ~170px de uma coluna
 * de ~199px no desktop, e dois vizinhos desviando um contra o outro na
 * horizontal se encostavam. No celular só o vertical, pela metade (o
 * horizontal levava a coluna da esquerda para 5px da borda); no desktop o
 * vertical é ampliado 1,6x, para a grade ler como ruído e não como planilha. Fixo,
 * e não aleatório, para o HTML do servidor e o do navegador baterem. O
 * escolhido fica em [0, 0]: a origem dele é medida, e um desvio só complicaria
 * a conta sem mudar nada na tela.
 */
const NUDGE: readonly [number, number][] = [
  [-14, 10], [22, -18], [-6, 24], [18, 6], [-24, -8], [0, 0],
  [12, 22], [-20, -14], [26, 12], [-8, -22], [16, -6], [-18, 18],
  [8, -16], [-26, 4], [20, 20], [-10, -10], [24, -20], [-16, 14],
];

/** Tamanho final do número: grande, mas cabendo em telas baixas. */
const FINAL_SIZE = 'text-[clamp(3rem,min(20vw,16svh),9.5rem)]';

/**
 * Tipografia do VALOR, idêntica no campo, no número que viaja e no slot — a
 * conta do FLIP só fecha se os três tiverem a mesma fonte, o mesmo peso e o
 * mesmo espaçamento (o `em` escala junto com o tamanho).
 *
 * Não é a mono dos rótulos de propósito. Em fonte monoespaçada cada caractere
 * ocupa a mesma largura, e no tamanho final a vírgula ganhava uma célula
 * inteira: "1,8%" lia "1 , 8%". A fonte de texto com algarismos tabulares
 * mantém a cara de painel e acerta a pontuação.
 */
const VALUE_TYPE = 'numeric font-sans font-medium leading-none tracking-[-0.03em]';

type Rgb = [number, number, number];
type Geometry = { ox: number; oy: number; tx: number; ty: number; s0: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Quanto `p` já andou dentro de [a, b], com entrada e saída suaves. */
const phase = (p: number, a: number, b: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Deslocamento do número: acelera e freia, como quem leva algo até a mesa. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mixRgb = (a: Rgb, b: Rgb, t: number) =>
  `rgb(${a.map((v, i) => Math.round(mix(v, b[i]!, t))).join(' ')})`;
/** Lê um token de cor do globals.css ("r g b"). */
const token = (name: string): Rgb =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .split(/\s+/)
    .map(Number) as Rgb;

/**
 * Janelas da sequência, em fração do progresso. Os intervalos se tocam de
 * propósito: cada etapa começa enquanto a anterior termina, para a rolagem
 * nunca ter um trecho morto.
 */
const T = {
  descobre: [0.08, 0.28],
  viaja: [0.3, 0.62],
  campoSome: [0.3, 0.5],
  rotuloSome: [0.3, 0.42],
  ficaAzul: [0.55, 0.68],
  legenda: [0.58, 0.7],
  frase: [0.64, 0.78],
  destaque: [0.72, 0.86],
} as const;

export function KeyMetric() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const othersRef = useRef<HTMLDivElement[]>([]);
  const chosenLabelRef = useRef<HTMLSpanElement>(null);
  const chosenValueRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const travelerRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const geometry = useRef<Geometry | null>(null);
  const colors = useRef<{ body: Rgb; text: Rgb; muted: Rgb; brand: Rgb } | null>(null);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const apply = useCallback((raw: number) => {
    const g = geometry.current;
    const c = colors.current;
    const traveler = travelerRef.current;
    if (!g || !c || !traveler) return;

    /* Os últimos 12% do trecho são pausa: a frase fica parada para ser lida. */
    const p = clamp01(raw / 0.88);

    const found = phase(p, ...T.descobre);
    const fieldGone = phase(p, ...T.campoSome);
    const travel = easeInOutCubic(clamp01((p - T.viaja[0]) / (T.viaja[1] - T.viaja[0])));
    const blue = phase(p, ...T.ficaAzul);

    /* O resto do painel apaga até sobrar um vulto, e depois some. */
    const others = String(mix(1, 0.14, found) * (1 - fieldGone));
    for (const el of othersRef.current) el.style.opacity = others;

    const label = chosenLabelRef.current;
    if (label) {
      label.style.opacity = String(1 - phase(p, ...T.rotuloSome));
      label.style.color = mixRgb(c.muted, c.text, found);
    }

    const x = mix(g.ox, g.tx, travel);
    const y = mix(g.oy, g.ty, travel);
    const s = mix(g.s0, 1, travel);
    traveler.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    traveler.style.color = blue > 0 ? mixRgb(c.text, c.brand, blue) : mixRgb(c.body, c.text, found);

    const reveal = (el: HTMLElement | null, t: number, rise: number) => {
      if (!el) return;
      el.style.opacity = String(t);
      el.style.transform = `translateY(${(1 - t) * rise}px)`;
    };
    reveal(captionRef.current, phase(p, ...T.legenda), 8);
    reveal(leadRef.current, phase(p, ...T.frase), 16);
    reveal(accentRef.current, phase(p, ...T.destaque), 16);
  }, []);

  /** Mede de onde o número sai e aonde ele chega. Refeito a cada resize. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const source = chosenValueRef.current;
    const slot = slotRef.current;
    if (!stage || !source || !slot) return;

    const box = stage.getBoundingClientRect();
    const from = source.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    if (!to.width) return;

    othersRef.current = Array.from(stage.querySelectorAll<HTMLDivElement>('[data-metric="outro"]'));
    geometry.current = {
      ox: from.left - box.left,
      oy: from.top - box.top,
      tx: to.left - box.left,
      ty: to.top - box.top,
      s0: parseFloat(getComputedStyle(source).fontSize) / parseFloat(getComputedStyle(slot).fontSize),
    };
    colors.current ??= {
      body: token('--body'),
      text: token('--text'),
      muted: token('--muted'),
      brand: token('--brand-soft'),
    };
    setReady(true);
    apply(scrollYProgress.get());
  }, [apply, scrollYProgress]);

  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;
    measure();
    /* A fonte mono pode chegar depois do primeiro desenho e mudar a largura
       do número; sem remedir, ele pousaria fora do lugar. */
    void document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [measure, reduced]);

  useMotionValueEvent(scrollYProgress, 'change', (raw) => {
    if (!reduced) apply(raw);
  });

  /* Menos movimento: sem campo e sem viagem. Fica a composição final, que é
     o que a sequência quer dizer. */
  if (reduced) {
    return (
      <section ref={sectionRef} aria-labelledby="numero-titulo" className="section-y relative">
        <div className="shell flex flex-col items-center text-center">
          <span aria-hidden="true" className={cn(VALUE_TYPE, 'text-brand-soft', FINAL_SIZE)}>
            {chosenMetric.value}
          </span>
          <p aria-hidden="true" className="mt-5 font-mono text-label uppercase text-muted">
            {caption}
          </p>
          <h2 id="numero-titulo" className="mt-8 max-w-3xl text-display-lg text-white">
            {statement.lead} <span className="text-brand-soft">{statement.accent}</span>
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="numero-titulo"
      /* No celular o trecho é mais curto: dois deslizes de polegar, não três. */
      className="relative h-[200vh] md:h-[260vh]"
    >
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
        {/* O painel. Decorativo para o leitor de tela: o conteúdo da seção é
            a frase, e ela está inteira no h2. */}
        <div
          aria-hidden="true"
          className="shell grid h-full grid-cols-2 content-center gap-x-6 gap-y-[6svh] md:grid-cols-4 md:gap-y-[9svh] lg:grid-cols-6 lg:gap-y-[17svh]"
        >
          {metrics.map((metric, index) => {
            const isChosen = index === chosen;
            const [nx, ny] = NUDGE[index] ?? [0, 0];
            return (
              <div
                key={metric.label}
                data-metric={isChosen ? 'escolhido' : 'outro'}
                className={cn(
                  'flex-col gap-2.5',
                  index >= 12 ? 'hidden lg:flex' : index >= 10 ? 'hidden md:flex' : 'flex',
                  '[transform:translate(0,calc(var(--ny)/2))] md:[transform:translate(calc(var(--nx)/2),var(--ny))] lg:[transform:translate(var(--nx),calc(var(--ny)*1.6))]',
                )}
                style={{ '--nx': `${nx}px`, '--ny': `${ny}px` } as CSSProperties}
              >
                <span
                  ref={isChosen ? chosenLabelRef : undefined}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted md:text-[0.6875rem]"
                >
                  {metric.label}
                </span>
                <span
                  ref={isChosen ? chosenValueRef : undefined}
                  /* Depois de medido, o original some e quem aparece é o
                     número que viaja, desenhado exatamente por cima. */
                  style={isChosen && ready ? { visibility: 'hidden' } : undefined}
                  className={cn(VALUE_TYPE, 'self-start text-[1.125rem] text-body md:text-[1.3125rem]')}
                >
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Composição final. O `slot` é invisível: só marca onde o número
            pousa, com o mesmo texto e o mesmo tamanho dele. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-gutter text-center">
          <span
            ref={slotRef}
            aria-hidden="true"
            className={cn(VALUE_TYPE, 'invisible', FINAL_SIZE)}
          >
            {chosenMetric.value}
          </span>
          <p
            ref={captionRef}
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="mt-5 font-mono text-label uppercase text-muted"
          >
            {caption}
          </p>
          <h2 id="numero-titulo" className="mt-8 max-w-3xl text-display-lg text-white">
            <span ref={leadRef} style={{ opacity: 0 }} className="block">
              {statement.lead}
            </span>{' '}
            <span ref={accentRef} style={{ opacity: 0 }} className="block text-brand-soft">
              {statement.accent}
            </span>
          </h2>
        </div>

        {/* O número que viaja (ver FLIP no comentário do topo). */}
        <span
          ref={travelerRef}
          aria-hidden="true"
          style={{ opacity: ready ? 1 : 0 }}
          className={cn(
            VALUE_TYPE,
            'pointer-events-none absolute left-0 top-0 origin-top-left',
            FINAL_SIZE,
          )}
        >
          {chosenMetric.value}
        </span>
      </div>
    </section>
  );
}
