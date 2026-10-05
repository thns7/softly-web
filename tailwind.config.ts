import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Todos os valores de cor apontam para CSS variables definidas em app/globals.css.
 * Isso permite trocar o tema (dark ⇄ light) sem recompilar classes e proíbe,
 * na prática, cor hardcoded no JSX.
 */
const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './sections/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', sm: '2rem', lg: '2.5rem', '2xl': '4rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      /**
       * Escala de opacidade completa (0–100 em passos de 1).
       * Sem isso o Tailwind descarta silenciosamente modificadores fora da
       * escala padrão (ex.: `bg-bg/96`, `bg-brand/12`) e o estilo some.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, index) => [index, String(index / 100)]),
      ),
      colors: {
        // Paleta bruta (constante nos dois temas)
        ink: {
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
        },
        blue: {
          400: 'rgb(var(--blue-400) / <alpha-value>)',
          500: 'rgb(var(--blue-500) / <alpha-value>)',
          600: 'rgb(var(--blue-600) / <alpha-value>)',
        },
        cyan: { 400: 'rgb(var(--cyan-400) / <alpha-value>)' },
        slate: {
          300: 'rgb(var(--slate-300) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
        },
        // Camada semântica (troca com o tema)
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--surface-2) / <alpha-value>)',
        title: 'rgb(var(--text) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--border) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          hover: 'rgb(var(--brand-hover) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        glow: 'rgb(var(--glow) / <alpha-value>)',
        /* Cor do símbolo da marca — ver a nota em globals.css. */
        logo: 'rgb(var(--logo) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        /* Escala fluida — o valor do meio é o tamanho em desktop.
           NOTA DE CALIBRAGEM: afinada para a largura do Unbounded, que é ~25%
           mais largo que o Clash Display. Ao trocar a fonte display por Clash
           (ver lib/fonts.ts), suba cada teto em torno de 30%.

           O título de seção subiu de 3,1 para 3,5rem: o salto entre corpo e
           display estava curto demais, e frase que não domina a tela lê como
           cautela, não como confiança.

           O hero tem teto MENOR que o display-xl em número (4,9rem), mas pesa
           mais na tela: é caixa-alta. Maiúscula não tem ascendente nem
           descendente, então ocupa mais altura visível por em, aperta melhor
           no entrelinha (0.94) e precisa de MENOS tracking negativo — a
           -0,05em herdado da caixa-baixa as maiúsculas colavam. */
        'display-hero': ['clamp(2.1rem, 5.6vw, 4.9rem)', { lineHeight: '0.94', letterSpacing: '-0.028em', fontWeight: '700' }],
        'display-xl': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-lg': ['clamp(1.6rem, 2.6vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-md': ['clamp(1.3rem, 1.9vw, 1.7rem)', { lineHeight: '1.18', letterSpacing: '-0.024em', fontWeight: '500' }],
        'display-sm': ['clamp(1.1rem, 1.35vw, 1.28rem)', { lineHeight: '1.25', letterSpacing: '-0.018em', fontWeight: '500' }],
        lead: ['clamp(1.0625rem, 1.35vw, 1.25rem)', { lineHeight: '1.65' }],
        body: ['1.0625rem', { lineHeight: '1.7' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65' }],
        label: ['0.75rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      spacing: {
        section: 'var(--space-section)',
        gutter: 'var(--space-gutter)',
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: { content: '1180px', prose: '68ch', shell: '1320px' },
      borderRadius: { input: '14px', card: '20px', bento: '28px', pill: '999px' },
      boxShadow: {
        /* Elevação: sombra de verdade (deslocamento + desfoque), definida em
           globals.css e trocada junto com o tema. */
        e1: 'var(--shadow-1)',
        e2: 'var(--shadow-2)',
        e3: 'var(--shadow-3)',
        /* `glow` deixou de ser azul. O halo colorido era a assinatura visual
           mais forte do site e também a mais barata: toda superfície em
           destaque ganhava a mesma auréola anil, o que achatava a hierarquia
           (se tudo brilha, nada brilha) e tingia o preto de azul. O que
           sobrou é contorno de 1px em luz branca sobre elevação real. */
        glow: 'var(--shadow-2), 0 0 0 1px rgb(255 255 255 / 0.1)',
        'glow-lg': 'var(--shadow-3), 0 0 0 1px rgb(255 255 255 / 0.14)',
        card: 'var(--shadow-1)',
        float: 'var(--shadow-2)',
      },
      backgroundImage: {
        'grid-dots': 'radial-gradient(circle at 1px 1px, rgb(var(--grid) / 1) 1px, transparent 0)',
        'grid-lines':
          'linear-gradient(to right, rgb(var(--grid) / 1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid) / 1) 1px, transparent 1px)',
        'line-glow': 'linear-gradient(90deg, transparent, rgb(var(--glow) / 0.55), transparent)',
        'brand-sheen': 'linear-gradient(135deg, rgb(var(--brand) / 1), rgb(var(--accent) / 1))',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: { micro: '180ms', enter: '700ms', cinema: '1200ms' },
      keyframes: {
        marquee: { from: { transform: 'translate3d(0,0,0)' }, to: { transform: 'translate3d(-50%,0,0)' } },
        'mesh-drift': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.08)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.96)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.85)', opacity: '0.65' },
          '70%,100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        'scroll-hint': {
          '0%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.35' },
          '50%': { transform: 'translate3d(0,7px,0)', opacity: '1' },
        },
        'border-spin': { to: { transform: 'rotate(1turn)' } },
        shimmer: { '100%': { transform: 'translate3d(100%,0,0)' } },
        /* Varredura do painel de instrumentos: uma linha de luz atravessa a
           superfície de cima a baixo e some. Roda uma vez, na entrada. */
        scan: {
          '0%': { transform: 'translate3d(0,-100%,0)', opacity: '0' },
          '12%': { opacity: '1' },
          '88%': { opacity: '1' },
          '100%': { transform: 'translate3d(0,900%,0)', opacity: '0' },
        },
        float: {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
        /* Entrada de rota e de card filtrado. São CSS puro de propósito: as
           versões em Framer Motion (AnimatePresence, `layout`, `layoutId`)
           manipulam o DOM por fora do React e, quando a seção era desmontada
           no meio da navegação, o React estourava
           `NotFoundError: Failed to execute 'removeChild'` e a página de
           destino virava tela de erro. */
        'enter-up': {
          from: { opacity: '0', transform: 'translate3d(0,10px,0)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        /* Traço do "certo" da confirmação do formulário. `pathLength={1}`
           normaliza o comprimento do path, então 1 -> 0 desenha a linha. */
        'draw-check': {
          from: { strokeDasharray: '1', strokeDashoffset: '1' },
          to: { strokeDasharray: '1', strokeDashoffset: '0' },
        },
        'enter-card': {
          from: { opacity: '0', transform: 'translate3d(0,16px,0) scale(0.97)' },
          to: { opacity: '1', transform: 'translate3d(0,0,0) scale(1)' },
        },
        // Única exceção consciente à regra "só transform/opacity": o accordion
        // precisa da altura real do conteúdo (Radix expõe a variável abaixo).
        // É uma subárvore pequena e isolada — não causa reflow perceptível.
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
      },
      animation: {
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'mesh-drift': 'mesh-drift 20s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'scroll-hint': 'scroll-hint 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'border-spin': 'border-spin 5s linear infinite',
        float: 'float 7s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        scan: 'scan 2.4s cubic-bezier(0.65, 0, 0.35, 1) 1 both',
        /* `backwards`, NUNCA `both`. Esta animação envolve a PÁGINA INTEIRA
           (components/motion/page-transition.tsx). Com `both` o último quadro,
           `translate3d(0,0,0)`, fica aplicado para sempre — e qualquer
           transform diferente de `none`, mesmo o identidade, faz o elemento
           virar o bloco de referência de todo `position: fixed` lá dentro.
           O pin do GSAP em "Como trabalhamos" usa `fixed`: em vez de grudar
           na tela, a seção grudava no topo do documento, sumia durante o
           trecho travado e voltava quando ele acabava. Com `backwards` o
           elemento volta ao estilo natural quando a animação termina, e o
           visual final é o mesmo porque o último quadro já era o natural. */
        'enter-up': 'enter-up 350ms cubic-bezier(0.16, 1, 0.3, 1) backwards',
        'enter-card': 'enter-card 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'draw-check': 'draw-check 600ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both',
        'accordion-down': 'accordion-down 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        'accordion-up': 'accordion-up 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [animate],
};

export default config;
