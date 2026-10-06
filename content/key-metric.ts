/**
 * Seção "O número" (sections/key-metric.tsx).
 *
 * As métricas abaixo são ILUSTRATIVAS: o retrato genérico de um painel de
 * empresa, não números de cliente nem da Softly. Elas aparecem como ruído de
 * fundo, sem nome de empresa, e nenhuma é apresentada como resultado. Por isso
 * não entram na lista de dados fictícios a substituir antes do lançamento.
 *
 * A ordem importa: os 10 primeiros aparecem no celular, os 12 primeiros no
 * tablet e os 18 no desktop. O escolhido precisa estar entre os 10.
 */

export type Metric = { label: string; value: string };

export const keyMetric = {
  metrics: [
    { label: 'Custo por lead', value: 'R$ 38' },
    { label: 'Faltas na agenda', value: '27%' },
    { label: 'Tempo de carregamento', value: '4,2 s' },
    { label: 'Leads por mês', value: '140' },
    { label: 'Abandono de carrinho', value: '71%' },
    { label: 'Taxa de conversão', value: '1,8%' },
    { label: 'Ticket médio', value: 'R$ 312' },
    { label: 'Tempo de resposta', value: '6 h' },
    { label: 'Horas em planilha', value: '22 h' },
    { label: 'Acessos pelo celular', value: '78%' },
    { label: 'Rejeição na home', value: '64%' },
    { label: 'Orçamentos sem retorno', value: '41%' },
    { label: 'Pedidos digitados', value: '63/dia' },
    { label: 'Clientes que voltam', value: '12%' },
    { label: 'Cliques no WhatsApp', value: '9%' },
    { label: 'Cancelamento mensal', value: '4,6%' },
    { label: 'Tempo de cadastro', value: '3 min' },
    { label: 'Avaliações respondidas', value: '18%' },
  ] as readonly Metric[],

  /** Posição, em `metrics`, do número que a sequência encontra. */
  chosen: 5,

  /** Legenda que volta sob o número quando ele chega ao centro. */
  caption: 'Taxa de conversão',

  statement: {
    lead: 'Antes da primeira linha de código, a gente descobre',
    accent: 'qual número precisa mudar.',
  },
} as const;
