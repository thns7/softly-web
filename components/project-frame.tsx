import Image from 'next/image';
import type { Project } from '@/content/projects';
import { cn } from '@/lib/utils';

/**
 * Renderiza a imagem do projeto quando ela existe e, quando não existe, um
 * mockup vetorial de reserva.
 *
 * Hoje os cinco projetos do portfólio têm imagem em /public/images/projects,
 * então o caminho vetorial só entra se um projeto novo for adicionado sem
 * captura. Ele fica porque é o que impede o card de quebrar nesse intervalo:
 * mantém a proporção exata, pesa ~1KB, não gera CLS e já vem no duotone azul
 * da marca.
 *
 * Para adicionar um projeto com imagem: exporte 1600×1000 em WebP ou AVIF e
 * preencha `image` em content/projects.ts. O componente troca sozinho.
 */
export function ProjectFrame({
  project,
  className,
  /**
   * Largura que a imagem vai ocupar de verdade. O padrão serve a um card de
   * meia grade; quem renderiza mais largo que isso (o card de 12 colunas do
   * portfólio, o herói do case) passa o seu — senão o navegador baixa um
   * arquivo menor que o espaço e a captura chega borrada.
   */
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 720px',
  priority = false,
}: {
  project: Pick<Project, 'device' | 'client' | 'image' | 'category'>;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { device } = project;

  // Captura real disponível: entra otimizada (AVIF/WebP, dimensões fixas,
  // blur enquanto carrega) e o mockup vetorial sai de cena.
  if (project.image) {
    return (
      <div
        className={cn(
          'relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-line/70 bg-ink-800',
          className,
        )}
      >
        <Image
          src={project.image}
          alt={`Interface do projeto ${project.client}, ${project.category}`}
          fill
          sizes={sizes}
          className="object-cover"
          quality={82}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-line/70 bg-ink-800',
        className,
      )}
      role="img"
      aria-label={`Mockup do projeto ${project.client}, ${project.category}`}
    >
      {/* luz de fundo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 15% 0%, rgb(var(--glow) / 0.154), transparent 55%), radial-gradient(90% 80% at 90% 100%, rgb(var(--accent) / 0.088), transparent 60%)',
        }}
      />

      <svg
        viewBox="0 0 640 400"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`frame-${device}`} x1="0" y1="0" x2="640" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--brand-soft))" stopOpacity="0.9" />
            <stop offset="1" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {device === 'desktop' ? (
          <g>
            <rect x="70" y="52" width="500" height="316" rx="14" fill="rgb(var(--ink-900))" fillOpacity="0.85" stroke="rgb(var(--border))" />
            <rect x="70" y="52" width="500" height="34" rx="14" fill="rgb(var(--ink-700))" fillOpacity="0.6" />
            <circle cx="92" cy="69" r="4" fill="rgb(var(--brand-soft))" fillOpacity="0.7" />
            <circle cx="106" cy="69" r="4" fill="rgb(var(--border))" />
            <circle cx="120" cy="69" r="4" fill="rgb(var(--border))" />
            <rect x="98" y="112" width="190" height="16" rx="8" fill={`url(#frame-${device})`} />
            <rect x="98" y="140" width="140" height="10" rx="5" fill="rgb(var(--slate-500))" fillOpacity="0.5" />
            <rect x="98" y="162" width="104" height="30" rx="15" fill="rgb(var(--brand))" />
            <rect x="98" y="222" width="130" height="106" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.75" />
            <rect x="240" y="222" width="130" height="106" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.55" />
            <rect x="382" y="222" width="130" height="106" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.35" />
            <rect x="352" y="104" width="160" height="96" rx="12" fill="rgb(var(--brand))" fillOpacity="0.18" stroke="rgb(var(--brand))" strokeOpacity="0.35" />
            <path d="M366 178l30-26 26 20 34-40 30 22" stroke={`url(#frame-${device})`} strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : null}

        {device === 'mobile' ? (
          <g>
            <rect x="248" y="36" width="144" height="330" rx="26" fill="rgb(var(--ink-900))" fillOpacity="0.9" stroke="rgb(var(--border))" />
            <rect x="296" y="48" width="48" height="8" rx="4" fill="rgb(var(--border))" />
            <rect x="266" y="76" width="80" height="12" rx="6" fill={`url(#frame-${device})`} />
            <rect x="266" y="96" width="108" height="8" rx="4" fill="rgb(var(--slate-500))" fillOpacity="0.5" />
            <rect x="266" y="120" width="108" height="66" rx="12" fill="rgb(var(--brand))" fillOpacity="0.2" stroke="rgb(var(--brand))" strokeOpacity="0.4" />
            <rect x="266" y="198" width="52" height="52" rx="12" fill="rgb(var(--ink-700))" />
            <rect x="322" y="198" width="52" height="52" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.6" />
            <rect x="266" y="262" width="108" height="30" rx="15" fill="rgb(var(--brand))" />
            <rect x="266" y="304" width="70" height="8" rx="4" fill="rgb(var(--slate-500))" fillOpacity="0.4" />
            <rect x="150" y="120" width="86" height="140" rx="16" fill="rgb(var(--ink-800))" fillOpacity="0.7" stroke="rgb(var(--border))" />
            <rect x="404" y="150" width="86" height="110" rx="16" fill="rgb(var(--ink-800))" fillOpacity="0.5" stroke="rgb(var(--border))" />
          </g>
        ) : null}

        {device === 'dashboard' ? (
          <g>
            <rect x="56" y="44" width="528" height="312" rx="16" fill="rgb(var(--ink-900))" fillOpacity="0.88" stroke="rgb(var(--border))" />
            <rect x="56" y="44" width="132" height="312" rx="16" fill="rgb(var(--ink-800))" fillOpacity="0.8" />
            <rect x="78" y="76" width="72" height="10" rx="5" fill={`url(#frame-${device})`} />
            {[0, 1, 2, 3, 4].map((row) => (
              <rect key={row} x="78" y={108 + row * 26} width="88" height="8" rx="4" fill="rgb(var(--slate-500))" fillOpacity={0.45 - row * 0.06} />
            ))}
            <rect x="212" y="76" width="150" height="14" rx="7" fill="rgb(var(--white))" fillOpacity="0.85" />
            <rect x="212" y="112" width="108" height="70" rx="12" fill="rgb(var(--brand))" fillOpacity="0.2" stroke="rgb(var(--brand))" strokeOpacity="0.4" />
            <rect x="332" y="112" width="108" height="70" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.7" />
            <rect x="452" y="112" width="108" height="70" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.45" />
            <rect x="212" y="200" width="348" height="132" rx="12" fill="rgb(var(--ink-700))" fillOpacity="0.4" />
            <path d="M236 300l52-34 44 22 56-52 48 30 60-46" stroke={`url(#frame-${device})`} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {[236, 288, 332, 388, 436, 496].map((cx, index) => (
              <circle key={cx} cx={cx} cy={[300, 266, 288, 236, 266, 220][index]} r="4" fill="rgb(var(--accent))" />
            ))}
          </g>
        ) : null}
      </svg>

    </div>
  );
}
