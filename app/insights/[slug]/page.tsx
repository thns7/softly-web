import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ArrowRight } from '@/components/icons/ui-icons';
import { JsonLd } from '@/components/json-ld';
import { Reveal } from '@/components/motion/reveal';
import { SplitText } from '@/components/motion/split-text';
import { Button } from '@/components/ui/button';
import { getAllPosts, getPost, getPostSlugs } from '@/lib/mdx';
import { formatDate } from '@/lib/format';
import { articleSchema, breadcrumbSchema } from '@/lib/jsonld';
import { buildMetadata } from '@/lib/seo';
import { mdxComponents } from '@/components/mdx-components';

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return buildMetadata({ title: 'Post não encontrado', noIndex: true });

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/insights/${post.slug}`,
    ogTitle: post.title,
    ogSubtitle: post.description,
    type: 'article',
    publishedTime: post.date,
  });
}

/** Post do blog em MDX, com layout editorial de coluna única. */
export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const others = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className="pb-24">
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            date: post.date,
            slug: post.slug,
            author: post.author,
          }),
          breadcrumbSchema([
            { name: 'Início', path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
        ]}
      />

      <header className="relative isolate overflow-hidden pb-12 pt-[calc(var(--header-h)+4rem)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[30%] -z-10 h-[36rem] w-[36rem] animate-mesh-drift rounded-pill blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.143), transparent 62%)' }}
        />

        <div className="shell">
          <Reveal>
            <nav aria-label="Trilha de navegação" className="flex items-center gap-2 font-mono text-label uppercase text-muted">
              <Link href="/" className="transition-colors hover:text-brand-soft">
                Início
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/insights" className="transition-colors hover:text-brand-soft">
                Insights
              </Link>
            </nav>
          </Reveal>

          <div className="mt-8 max-w-3xl">
            <Reveal>
              <p className="eyebrow">
                {post.category}
                <span aria-hidden="true">·</span>
                {post.readingTime} min de leitura
              </p>
            </Reveal>

            <h1 className="mt-6 text-display-xl text-title">
              <SplitText text={post.title} mode="word" />
            </h1>

            <Reveal delay={0.15}>
              <p className="mt-6 text-lead text-body">{post.description}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 font-mono text-label uppercase text-muted">
                {post.author} · {formatDate(post.date)}
              </p>
            </Reveal>
          </div>
        </div>
      </header>

      <div className="shell">
        <div className="divider-glow" />
        <div className="mx-auto mt-12 max-w-prose">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            // remark-gfm habilita tabela, task list e autolink no MDX
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <div className="mx-auto mt-16 max-w-prose">
          <div className="glass rounded-bento p-8">
            <p className="font-mono text-label uppercase text-brand-soft">Próximo passo</p>
            <p className="mt-4 text-display-sm text-title">
              Quer aplicar isso no seu negócio?
            </p>
            <p className="mt-3 text-body-sm text-body">
              Diagnóstico gratuito, sem compromisso. Em até 1 dia útil você tem uma resposta.
            </p>
            <Button asChild className="mt-6" trailing={<ArrowRight className="h-5 w-5" />}>
              <Link href="/#contato">Solicitar orçamento</Link>
            </Button>
          </div>
        </div>

        {others.length ? (
          <div className="mx-auto mt-16 max-w-prose">
            <h2 className="font-mono text-label uppercase text-muted">Leia também</h2>
            <ul className="mt-6 space-y-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/insights/${item.slug}`}
                    className="card-surface group flex items-center justify-between gap-6 rounded-card p-5 transition-transform duration-500 ease-expo hover:-translate-y-1"
                  >
                    <span className="text-body-sm text-title">{item.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-soft transition-transform duration-300 ease-expo group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
