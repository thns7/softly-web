'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check } from '@/components/icons/ui-icons';
import { summarizeEstimate, useEstimateStore } from '@/components/estimate-store';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Reveal } from '@/components/motion/reveal';
import { useSmoothScroll } from '@/components/motion/smooth-scroll';
import { SectionHeading } from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { Range } from '@/components/ui/range';
import {
  calculatorDisclaimer,
  craftLevels,
  integrations,
  projectTypes,
  timelines,
} from '@/content/calculator';
import { track } from '@/lib/analytics';
import { defaultEstimateInput, estimate as computeEstimate } from '@/lib/estimate';
import { cn } from '@/lib/utils';

/**
 * Calculadora de orçamento.
 *
 * A conta vive em lib/estimate.ts (pura e determinística) e é reaproveitada
 * pelo servidor quando a proposta é enviada — o número que o visitante viu é
 * exatamente o número que chega para a Softly.
 */
export function Calculator() {
  const [typeId, setTypeId] = useState(defaultEstimateInput.typeId);
  const [units, setUnits] = useState(defaultEstimateInput.units);
  const [integrationIds, setIntegrationIds] = useState<string[]>([
    ...defaultEstimateInput.integrationIds,
  ]);
  const [timelineId, setTimelineId] = useState(defaultEstimateInput.timelineId);
  const [craftId, setCraftId] = useState(defaultEstimateInput.craftId);

  const { setEstimate } = useEstimateStore();
  const { scrollTo } = useSmoothScroll();

  const type = useMemo(
    () => projectTypes.find((item) => item.id === typeId) ?? projectTypes[0]!,
    [typeId],
  );

  // Ao trocar de tipo, o número de páginas/telas volta para o padrão daquele tipo.
  useEffect(() => {
    setUnits(type.unitDefault);
  }, [type]);

  const result = useMemo(
    () => computeEstimate({ typeId, units, integrationIds, timelineId, craftId }),
    [typeId, units, integrationIds, timelineId, craftId],
  );

  const toggleIntegration = (id: string) => {
    setIntegrationIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
    track('calculator_use', { field: 'integracao', value: id });
  };

  const requestProposal = () => {
    setEstimate({
      total: result.total,
      min: result.min,
      max: result.max,
      weeks: result.weeks,
      summary: summarizeEstimate(result),
    });
    track('calculator_lead', { total: result.total, weeks: result.weeks, type: typeId });
    scrollTo('#contato', { offset: -100 });
  };

  return (
    <section id="orcamento" aria-labelledby="orcamento-titulo" className="section-y relative">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Calculadora"
          titleId="orcamento-titulo"
          title="Monte o seu escopo e veja a faixa na hora."
          description="Sem formulário no meio do caminho e sem “fale com um consultor”. Escolha o que precisa e o número atualiza enquanto você mexe."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Controles */}
          <Reveal className="min-w-0 lg:col-span-7">
            <div className="card-surface rounded-bento p-7 lg:p-9">
              <fieldset>
                <legend className="font-mono text-label uppercase text-brand-soft">
                  01 · Tipo de projeto
                </legend>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {projectTypes.map((option) => (
                    <OptionButton
                      key={option.id}
                      active={option.id === typeId}
                      title={option.label}
                      hint={option.hint}
                      onClick={() => {
                        setTypeId(option.id);
                        track('calculator_use', { field: 'tipo', value: option.id });
                      }}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="divider-glow my-8" />

              <fieldset>
                <legend className="mb-5 font-mono text-label uppercase text-brand-soft">
                  02 · Tamanho
                </legend>
                <Range
                  label={`Quantidade de ${type.unitLabel}`}
                  valueLabel={`${units} ${type.unitLabel}`}
                  min={type.unitMin}
                  max={type.unitMax}
                  step={1}
                  value={units}
                  onChange={(event) => {
                    setUnits(Number(event.target.value));
                    track('calculator_use', { field: 'tamanho', value: event.target.value });
                  }}
                />
                <div className="mt-2 flex justify-between font-mono text-[0.6875rem] text-muted">
                  <span>{type.unitMin}</span>
                  <span>{type.unitMax}</span>
                </div>
              </fieldset>

              <div className="divider-glow my-8" />

              <fieldset>
                <legend className="font-mono text-label uppercase text-brand-soft">
                  03 · Integrações
                </legend>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {integrations.map((option) => (
                    <OptionButton
                      key={option.id}
                      active={integrationIds.includes(option.id)}
                      title={option.label}
                      hint={option.hint}
                      onClick={() => toggleIntegration(option.id)}
                      multi
                    />
                  ))}
                </div>
              </fieldset>

              <div className="divider-glow my-8" />

              <div className="grid gap-8 sm:grid-cols-2">
                <fieldset>
                  <legend className="font-mono text-label uppercase text-brand-soft">
                    04 · Prazo
                  </legend>
                  <div className="mt-5 space-y-2.5">
                    {timelines.map((option) => (
                      <OptionButton
                        key={option.id}
                        active={option.id === timelineId}
                        title={option.label}
                        hint={option.hint}
                        onClick={() => {
                          setTimelineId(option.id);
                          track('calculator_use', { field: 'prazo', value: option.id });
                        }}
                        compact
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="font-mono text-label uppercase text-brand-soft">
                    05 · Acabamento
                  </legend>
                  <div className="mt-5 space-y-2.5">
                    {craftLevels.map((option) => (
                      <OptionButton
                        key={option.id}
                        active={option.id === craftId}
                        title={option.label}
                        hint={option.hint}
                        onClick={() => {
                          setCraftId(option.id);
                          track('calculator_use', { field: 'acabamento', value: option.id });
                        }}
                        compact
                      />
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </Reveal>

          {/* Resultado */}
          <Reveal delay={0.1} className="min-w-0 lg:col-span-5">
            <div className="glass sticky top-[calc(var(--header-h)+1.5rem)] overflow-hidden rounded-bento p-7 lg:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-pill blur-[80px]"
                style={{ background: 'radial-gradient(circle, rgb(var(--glow) / 0.193), transparent 65%)' }}
              />

              <p className="font-mono text-label uppercase text-muted">Estimativa de investimento</p>

              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-mono text-lead text-muted">R$</span>
                <AnimatedNumber
                  value={result.total}
                  className="font-display text-[clamp(2.6rem,6vw,3.6rem)] font-bold leading-none tracking-[-0.04em] text-title"
                />
              </p>

              <p className="mt-3 font-mono text-body-sm text-muted" aria-live="polite">
                Faixa provável: R$ <AnimatedNumber value={result.min} /> a R${' '}
                <AnimatedNumber value={result.max} />
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="rounded-card border border-line/70 bg-surface/40 p-4">
                  <p className="font-mono text-label uppercase text-muted">Prazo</p>
                  <p className="mt-2 font-mono text-[1.35rem] text-title">
                    <AnimatedNumber value={result.weeks} format="number" /> sem
                  </p>
                </div>
                <div className="rounded-card border border-line/70 bg-surface/40 p-4">
                  <p className="font-mono text-label uppercase text-muted">Integrações</p>
                  <p className="mt-2 font-mono text-[1.35rem] text-title">
                    {String(result.chosenIntegrations.length).padStart(2, '0')}
                  </p>
                </div>
              </div>

              <div className="divider-glow my-7" />

              <ul className="space-y-3">
                {result.breakdown
                  .filter((line) => line.value !== 0)
                  .map((line) => (
                    <li key={line.label} className="flex items-start justify-between gap-4 text-body-sm">
                      <span className="text-body">{line.label}</span>
                      <span className="numeric shrink-0 font-mono text-muted">
                        {line.value > 0 ? '+' : '−'} R$ <AnimatedNumber value={Math.abs(line.value)} />
                      </span>
                    </li>
                  ))}
              </ul>

              <Button
                size="lg"
                className="mt-8 w-full"
                trailing={<ArrowRight className="h-5 w-5" />}
                onClick={requestProposal}
              >
                Receber proposta detalhada
              </Button>

              <p className="mt-4 flex items-start gap-2 text-body-sm text-muted">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                {calculatorDisclaimer}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OptionButton({
  active,
  title,
  hint,
  onClick,
  multi = false,
  compact = false,
}: {
  active: boolean;
  title: string;
  hint: string;
  onClick: () => void;
  multi?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group/opt relative flex w-full items-start gap-3 rounded-card border p-4 text-left transition-all duration-300 ease-expo',
        active
          ? 'border-brand/60 bg-brand/10 text-title shadow-[0_0_0_1px_rgb(var(--brand)/0.25)]'
          : 'border-line bg-surface/40 text-body hover:border-brand/40 hover:bg-surface/70',
        compact && 'p-3.5',
      )}
    >
      <span
        className={cn(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-all duration-300 ease-expo',
          multi ? 'rounded-[7px]' : 'rounded-pill',
          active ? 'border-brand bg-brand text-white' : 'border-line bg-transparent text-transparent',
        )}
      >
        <Check className="h-3 w-3" />
      </span>
      <span className="min-w-0">
        <span className="block text-body-sm font-bold text-title">{title}</span>
        <span className="mt-0.5 block text-body-sm text-muted">{hint}</span>
      </span>
    </button>
  );
}
