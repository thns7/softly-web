/**
 * Dados da calculadora de orçamento.
 *
 * TODO: substituir por dado real — os valores abaixo são exemplos calibrados
 * para ficarem coerentes com content/pricing.ts.
 *
 * COMO EDITAR
 * - `base`: valor inicial do tipo de projeto.
 * - `perUnit`: quanto cada página/tela adiciona.
 * - `multiplier`: fatores de prazo e nível de acabamento (1 = neutro).
 * A conta em si vive em lib/estimate.ts.
 */
export type ProjectTypeOption = {
  id: string;
  label: string;
  hint: string;
  base: number;
  perUnit: number;
  unitLabel: string;
  unitMin: number;
  unitMax: number;
  unitDefault: number;
  /** Semanas estimadas de entrega no escopo mínimo. */
  baseWeeks: number;
};

export const projectTypes: ProjectTypeOption[] = [
  {
    id: 'landing',
    label: 'Landing page',
    hint: 'Uma página focada em conversão',
    base: 6900,
    perUnit: 1200,
    unitLabel: 'seções',
    unitMin: 3,
    unitMax: 12,
    unitDefault: 6,
    baseWeeks: 3,
  },
  {
    id: 'site',
    label: 'Site institucional',
    hint: 'Presença completa com blog e SEO',
    base: 12900,
    perUnit: 1800,
    unitLabel: 'páginas',
    unitMin: 3,
    unitMax: 30,
    unitDefault: 6,
    baseWeeks: 4,
  },
  {
    id: 'ecommerce',
    label: 'Loja virtual',
    hint: 'Catálogo, carrinho e pagamento',
    base: 24900,
    perUnit: 900,
    unitLabel: 'páginas',
    unitMin: 4,
    unitMax: 40,
    unitDefault: 10,
    baseWeeks: 7,
  },
  {
    id: 'app',
    label: 'Aplicativo',
    hint: 'Web, iOS e Android',
    base: 46000,
    perUnit: 3200,
    unitLabel: 'telas',
    unitMin: 5,
    unitMax: 40,
    unitDefault: 12,
    baseWeeks: 9,
  },
  {
    id: 'sistema',
    label: 'Sistema ou SaaS',
    hint: 'Regra de negócio própria',
    base: 58000,
    perUnit: 3800,
    unitLabel: 'telas',
    unitMin: 5,
    unitMax: 40,
    unitDefault: 14,
    baseWeeks: 11,
  },
];

export type IntegrationOption = {
  id: string;
  label: string;
  hint: string;
  price: number;
  weeks: number;
};

export const integrations: IntegrationOption[] = [
  { id: 'whatsapp', label: 'WhatsApp API', hint: 'Disparos e atendimento oficial', price: 4900, weeks: 1 },
  { id: 'pagamentos', label: 'Pagamentos e Pix', hint: 'Cobrança e conciliação', price: 5900, weeks: 1 },
  { id: 'crm', label: 'CRM ou ERP', hint: 'Integração com o que você já usa', price: 7900, weeks: 2 },
  { id: 'ia', label: 'IA aplicada', hint: 'Atendimento, triagem ou busca', price: 9900, weeks: 2 },
  { id: 'login', label: 'Área logada', hint: 'Cadastro, permissões e perfis', price: 8900, weeks: 2 },
  { id: 'cms', label: 'Painel de conteúdo', hint: 'Seu time edita sem depender de nós', price: 3900, weeks: 1 },
];

export type MultiplierOption = {
  id: string;
  label: string;
  hint: string;
  multiplier: number;
  weeksMultiplier: number;
};

export const timelines: MultiplierOption[] = [
  { id: 'normal', label: 'Padrão', hint: 'Cronograma normal de fila', multiplier: 1, weeksMultiplier: 1 },
  { id: 'rapido', label: 'Acelerado', hint: 'Entra na frente da fila', multiplier: 1.22, weeksMultiplier: 0.75 },
  { id: 'urgente', label: 'Urgente', hint: 'Time dedicado e turno estendido', multiplier: 1.48, weeksMultiplier: 0.55 },
];

export const craftLevels: MultiplierOption[] = [
  { id: 'direto', label: 'Direto ao ponto', hint: 'Design limpo, sem firula', multiplier: 1, weeksMultiplier: 1 },
  { id: 'medida', label: 'Sob medida', hint: 'Identidade e ilustração próprias', multiplier: 1.18, weeksMultiplier: 1.15 },
  { id: 'cinema', label: 'Alto acabamento', hint: 'Motion e 3D como neste site', multiplier: 1.36, weeksMultiplier: 1.3 },
];

export const calculatorDisclaimer =
  'Esta é uma estimativa automática, não uma proposta. O valor final depende do escopo fechado no diagnóstico, que é gratuito e sem compromisso.';
