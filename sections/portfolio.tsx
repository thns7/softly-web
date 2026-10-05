'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from '@/components/icons/ui-icons';
import { Reveal } from '@/components/motion/reveal';
import { ProjectFrame } from '@/components/project-frame';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { projectCategories, projects, type Project } from '@/content/projects';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

/**
 * Portfólio com filtro por categoria.
 * A troca usa `layout` do Framer Motion: os cards se reposicionam com FLIP
 * (transform puro), sem repintar a página.
 *
 * As larguras vêm da quantidade visível, não do projeto: contagem ímpar abre
 * com um card de 12 colunas e o resto segue em pares 7/5 · 5/7. Assim a grade
 * continua assimétrica e nenhuma linha fica pela metade em qualquer filtro —
 * inclusive quando a categoria tem um projeto só.
 */
type Span = { className: string; sizes: string; wide: boolean };

/** Até 1024px a grade é de uma coluna só, então o trecho móvel é comum a todos. */
const MOBILE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 94vw';

/** Card de abertura: imagem ao lado do texto, ocupando a largura inteira. */
const WIDE: Span = { className: 'lg:col-span-12', sizes: `${MOBILE_SIZES}, 660px`, wide: true };
const HALF: Span = { className: 'lg:col-span-6', sizes: `${MOBILE_SIZES}, 620px`, wide: false };

function spansFor(count: number): Span[] {
  const spans: Span[] = [];
  let index = 0;

  if (count % 2 === 1) {
    spans.push(WIDE);
    index = 1;
  }

  for (; index < count; index += 1) spans.push(HALF);

  return spans;
}

export function Portfolio() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('Todos');

  const visible = useMemo(
    () => (filter === 'Todos' ? projects : projects.filter((item) => item.category === filter)),
    [filter],
  );

  const spans = useMemo(() => spansFor(visible.length), [visible.length]);

  return (
    <section id="portfolio" aria-labelledby="portfolio-titulo" className="section-y relative">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Portfólio"
          titleId="portfolio-titulo"
          title="Projeto no ar, endereço para conferir."
          description="Cinco casos com o problema que existia antes, o que foi construído e o link para abrir agora."
          action={
            <Button asChild variant="outline" trailing={<ArrowUpRight className="h-4 w-4" />}>
              <Link href="#contato">Quero um resultado assim</Link>
            </Button>
          }
        />

        {/* Filtros */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filtrar projetos por categoria"
            className="mt-12 flex flex-wrap gap-2"
          >
            {projectCategories.map((category) => {
              const active = category === filter;
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(category)}
                  className={cn(
                    'relative rounded-pill border px-4 py-2.5 text-body-sm transition-colors duration-micro ease-expo',
                    active ? 'border-transparent text-white' : 'border-line text-body hover:text-title',
                  )}
                >
                  {/* Antes era um `motion.span` com `layoutId`, que desliza
                      entre os filtros. O deslize e bonito e custou caro: a
                      projecao de layout do Framer mexe no DOM por fora do
                      React e, ao desmontar a secao no meio da navegacao,
                      derrubava a pagina de destino. Aqui a pilula e um span
                      comum, um por botao, com transicao de opacidade. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-0 -z-10 rounded-pill bg-brand transition-opacity duration-300 ease-expo',
                      active ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {category}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grade.
            Era `AnimatePresence mode="popLayout"` com `layout` nos cards. Esse
            modo tira o item que sai do fluxo e passa a posicionar tudo por
            conta propria, fora do React — e e daqui que a pessoa clica para
            navegar. Desmontar a secao com uma animacao em voo estourava
            `removeChild` e a rota de destino abria como tela de erro.

            Agora a grade e uma grade. A entrada de cada card e uma animacao
            CSS; a `key` inclui o filtro para ela reiniciar quando a lista
            muda, que era o unico efeito que o AnimatePresence dava aqui. */}
        <div className="mt-8 grid gap-5 lg:grid-cols-12">
          {visible.map((project, index) => (
            <article
              key={`${filter}-${project.slug}`}
              className={cn(
                'min-w-0 animate-enter-card sm:col-span-1',
                spans[index]?.className,
              )}
              style={{ animationDelay: `${Math.min(index, 6) * 55}ms` }}
            >
              <ProjectCard
                project={project}
                sizes={spans[index]?.sizes}
                wide={spans[index]?.wide ?? false}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


/**
 * O card inteiro abre o projeto no ar — é o que a pessoa espera de um
 * portfólio. O case study continua a um clique, no link do rodapé do card.
 *
 * Como: o título recebe um `::after` esticado (`after:absolute after:inset-0`)
 * que vira a área clicável do card inteiro. Isso mantém um só link por destino
 * no DOM — leitor de tela ouve "VAR Center Log, link" em vez de três links
 * repetidos — e evita âncora dentro de âncora, que é HTML inválido.
 * O link do case fica acima desse `::after` com `relative z-10`.
 *
 * O card só identifica: imagem, categoria · ano e o nome do cliente. Título,
 * resumo, stack e resultado moram na página do case — o card é a capa, não o
 * texto. Com cinco projetos empilhados, cada um com quatro blocos de texto, a
 * seção virava leitura antes de virar vitrine.
 *
 * `wide` troca o empilhamento por duas colunas — imagem de um lado, texto do
 * outro — no card de abertura da grade.
 */
function ProjectCard({
  project,
  sizes,
  wide,
}: {
  project: Project;
  sizes?: string;
  wide: boolean;
}) {
  const caseHref = `/projetos/${project.slug}`;
  const domain = project.liveUrl?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

  return (
    <article
      className={cn(
        'group card-surface border-sheen relative flex h-full overflow-hidden rounded-bento p-3 shadow-e1 transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:shadow-e3',
        wide ? 'flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-3' : 'flex-col',
      )}
    >
      {/* A proporcao 16/10 e mantida tambem no card largo: esticar a imagem
          para a altura da coluna de texto fazia o object-cover comer a lateral
          da captura — no VAR Center Log, o proprio titulo do site. */}
      <div className="relative overflow-hidden rounded-[18px]">
        <div className="transition-transform duration-700 ease-expo group-hover:scale-[1.03]">
          <ProjectFrame project={project} sizes={sizes} />
        </div>
      </div>

      <div className={cn('flex flex-1 flex-col', wide ? 'p-6 lg:justify-center lg:p-10' : 'p-6')}>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
          {project.category} · {project.year}
        </p>

        <h3 className={cn('mb-7 mt-3 text-title', wide ? 'text-display-md' : 'text-display-sm')}>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('project_open_live', { slug: project.slug })}
              className="after:absolute after:inset-0 after:content-[''] hover:text-brand-soft"
            >
              {project.client}
              <span className="sr-only">: abrir o projeto no ar, em nova aba</span>
            </a>
          ) : (
            <Link
              href={caseHref}
              onClick={() => track('project_view', { slug: project.slug })}
              className="after:absolute after:inset-0 after:content-[''] hover:text-brand-soft"
            >
              {project.client}
            </Link>
          )}
        </h3>

        {/* mt-auto cola o rodapé na base: os cards de uma mesma linha têm
            alturas de conteúdo diferentes e as duas ações ficam alinhadas. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-line/60 pt-5">
          {/* z-10: precisa ficar acima do ::after do título, senão o clique
              aqui também abriria o site do projeto.
              É a única porta para a descrição do projeto, e em caixa-alta de
              11px o link media 16px de altura: o ::before transparente leva a
              área de toque a 44px sem mexer no traço. */}
          <Link
            href={caseHref}
            onClick={() => track('project_view', { slug: project.slug })}
            className="relative z-10 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors duration-300 ease-expo before:absolute before:-inset-x-2 before:-inset-y-3.5 before:content-[''] hover:text-title"
          >
            Ver o case
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          {/* Decorativo: quem clica aqui cai no ::after do título e abre o
              site do mesmo jeito. Fica aria-hidden para o leitor de tela não
              ouvir o mesmo destino duas vezes. */}
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border border-line px-4 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-brand-soft transition-all duration-300 ease-expo group-hover:border-brand group-hover:bg-brand group-hover:text-white"
          >
            {/* O dominio so cabe no card a partir de ~640px: em 320px
                "marmitapro-alpha.vercel.app" media 276px num rodape de 206px e
                era cortado pelo overflow-hidden do card. */}
            {domain ? (
              <>
                <span className="sm:hidden">Abrir o site</span>
                <span className="hidden sm:inline">{domain}</span>
              </>
            ) : (
              'Ver o case'
            )}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
