import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, Quote } from '@/components/icons/ui-icons';
import { JsonLd } from '@/components/json-ld';
import { Parallax } from '@/components/motion/parallax';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { ProjectFrame } from '@/components/project-frame';
import { Button } from '@/components/ui/button';
import { getProject, projects } from '@/content/projects';
import { breadcrumbSchema, caseStudySchema } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return buildMetadata({ title: 'Projeto não encontrado', noIndex: true });

  return buildMetadata({
    title: `${project.client}: ${project.headlineResult}`,
    description: project.summary,
    path: `/projetos/${project.slug}`,
    ogTitle: project.client,
    ogSubtitle: project.headlineResult,
    type: 'article',
  });
}

/**
 * Case study — layout editorial.
 * A coluna de texto é estreita (prosa legível) e os blocos de dado sangram para
 * fora dela, com parallax leve. Cada bloco entra com o mesmo reveal do restante
 * do site, para a navegação não mudar de linguagem.
 */
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length]!;

  return (
    <article>
      <JsonLd
        data={[
          caseStudySchema(project),
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Projetos', path: '/#portfolio' },
            { name: project.client, path: `/projetos/${project.slug}` },
          ]),
        ]}
      />

      {/* Cabeçalho */}
      <header className="relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+4rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[30%] -z-10 h-[42rem] w-[42rem] animate-mesh-drift rounded-pill blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.187), transparent 62%)' }}
        />

        <div className="shell">
          <Reveal>
            <nav aria-label="Trilha de navegação" className="flex items-center gap-2 font-mono text-label uppercase text-muted">
              <Link href="/" className="transition-colors hover:text-brand-soft">
                Início
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/#portfolio" className="transition-colors hover:text-brand-soft">
                Projetos
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-brand-soft">{project.client}</span>
            </nav>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal delay={0.05}>
                <p className="eyebrow">
                  {project.category}
                  <span className="h-px w-6 bg-line" aria-hidden="true" />
                  {project.segment}
                </p>
              </Reveal>

              <h1 className="mt-6 text-display-hero text-title">
                <SplitText text={project.client} mode="word" />
              </h1>

              <Reveal delay={0.15}>
                <p className="mt-6 max-w-2xl text-lead text-body">{project.title}</p>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="lg:col-span-4">
              <dl className="glass grid grid-cols-2 gap-6 rounded-bento p-6">
                <div>
                  <dt className="font-mono text-label uppercase text-muted">Ano</dt>
                  <dd className="mt-2 font-mono text-body text-title">{project.year}</dd>
                </div>
                <div>
                  <dt className="font-mono text-label uppercase text-muted">Duração</dt>
                  <dd className="mt-2 font-mono text-body text-title">{project.duration}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-mono text-label uppercase text-muted">Resultado principal</dt>
                  <dd className="mt-2 font-mono text-lead text-brand-soft">
                    {project.headlineResult}
                  </dd>
                </div>
                {project.liveUrl ? (
                  <div className="col-span-2 border-t border-line/70 pt-5">
                    <dt className="sr-only">Endereço do projeto</dt>
                    <dd>
                      {/* rel: link externo para site de cliente — sem noopener o
                          site de destino ganha window.opener do nosso. */}
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/live inline-flex items-center gap-2 rounded-pill font-mono text-body-sm text-title transition-colors duration-300 hover:text-brand-soft"
                      >
                        {project.liveUrl.replace(/^https?:\/\//, '')}
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-soft transition-transform duration-300 ease-expo group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.25} className="mt-14">
            <Parallax speed={0.06}>
              <div className="overflow-hidden rounded-bento border border-line/70 p-3">
                {/* Herói do case: ocupa a largura da shell e é o LCP da página. */}
                <ProjectFrame
                  project={project}
                  sizes="(max-width: 1024px) 94vw, 1200px"
                  priority
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </header>

      {/* Corpo editorial */}
      <div className="shell pb-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-2">
            <section aria-labelledby="desafio" className="pt-16">
              <Reveal>
                <h2 id="desafio" className="text-display-lg text-title">
                  O desafio
                </h2>
              </Reveal>
              <RevealGroup className="mt-7 space-y-5">
                {project.challenge.map((item) => (
                  <RevealItem key={item.slice(0, 20)}>
                    <p className="text-body text-body">{item}</p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>

            <section aria-labelledby="solucao" className="pt-16">
              <Reveal>
                <h2 id="solucao" className="text-display-lg text-title">
                  O que construímos
                </h2>
              </Reveal>
              <RevealGroup className="mt-7 space-y-4">
                {project.solution.map((item) => (
                  <RevealItem key={item.slice(0, 20)}>
                    <p className="flex gap-4 text-body text-body">
                      <Check className="mt-1.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </section>
          </div>

          {/* Stack em coluna lateral, deslocada */}
          <aside className="lg:col-span-3 lg:col-start-10 lg:pt-32">
            <Reveal>
              <div className="card-surface sticky top-[calc(var(--header-h)+2rem)] rounded-card p-6">
                <p className="font-mono text-label uppercase text-brand-soft">Stack</p>
                <ul className="mt-5 space-y-2.5">
                  {project.stack.map((tech) => (
                    <li key={tech} className="font-mono text-body-sm text-body">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>

      {/* Galeria de telas.
          Cada imagem tem legenda porque captura de interface sem contexto não
          conta nada: quem lê o case quer saber o que aquela tela resolve. */}
      {project.gallery?.length ? (
        <section aria-labelledby="telas" className="shell pb-6 pt-16">
          <Reveal>
            <h2 id="telas" className="text-display-lg text-title">
              Por dentro
            </h2>
            <p className="mt-4 max-w-2xl text-body text-body">
              {project.gallery.length} telas do projeto, com o que cada uma resolve.
            </p>
          </Reveal>

          <div className="mt-12 space-y-14">
            {project.gallery.map((shot, index) => (
              <Reveal key={shot.src} delay={0.05}>
                <figure>
                  <div className="overflow-hidden rounded-bento border border-line/70 p-3">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[18px] border border-line/70 bg-ink-800">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        fill
                        sizes="(max-width: 1024px) 94vw, 1200px"
                        className="object-cover"
                        quality={82}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  </div>
                  <figcaption className="mt-5 flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1 font-mono text-label text-brand-soft"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="max-w-2xl text-body text-body">{shot.caption}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Resultados */}
      <section aria-labelledby="resultados" className="relative isolate mt-10 overflow-hidden py-20">
        <div className="divider-glow absolute inset-x-0 top-0" />
        <div className="divider-glow absolute inset-x-0 bottom-0" />

        <div className="shell">
          <Reveal>
            <h2 id="resultados" className="text-display-lg text-title">
              Resultados
            </h2>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {project.results.map((result) => (
              <RevealItem key={result.label}>
                <p className="font-display text-[clamp(2.2rem,3.6vw,3rem)] font-bold leading-none tracking-[-0.04em] text-title">
                  {result.value}
                </p>
                <p className="mt-4 text-body-sm text-muted">{result.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Depoimento */}
      {project.testimonial ? (
        <section className="shell py-20">
          <Reveal>
            <figure className="glass relative mx-auto max-w-3xl rounded-bento p-8 lg:p-12">
              <Quote className="h-10 w-10 text-brand/30" />
              <blockquote className="mt-6 font-display text-display-md text-title">
                <p>“{project.testimonial.quote}”</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-line" aria-hidden="true" />
                <span className="text-body-sm text-body">
                  <span className="font-bold text-title">{project.testimonial.author}</span> ·{' '}
                  {project.testimonial.role}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </section>
      ) : null}

      {/* Próximo projeto + CTA */}
      <section className="shell pb-24">
        {/* min-w-0: item de grid tem min-width:auto por padrão, então o card
            não encolhia abaixo do texto e vazava a tela em 320px. */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="min-w-0">
            <Link
              href={`/projetos/${next.slug}`}
              className="card-surface border-sheen group flex h-full flex-col justify-between rounded-bento p-8 transition-transform duration-500 ease-expo hover:-translate-y-1.5"
            >
              <p className="font-mono text-label uppercase text-muted">Próximo projeto</p>
              <div className="mt-8">
                <p className="text-display-md text-title">{next.client}</p>
                <p className="mt-3 text-body-sm text-body">{next.headlineResult}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-label uppercase text-brand-soft">
                Abrir o caso
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="min-w-0">
            <div className="glass flex h-full flex-col justify-between rounded-bento p-8">
              <p className="font-mono text-label uppercase text-brand-soft">Seu projeto</p>
              <p className="mt-8 text-display-md text-title">
                Quer um resultado desses no seu negócio?
              </p>
              <div className="mt-8">
                <Button asChild size="lg" trailing={<ArrowRight className="h-5 w-5" />}>
                  <Link href="/#contato">Solicitar orçamento</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </article>
  );
}
