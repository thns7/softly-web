import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { site } from '@/content/site';
import type { LegalSection } from '@/content/legal';
import { formatDate } from '@/lib/format';

/**
 * Renderizador dos documentos legais.
 * Índice fixo à esquerda no desktop, prosa em coluna estreita à direita.
 */
export function LegalPage({
  title,
  intro,
  updatedAt,
  sections,
}: {
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <div className="pb-24">
      <header className="relative isolate overflow-hidden pb-12 pt-[calc(var(--header-h)+4rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[34%] -z-10 h-[34rem] w-[34rem] rounded-pill blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.121), transparent 62%)' }}
        />

        <div className="shell">
          <Reveal>
            <p className="eyebrow">Documento legal</p>
          </Reveal>
          <h1 className="mt-6 max-w-3xl text-display-xl text-title">{title}</h1>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lead text-body">{intro}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 font-mono text-label uppercase text-muted">
              Atualizado em {formatDate(updatedAt)} · {site.legalName}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="shell">
        <div className="divider-glow" />

        {/* min-w-0: item de grid tem min-width auto, entao um token longo do
            texto legal (o e-mail do encarregado, por exemplo) esticava a coluna e a
            pagina vazava 246px em 320px. */}
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <nav aria-label="Índice do documento" className="min-w-0 lg:col-span-3">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <p className="font-mono text-label uppercase text-muted">Índice</p>
              <ul className="mt-5 space-y-2.5">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link
                      href={`#${section.id}`}
                      className="text-body-sm text-body transition-colors duration-micro hover:text-brand-soft"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 break-words lg:col-span-8 lg:col-start-5">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-14 scroll-mt-32">
                <Reveal>
                  <h2 className="text-display-sm text-title">{section.title}</h2>
                </Reveal>

                <div className="mt-5 space-y-5">
                  {section.blocks.map((block, index) => {
                    if (block.type === 'paragraph') {
                      return (
                        <p key={index} className="text-body text-body">
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === 'list') {
                      return (
                        <ul key={index} className="space-y-3">
                          {block.items.map((item) => (
                            <li key={item.slice(0, 24)} className="relative pl-6 text-body text-body">
                              <span
                                aria-hidden="true"
                                className="absolute left-0 top-3 h-1.5 w-1.5 rounded-pill bg-brand-soft"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <div
                        key={index}
                        className="no-scrollbar overflow-x-auto rounded-card border border-line/70"
                      >
                        <table className="w-full min-w-[34rem] border-collapse text-left">
                          <thead className="bg-surface/70">
                            <tr>
                              {block.head.map((cell) => (
                                <th
                                  key={cell}
                                  scope="col"
                                  className="px-5 py-4 font-mono text-label uppercase text-muted"
                                >
                                  {cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row) => (
                              <tr key={row.join('-')} className="border-t border-line/50">
                                {row.map((cell) => (
                                  <td key={cell} className="px-5 py-4 text-body-sm text-body">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
