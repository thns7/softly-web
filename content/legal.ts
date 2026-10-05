import { site } from './site';

/**
 * Textos legais (LGPD).
 * Redigidos para o modelo de operação descrito no site.
 * TODO: substituir por dado real — revisar com o jurídico antes de publicar e
 * conferir razão social, endereço e e-mail do encarregado (DPO).
 */
export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export type LegalSection = { id: string; title: string; blocks: LegalBlock[] };

export const privacyUpdatedAt = '2026-01-15'; // TODO: substituir por dado real

export const privacyPolicy: LegalSection[] = [
  {
    id: 'quem-somos',
    title: '1. Quem trata seus dados',
    blocks: [
      {
        type: 'paragraph',
        text: 'A Softly Tecnologia Ltda., com sede em São Paulo/SP, é a controladora dos dados pessoais coletados neste site, nos termos da Lei nº 13.709/2018 (LGPD).',
      },
      {
        type: 'paragraph',
        text: `Nosso encarregado de proteção de dados pode ser contatado pelo e-mail ${site.contact.email}. Respondemos solicitações em até 15 dias.`,
      },
    ],
  },
  {
    id: 'dados',
    title: '2. Quais dados coletamos',
    blocks: [
      { type: 'paragraph', text: 'Coletamos apenas o necessário para responder e prestar o serviço:' },
      {
        type: 'table',
        head: ['Dado', 'Origem', 'Finalidade'],
        rows: [
          ['Nome, e-mail e telefone', 'Formulários do site', 'Responder ao contato e enviar proposta'],
          ['Empresa e tipo de projeto', 'Formulários e calculadora', 'Dimensionar o orçamento'],
          ['Respostas da calculadora', 'Uso da calculadora', 'Montar estimativa e proposta detalhada'],
          ['Endereço IP e dados de navegação', 'Cookies e analytics', 'Medir audiência e melhorar o site'],
          ['Dados contratuais e fiscais', 'Contratação', 'Emissão de nota fiscal e obrigação legal'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Não coletamos dados sensíveis (origem racial, opinião política, dado de saúde, biometria) e não solicitamos dados de crianças ou adolescentes.',
      },
    ],
  },
  {
    id: 'bases-legais',
    title: '3. Com que base legal tratamos',
    blocks: [
      {
        type: 'list',
        items: [
          'Consentimento: cookies de análise e marketing, e envio de newsletter. Você pode retirar a qualquer momento.',
          'Execução de contrato: dados necessários para elaborar proposta e prestar o serviço contratado.',
          'Obrigação legal: guarda de registros de acesso por 6 meses (Marco Civil da Internet) e documentos fiscais por 5 anos.',
          'Legítimo interesse: segurança do site, prevenção a fraude e melhoria dos nossos serviços, sempre com avaliação de impacto.',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '4. Cookies',
    blocks: [
      {
        type: 'paragraph',
        text: 'Usamos três categorias de cookies. Os necessários mantêm o site funcionando (preferência de tema, segurança do formulário) e não podem ser desativados. Os de análise medem audiência de forma agregada. Os de marketing permitem medir campanhas.',
      },
      {
        type: 'paragraph',
        text: 'Cookies de análise e marketing só são ativados após o seu aceite no banner. Você pode revisar a escolha a qualquer momento pelo link "Preferências de cookies" no rodapé.',
      },
    ],
  },
  {
    id: 'compartilhamento',
    title: '5. Com quem compartilhamos',
    blocks: [
      {
        type: 'paragraph',
        text: 'Compartilhamos dados apenas com operadores necessários à prestação do serviço, todos sob contrato e obrigação de confidencialidade:',
      },
      {
        type: 'list',
        items: [
          'Vercel Inc.: hospedagem do site (Estados Unidos).',
          'Google LLC: Google Analytics 4, em modo de IP anonimizado (Estados Unidos).',
          'Meta Platforms Inc.: mensuração de campanhas, quando autorizada (Estados Unidos).',
          'Provedor de e-mail transacional: envio das mensagens do formulário.',
          'Meta / WhatsApp: quando você opta por continuar a conversa por WhatsApp.',
        ],
      },
      {
        type: 'paragraph',
        text: 'As transferências internacionais ocorrem com base em cláusulas contratuais padrão e garantias equivalentes às da LGPD. Não vendemos dados pessoais em nenhuma hipótese.',
      },
    ],
  },
  {
    id: 'retencao',
    title: '6. Por quanto tempo guardamos',
    blocks: [
      {
        type: 'list',
        items: [
          'Contatos que não viraram contrato: 24 meses após o último contato.',
          'Clientes: durante o contrato e por 5 anos após o encerramento, por exigência fiscal.',
          'Registros de acesso: 6 meses, conforme o Marco Civil da Internet.',
          'Newsletter: até o descadastramento, feito em um clique no rodapé de cada e-mail.',
        ],
      },
    ],
  },
  {
    id: 'direitos',
    title: '7. Seus direitos',
    blocks: [
      {
        type: 'paragraph',
        text: 'A LGPD garante que você possa, a qualquer momento e sem custo:',
      },
      {
        type: 'list',
        items: [
          'Confirmar se tratamos dados seus e acessar esses dados.',
          'Corrigir dados incompletos, inexatos ou desatualizados.',
          'Solicitar anonimização, bloqueio ou eliminação de dados desnecessários.',
          'Solicitar a portabilidade dos dados a outro fornecedor.',
          'Revogar o consentimento e se opor a tratamento feito por legítimo interesse.',
          'Peticionar perante a Autoridade Nacional de Proteção de Dados (ANPD).',
        ],
      },
      {
        type: 'paragraph',
        text: `Para exercer qualquer um deles, escreva para ${site.contact.email}. Podemos pedir uma confirmação de identidade antes de atender ao pedido.`,
      },
    ],
  },
  {
    id: 'seguranca',
    title: '8. Segurança',
    blocks: [
      {
        type: 'paragraph',
        text: 'Aplicamos criptografia em trânsito (TLS 1.3), controle de acesso por função, autenticação em duas etapas nas contas administrativas e backup diário. Em caso de incidente com risco relevante, comunicamos você e a ANPD nos prazos legais.',
      },
    ],
  },
  {
    id: 'alteracoes',
    title: '9. Alterações desta política',
    blocks: [
      {
        type: 'paragraph',
        text: 'Podemos atualizar esta política para refletir mudanças no serviço ou na legislação. A data de atualização fica sempre no topo da página. Mudanças relevantes são avisadas por e-mail a clientes ativos e assinantes.',
      },
    ],
  },
];

export const termsUpdatedAt = '2026-01-15'; // TODO: substituir por dado real

export const termsOfUse: LegalSection[] = [
  {
    id: 'aceite',
    title: '1. Aceite',
    blocks: [
      {
        type: 'paragraph',
        text: 'Ao navegar em softly.com.br você concorda com estes Termos de Uso. Se não concordar, pedimos que não utilize o site. Este documento não substitui o contrato de prestação de serviços, que rege cada projeto individualmente.',
      },
    ],
  },
  {
    id: 'servicos',
    title: '2. O que oferecemos aqui',
    blocks: [
      {
        type: 'paragraph',
        text: 'Este site apresenta os serviços da Softly, casos de clientes, conteúdo educativo e canais de contato. Nenhuma informação publicada aqui constitui proposta comercial vinculante.',
      },
    ],
  },
  {
    id: 'estimativas',
    title: '3. Calculadora e faixas de preço',
    blocks: [
      {
        type: 'paragraph',
        text: 'Os valores exibidos na calculadora de orçamento e na seção de preços são estimativas geradas a partir de médias de projetos anteriores. Eles não vinculam a Softly nem o visitante. O valor final de qualquer projeto é definido em proposta formal, após o diagnóstico, e só passa a valer com contrato assinado.',
      },
    ],
  },
  {
    id: 'propriedade',
    title: '4. Propriedade intelectual',
    blocks: [
      {
        type: 'paragraph',
        text: 'A marca Softly, o design deste site, os textos e as ilustrações são de propriedade da Softly Tecnologia Ltda. Você pode compartilhar links e citar trechos com atribuição, mas não pode reproduzir o site, no todo ou em parte, para fins comerciais sem autorização escrita.',
      },
      {
        type: 'paragraph',
        text: 'Marcas de clientes citadas nos casos aparecem com autorização e permanecem propriedade de seus respectivos titulares. Sobre projetos contratados: o código-fonte desenvolvido é transferido ao cliente na entrega, conforme contrato.',
      },
    ],
  },
  {
    id: 'conduta',
    title: '5. Uso aceitável',
    blocks: [
      { type: 'paragraph', text: 'Ao usar o site, você concorda em não:' },
      {
        type: 'list',
        items: [
          'Enviar dados falsos, de terceiros sem autorização ou conteúdo ilícito nos formulários.',
          'Tentar acessar áreas restritas, explorar vulnerabilidades ou aplicar engenharia reversa.',
          'Automatizar requisições em volume capaz de degradar o serviço.',
          'Utilizar o conteúdo para treinar modelos comerciais sem autorização expressa.',
        ],
      },
    ],
  },
  {
    id: 'links',
    title: '6. Links externos',
    blocks: [
      {
        type: 'paragraph',
        text: 'O site contém links para serviços de terceiros (WhatsApp, Instagram, sites de clientes). Não controlamos esses ambientes e não respondemos por seu conteúdo ou por suas políticas de privacidade.',
      },
    ],
  },
  {
    id: 'responsabilidade',
    title: '7. Limitação de responsabilidade',
    blocks: [
      {
        type: 'paragraph',
        text: 'Mantemos o site disponível com o melhor esforço, mas ele pode passar por interrupções para manutenção. A Softly não responde por decisões de negócio tomadas exclusivamente com base em conteúdo informativo publicado aqui, incluindo artigos e estimativas.',
      },
    ],
  },
  {
    id: 'foro',
    title: '8. Lei aplicável e foro',
    blocks: [
      {
        type: 'paragraph',
        text: 'Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Florianópolis/SC para dirimir controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.',
      },
      {
        type: 'paragraph',
        text: `Dúvidas sobre este documento: ${site.contact.email}.`,
      },
    ],
  },
];
