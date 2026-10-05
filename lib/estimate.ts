import {
  craftLevels,
  integrations,
  projectTypes,
  timelines,
  type IntegrationOption,
  type MultiplierOption,
  type ProjectTypeOption,
} from '@/content/calculator';
import { clamp, roundTo } from '@/lib/utils';

export type EstimateInput = {
  typeId: string;
  units: number;
  integrationIds: string[];
  timelineId: string;
  craftId: string;
};

export type EstimateResult = {
  /** Valor central, já arredondado para o múltiplo de R$ 500 mais próximo. */
  total: number;
  /** Faixa exibida ao usuário (±12%). */
  min: number;
  max: number;
  weeks: number;
  breakdown: { label: string; value: number }[];
  type: ProjectTypeOption;
  timeline: MultiplierOption;
  craft: MultiplierOption;
  chosenIntegrations: IntegrationOption[];
};

const byId = <T extends { id: string }>(list: T[], id: string, fallback: T): T =>
  list.find((item) => item.id === id) ?? fallback;

/**
 * Conta da calculadora de orçamento.
 *
 *   (base + unidades extras + integrações) × prazo × acabamento
 *
 * É determinística e pura de propósito: a mesma entrada sempre gera o mesmo
 * número no cliente e no servidor (o e-mail da proposta reusa esta função).
 */
export function estimate(input: EstimateInput): EstimateResult {
  const fallbackType = projectTypes[0] as ProjectTypeOption;
  const fallbackTimeline = timelines[0] as MultiplierOption;
  const fallbackCraft = craftLevels[0] as MultiplierOption;

  const type = byId(projectTypes, input.typeId, fallbackType);
  const timeline = byId(timelines, input.timelineId, fallbackTimeline);
  const craft = byId(craftLevels, input.craftId, fallbackCraft);

  const units = clamp(Math.round(input.units), type.unitMin, type.unitMax);
  const extraUnits = Math.max(0, units - type.unitMin);
  const unitsCost = extraUnits * type.perUnit;

  const chosenIntegrations = integrations.filter((item) =>
    input.integrationIds.includes(item.id),
  );
  const integrationsCost = chosenIntegrations.reduce((sum, item) => sum + item.price, 0);

  const subtotal = type.base + unitsCost + integrationsCost;
  const total = roundTo(subtotal * timeline.multiplier * craft.multiplier, 500);

  const integrationWeeks = chosenIntegrations.reduce((sum, item) => sum + item.weeks, 0);
  const unitWeeks = extraUnits * 0.18;
  const weeks = Math.max(
    2,
    Math.round(
      (type.baseWeeks + unitWeeks + integrationWeeks) *
        timeline.weeksMultiplier *
        craft.weeksMultiplier,
    ),
  );

  return {
    total,
    min: roundTo(total * 0.88, 500),
    max: roundTo(total * 1.12, 500),
    weeks,
    type,
    timeline,
    craft,
    chosenIntegrations,
    breakdown: [
      { label: `${type.label}, escopo base`, value: type.base },
      { label: `${extraUnits} ${type.unitLabel} além do mínimo`, value: unitsCost },
      { label: `${chosenIntegrations.length} integrações`, value: integrationsCost },
      {
        label: `Prazo ${timeline.label.toLowerCase()} e acabamento ${craft.label.toLowerCase()}`,
        value: total - subtotal,
      },
    ],
  };
}

export const defaultEstimateInput: EstimateInput = {
  typeId: (projectTypes[1] ?? (projectTypes[0] as ProjectTypeOption)).id,
  units: (projectTypes[1] ?? (projectTypes[0] as ProjectTypeOption)).unitDefault,
  integrationIds: ['whatsapp', 'cms'],
  timelineId: 'normal',
  craftId: 'medida',
};
