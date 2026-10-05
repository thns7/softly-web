import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

/**
 * Cabeçalho de seção.
 * O rótulo em mono funciona como "cota de desenho técnico" — número da seção
 * à esquerda, assunto à direita.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  action,
  titleId,
  size = 'default',
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
  titleId?: string;
  /** 'compact' é usado onde a seção precisa caber em 100vh (ex.: pin). */
  size?: 'default' | 'compact';
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'items-start',
        action && 'lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        <Reveal>
          <p className="eyebrow">
            {index ? (
              <>
                <span className="text-muted">{index}</span>
              </>
            ) : null}
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            id={titleId}
            className={cn(
              'text-title',
              size === 'compact' ? 'mt-4 text-display-lg' : 'mt-5 text-display-xl',
            )}
          >
            {title}
          </h2>
        </Reveal>
        {description ? (
          <Reveal delay={0.12}>
            <div
              className={cn(
                'max-w-xl text-body',
                size === 'compact' ? 'mt-3 text-body-sm' : 'mt-5 text-lead',
              )}
            >
              {description}
            </div>
          </Reveal>
        ) : null}
      </div>
      {action ? (
        <Reveal delay={0.18} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
