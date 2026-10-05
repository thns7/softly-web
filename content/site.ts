/**
 * Dados institucionais da Softly.
 * Este arquivo é a fonte única de verdade para contato, SEO e navegação.
 * Tudo marcado com `TODO: substituir por dado real` é um valor plausível de
 * exemplo — trocar antes de publicar.
 */

export const site = {
  name: 'Softly',
  legalName: 'Softly Tecnologia Ltda.', // TODO: substituir por dado real
  tagline: 'Engenharia de produto digital para empresas que precisam crescer.',
  description:
    'A Softly projeta e constrói sites, aplicativos, sistemas sob medida, automações e integrações com IA para empresas que querem crescer sem montar um time técnico interno.',
  // TODO: substituir por dado real (domínio de produção)
  url: 'https://softly.com.br',
  locale: 'pt-BR',
  foundedYear: 2025,

  contact: {
    // Apenas dígitos, com DDI e DDD — é o que o wa.me e o JSON-LD esperam.
    whatsappNumber: '5511991926994',
    whatsappLabel: '(11) 99192-6994',
    email: 'contato@softly.com.br', // TODO: substituir por dado real
    city: 'São Paulo',
    state: 'SP',
    // TODO: endereço real em São Paulo. Ficou vazio de propósito: o valor
    // anterior era uma rua de Florianópolis e ia para o JSON-LD do Google
    // junto com "São Paulo/SP" — endereço incoerente é pior que nenhum.
    address: '',
    postalCode: '', // TODO: CEP real (o anterior, 88032-005, era de Florianópolis)
    hours: 'Seg a sex, 9h às 18h',
    responseTime: 'Respondemos em até 1 dia útil.',
  },

  social: {
    instagram: 'https://instagram.com/softly.tech', // TODO: substituir por dado real
    linkedin: 'https://linkedin.com/company/softly-tech', // TODO: substituir por dado real
    github: 'https://github.com/softly-tech', // TODO: substituir por dado real
  },

  /** Mensagem pré-preenchida ao abrir o WhatsApp a partir do site. */
  whatsappMessage:
    'Olá! Vim pelo site da Softly e quero conversar sobre um projeto.',
} as const;

export const whatsappUrl = (message: string = site.whatsappMessage): string =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: 'Serviços', href: '/#servicos' },
  { label: 'Portfólio', href: '/#portfolio' },
  { label: 'Preços', href: '/#precos' },
  { label: 'Processo', href: '/#processo' },
  { label: 'Insights', href: '/insights' },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Navegação',
    items: [
      { label: 'Serviços', href: '/#servicos' },
      { label: 'Portfólio', href: '/#portfolio' },
      { label: 'Preços', href: '/#precos' },
      { label: 'Processo', href: '/#processo' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contato', href: '/#contato' },
    ],
  },
  {
    title: 'Serviços',
    items: [
      { label: 'Sites e landing pages', href: '/#servicos' },
      { label: 'Aplicativos web e mobile', href: '/#servicos' },
      { label: 'Sistemas sob medida', href: '/#servicos' },
      { label: 'Automação e integrações', href: '/#servicos' },
      { label: 'IA aplicada ao negócio', href: '/#servicos' },
      { label: 'Performance e SEO', href: '/#servicos' },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { label: 'Termos de Uso', href: '/termos-de-uso' },
];
