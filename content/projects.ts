/**
 * Portfólio + páginas de case study (/projetos/[slug]).
 *
 * Todos os cinco projetos abaixo são reais e estão no ar. Textos, números e
 * stack foram extraídos do código-fonte e do conteúdo publicado de cada um —
 * nada aqui é exemplo inventado.
 *
 * REGRA DE HONESTIDADE DESTE ARQUIVO
 * Nenhum resultado de negócio do cliente ("+X% de leads", "-Y% de faltas") é
 * afirmado, porque nenhum foi medido por nós. O campo `results` traz apenas
 * fatos verificáveis do que foi entregue (módulos, métricas do próprio motor,
 * propriedades técnicas). Se um dia houver número de negócio auditado, ele
 * entra aqui — com a fonte.
 *
 * IMAGENS (/public/images/projects, 1600×1000, WebP)
 * - var-center-log.webp .......... captura real do site no ar
 * - dra-michele-herreira.webp .... captura real da versão 2026, enviada pelo
 *                                  cliente (o domínio é inalcançável daqui).
 *                                  Veio 1649×817; escalada para 1600 de
 *                                  largura e estendida na base com o próprio
 *                                  fundo da página (#faf9f6) até 1600×1000.
 * - benjamin.webp ................ prévia de interface: o app é de acesso por
 * - clinica-iq.webp .............. convite / exige banco, então a tela foi
 * - marmitapro.webp .............. remontada com os tokens de design, a copy e
 *                                  os números reais de cada produto.
 *   TODO: substituir as três prévias por captura da tela real (rodar o app,
 *   exportar 1600×1000 e sobrescrever o arquivo — nada mais muda).
 *
 * GALERIA (campo `gallery`, mesma pasta e mesmas dimensões)
 * As três do VAR Center Log são captura real de outras seções do site. As do
 * Benjamin, ClinicaIQ e MarmitaPRO seguem a regra das prévias acima — telas
 * remontadas com os tokens, a copy e os números reais de cada produto. As
 * fotos das receitas do MarmitaPRO são as do próprio produto.
 * A Dra. Michele ainda não tem galeria: daqui só se alcança a captura que o
 * cliente enviou. TODO: pedir mais prints da versão 2026.
 *
 * TODO: substituir por dado real — depoimentos. Nenhum dos clientes tem
 * citação autorizada ainda; preferimos não publicar frase atribuída a pessoa
 * real sem autorização. Ao conseguir, preencha `testimonial`.
 */
export type ProjectCategory = 'Sites' | 'Aplicativos' | 'Sistemas' | 'Automação e IA';

export type Project = {
  slug: string;
  client: string;
  title: string;
  category: ProjectCategory;
  segment: string;
  year: number;
  /** Frase curta e factual: título e prévia de link da página do case. */
  headlineResult: string;
  summary: string;
  /** 'featured' ocupa duas colunas no grid assimétrico. */
  size: 'featured' | 'default' | 'tall';
  image?: string;
  /**
   * Telas extras mostradas na página do case, abaixo do herói. Cada uma com
   * legenda, porque imagem de interface sem contexto não conta nada.
   */
  gallery?: { src: string; alt: string; caption: string }[];
  /** Endereço público do projeto, quando existe. */
  liveUrl?: string;
  device: 'desktop' | 'mobile' | 'dashboard';
  challenge: string[];
  solution: string[];
  stack: string[];
  results: { value: string; label: string }[];
  testimonial?: { quote: string; author: string; role: string };
  duration: string;
};

export const projects: Project[] = [
  {
    slug: 'var-center-log',
    client: 'VAR Center Log',
    title: 'O maior condomínio logístico do Alto Tietê apresentado como imóvel de alto padrão',
    category: 'Sites',
    segment: 'Logística · Suzano, SP',
    year: 2026,
    headlineResult: '65.000 m² em uma página só',
    summary:
      'Site institucional e comercial de um condomínio logístico Triple AAA+ que abriga Mercado Livre, Shopee e Semar — com ficha técnica de cada galpão e a nova fase de expansão em pré-reserva.',
    size: 'featured',
    device: 'desktop',
    image: '/images/projects/var-center-log.webp',
    gallery: [
      {
        src: '/images/projects/var-historia.webp',
        alt: 'Seção de história do site do VAR Center Log, com foto aérea do complexo',
        caption:
          'A história entra como argumento comercial: de cerâmica desativada a polo logístico, com as 25 mil entregas diárias do Mercado Livre no selo sobre a foto aérea.',
      },
      {
        src: '/images/projects/var-infraestrutura.webp',
        alt: 'Grade com os dez itens de infraestrutura do condomínio',
        caption:
          'Dez itens de infraestrutura em grade de três colunas — docas, portaria blindada, balanças de 60 t, energia no mercado livre. O locatário confere a lista sem falar com ninguém.',
      },
      {
        src: '/images/projects/var-galpoes.webp',
        alt: 'Cards dos galpões disponíveis com ficha técnica e foto real',
        caption:
          'Ficha técnica por galpão com foto real: área útil, dimensões, pé-direito e docas, cada card com o próprio CTA para o WhatsApp da equipe comercial.',
      },
    ],
    liveUrl: 'https://www.varcenterlog.com',
    duration: 'Contínuo, por fase',
    challenge: [
      'O antigo complexo da Cerâmica Gyotoku virou condomínio logístico em 2024, mas não tinha nenhuma presença digital — a prospecção dependia de indicação e placa na rua.',
      'O público é misto: diretor de operações procurando metragem e pé-direito, e time imobiliário procurando localização e acesso rodoviário. As duas leituras precisavam caber na mesma página.',
      'Havia muita informação técnica para organizar — 15 galpões, dez itens de infraestrutura, dez segmentos atendidos e uma expansão de 30.000 m² em obras.',
      'Fotografia aérea captada por drone precisava sustentar a escala do empreendimento sem transformar a página num álbum pesado.',
    ],
    solution: [
      'Narrativa em cinco atos — escala, história, infraestrutura, galpões disponíveis e localização —, cada um respondendo a uma pergunta que o locatário faz antes de agendar visita.',
      'Cinco números logo no primeiro dobra (15 galpões, 65 mil m², 1.500+ empregos, 3,5 km do Rodoanel, +30 mil m² em obras) para qualificar o empreendimento antes de qualquer rolagem.',
      'Marquee com as empresas instaladas rodando em duas direções: prova social que funciona mesmo para quem só olha o topo da página.',
      'Ficha técnica por galpão — área útil, dimensões, pé-direito, docas e escritório incluso — com CTA direto para o WhatsApp da equipe comercial.',
      'HTML, CSS e JavaScript escritos à mão, sem framework: IntersectionObserver para os reveals, rolagem suave nativa e menu mobile com fechamento por overlay, ESC e botão.',
    ],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'IntersectionObserver', 'Vercel'],
    results: [
      { value: '15', label: 'galpões com ficha técnica própria' },
      { value: '65.000 m²', label: 'de empreendimento descritos em uma página' },
      { value: '0', label: 'frameworks — HTML, CSS e JS puros' },
      { value: '6', label: 'seções âncora com rolagem suave e menu mobile' },
    ],
  },
  {
    slug: 'benjamin',
    client: 'Benjamin',
    title: 'O ouro invisível de cada conversa: briefing comercial extraído de transcrição de reunião',
    category: 'Automação e IA',
    segment: 'Inteligência conversacional · Challenge FIAP × TOTVS',
    year: 2026,
    headlineResult: 'R$ 0,00 por análise, p95 de 2–4 ms',
    summary:
      'Motor que lê transcrição bruta de reunião de vendas e devolve oportunidades, risco de churn e o ecossistema do cliente — cada item preso à citação literal que o originou.',
    size: 'default',
    device: 'dashboard',
    image: '/images/projects/benjamin.webp',
    gallery: [
      {
        src: '/images/projects/benjamin-torre.webp',
        alt: 'Torre de controle do Benjamin com radar de dores e contas em risco',
        caption:
          'Torre de controle: o que aparece reunião a reunião vira visão agregada — radar de dores, contas em risco com valor, pipeline por unidade de negócio e coaching de talk ratio.',
      },
      {
        src: '/images/projects/benjamin-validacao.webp',
        alt: 'Tela de validação com a tabela de precisão, recall e F1 por campo',
        caption:
          'A tela de validação publica precisão, recall e F1 campo a campo — inclusive onde o motor erra. Medir a própria falibilidade é parte do produto, não um anexo.',
      },
    ],
    liveUrl: 'https://benjamin-rose.vercel.app',
    duration: '10 semanas',
    challenge: [
      'O desafio pedia processar 10.000 reuniões por dia em tempo real. Chamar um modelo de linguagem em cada uma cobraria por token e entregaria latência imprevisível — medimos 22,4 s, 4,5 s e 25,8 s para a mesma entrada.',
      'Vendedor não confia em painel que afirma sem mostrar de onde tirou. Um briefing que erra com aparência de certeza é pior que briefing nenhum.',
      'Transcrição real vem suja: erro de reconhecimento de fala, trecho inaudível, fala sobreposta. Limpar o texto antes de medir seria medir o cenário errado.',
      'Trocar quem é o vendedor e quem é o cliente faz o briefing inteiro mentir — talk ratio, voz do cliente e sentimento dependem dessa atribuição.',
    ],
    solution: [
      'Motor 100% determinístico em TypeScript puro, sem I/O: mesma entrada devolve sempre a mesma saída, cada campo auditável até a regra que o produziu.',
      'Regra de evidência como invariante testada: item sem citação rastreável não é retornado. Um teste verifica em todo o corpus que `texto.slice(start, end) === quote`.',
      'O LLM entra contido e opcional, por reunião, num botão do briefing — e só o que ancora numa citação literal aparece. O que não ancora é descartado e contado na tela.',
      'Corpus real gravado e anotado: 12 cenários encenados, dois anotadores independentes por amostra, partição dev/holdout com o holdout nunca inspecionado item a item.',
      'Anonimização que preserva o comprimento do texto (`###.###.###-##`, não `[CPF]`), porque é o que mantém os índices da citação válidos depois do tratamento.',
      'Torre de controle com radar de dores agregado, contas em risco, pipeline por unidade de negócio e coaching de talk ratio.',
    ],
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind v4', 'Zod', 'Vercel'],
    results: [
      { value: 'R$ 0,00', label: 'de API por análise no caminho padrão' },
      { value: '2–4 ms', label: 'latência p95 medida sobre o corpus' },
      { value: '100%', label: 'dos itens com citação literal rastreável' },
      { value: '70', label: 'testes automatizados, incluindo o invariante de evidência' },
    ],
  },
  {
    slug: 'clinica-iq',
    client: 'ClinicaIQ',
    title: 'Agenda, prontuário e financeiro de clínica em um sistema multi-inquilino',
    category: 'Sistemas',
    segment: 'SaaS B2B · clínicas odontológicas e estéticas',
    year: 2026,
    headlineResult: '11 módulos sobre uma base multi-inquilino',
    summary:
      'SaaS para clínicas com agenda por profissional, confirmação automática no WhatsApp, orçamento com link público e PDF, odontograma interativo e dashboard financeiro.',
    size: 'default',
    device: 'dashboard',
    image: '/images/projects/clinica-iq.webp',
    gallery: [
      {
        src: '/images/projects/clinica-iq-orcamento.webp',
        alt: 'Tela de orçamento do ClinicaIQ com odontograma e link público',
        caption:
          'Orçamento com odontograma dente a dente, link público com token e histórico de cada abertura — a clínica sabe se o paciente leu antes de cobrar resposta.',
      },
      {
        src: '/images/projects/clinica-iq-financeiro.webp',
        alt: 'Dashboard financeiro do ClinicaIQ com recebimentos por mês',
        caption:
          'Financeiro ligado ao atendimento: todo lançamento aponta para o procedimento que o gerou, então o número do mês sempre tem de onde vir.',
      },
    ],
    liveUrl: 'https://clinica-iq-web.vercel.app',
    duration: 'Em desenvolvimento',
    challenge: [
      'Clínica pequena vive de agenda cheia, mas a confirmação de consulta é feita à mão, por telefone, pela mesma pessoa que atende quem está na recepção.',
      'Orçamento impresso some. Sem link e sem registro de abertura, ninguém sabe se o paciente sequer leu a proposta.',
      'Vários profissionais dividindo salas e horários geram conflito de agenda que só aparece quando o paciente já está na porta.',
      'Prontuário guarda CPF, telefone e histórico clínico. LGPD não é item de backlog: é requisito de arquitetura.',
      'Acessibilidade tratada como diferencial de produto, não como ajuste no fim — recepção, dentista e auxiliar precisam conseguir operar o sistema.',
    ],
    solution: [
      'Multi-inquilino de verdade: toda tabela com `tenantId` e um cliente Prisma estendido que filtra por inquilino sozinho, para não depender de lembrar o filtro em cada consulta.',
      'Confirmação e lembrete no WhatsApp por provedor abstrato — mock no desenvolvimento, Meta Cloud API em produção — com fila BullMQ agendando o disparo de 24 horas antes.',
      'Orçamento vira PDF e link público com token: o paciente aprova pelo celular e a clínica vê a conversão em tempo real.',
      'CPF e telefone criptografados em repouso com AES-256-GCM, cifra e decifra centralizadas no pacote de banco, sem PII em log.',
      'WCAG 2.1 AA verificado por axe-core dentro do Playwright na integração contínua, com `eslint-plugin-jsx-a11y` barrando regressão no código.',
      'Monorepo Turborepo com quatro pacotes compartilhados (banco, WhatsApp, PDF e interface) para que app web e gateway de WhatsApp não dupliquem regra.',
    ],
    stack: ['Next.js 15', 'TypeScript', 'Turborepo', 'Prisma', 'PostgreSQL', 'Clerk', 'BullMQ', 'Redis'],
    results: [
      { value: '11', label: 'módulos, da agenda ao financeiro' },
      { value: 'AES-256-GCM', label: 'CPF e telefone criptografados em repouso' },
      { value: 'WCAG 2.1 AA', label: 'verificado por axe-core na integração contínua' },
      { value: '4', label: 'pacotes compartilhados no monorepo' },
    ],
  },
  {
    slug: 'marmitapro',
    client: 'MarmitaPRO',
    title: 'A aula de precificação abre ao lado da calculadora de precificação',
    category: 'Aplicativos',
    segment: 'Produto próprio · micronegócio de alimentação',
    year: 2026,
    headlineResult: 'Curso e ferramenta na mesma tela',
    summary:
      'App que ensina a montar um negócio de marmita fit e opera o negócio junto: trilha de 27 aulas, calculadora de macros com 67 ingredientes brasileiros e precificação com a conta aberta.',
    size: 'default',
    device: 'dashboard',
    image: '/images/projects/marmitapro.webp',
    gallery: [
      {
        src: '/images/projects/marmitapro-macros.webp',
        alt: 'Calculadora de macros do MarmitaPRO com a ficha nutricional do prato',
        caption:
          'Calculadora de macros sobre 67 ingredientes brasileiros, em porção caseira. A soma por ingrediente fecha com o total — e vira o rótulo que o cliente pede.',
      },
      {
        src: '/images/projects/marmitapro-receitas.webp',
        alt: 'Banco de receitas do MarmitaPRO com ficha completa de uma receita',
        caption:
          'Banco de receitas com filtro por objetivo. Cada ficha traz ingredientes, preparo, macros e o custo calculado na tabela de preço do próprio usuário.',
      },
    ],
    liveUrl: 'https://marmitapro-alpha.vercel.app',
    duration: 'Em evolução',
    challenge: [
      'Quem vende marmita fit copia o preço do vizinho. Se o custo dele é outro, o lucro vira prejuízo sem ninguém perceber.',
      'A hora de trabalho — comprar, cozinhar, montar, higienizar, entregar — fica fora da planilha e sai do bolso todo mês.',
      'O cliente pergunta os macros e o vendedor chuta. Quem tem ficha nutricional ganha a venda mesmo cozinhando pior.',
      'O curso comprado vira PDF parado: a aula ensina a teoria e some, quando o que falta é a ferramenta aberta na hora de montar o cardápio.',
      'O público tem de 25 a 45 anos e pouco ou nenhum conhecimento de nutrição, precificação e gestão. A interface não podia pressupor nenhum dos três.',
    ],
    solution: [
      'Conteúdo e ferramenta no mesmo lugar: a aula sobre precificação abre ao lado da calculadora, a aula sobre cardápio abre ao lado do banco de receitas.',
      'Calculadora de precificação com a conta aberta — ingredientes, embalagem, gás e energia, mão de obra — e cenários salvos para comparar margem.',
      'Calculadora de macros sobre 67 ingredientes brasileiros, com totais do preparo e valores por porção.',
      'Banco de receitas com ficha completa: ingredientes, modo de preparo, ficha nutricional e custo por porção, com busca e filtro por objetivo.',
      'Quiz de onboarding em quatro passos que define para onde o usuário vai depois do cadastro, em vez de largá-lo num painel vazio.',
      'PWA instalável com service worker e tela offline, porque quem cozinha usa o celular com a mão ocupada e a internet da cozinha.',
      'RLS ativa em todas as tabelas do Supabase e Zod validando toda Server Action, cliente e servidor, com o mesmo esquema.',
    ],
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4', 'Supabase', 'Clerk', 'Zod', 'PWA'],
    results: [
      { value: '27', label: 'aulas em 5 módulos, com progresso por aula' },
      { value: '67', label: 'ingredientes brasileiros na calculadora de macros' },
      { value: 'PWA', label: 'instalável, com service worker e tela offline' },
      { value: 'RLS', label: 'ativa em todas as tabelas do banco' },
    ],
  },
  {
    slug: 'dra-michele-herreira',
    client: 'Dra. Michele Herreira',
    title: 'Dois públicos opostos — adulto reabilitando a boca e criança de 3 anos — na mesma página',
    category: 'Sites',
    segment: 'Odontologia · São Paulo, SP',
    year: 2026,
    headlineResult: '“Um sorriso saudável em cada idade”',
    summary:
      'Site de consultório odontológico com o registro profissional em evidência, casos clínicos reais e agendamento direto pelo WhatsApp — dividido entre reabilitação adulta e odontopediatria.',
    size: 'default',
    device: 'desktop',
    image: '/images/projects/dra-michele-herreira.webp',
    liveUrl: 'https://www.dramicheleherreira.com',
    duration: '5 semanas',
    challenge: [
      'A dentista atende dois públicos que não se parecem em nada: o adulto decidindo implante e reabilitação oral, e o pai marcando a primeira consulta de uma criança de 3 anos. Um site só precisava falar com os dois sem diluir nenhum.',
      'Implante é decisão cara e demorada. O paciente pesquisa, compara e quer ver resultado e credencial antes de mandar a primeira mensagem.',
      'Odontologia tem regra de publicidade do CFO: nada de promessa de resultado, preço em destaque ou "antes e depois" sensacionalista. A página tinha que converter dentro desse limite.',
      'Odontopediatria vive de confiança pessoal — quem marca quer ver o rosto de quem vai atender a criança, não um banco de imagens.',
    ],
    solution: [
      'Uma frase que cobre os dois públicos no topo — "Um sorriso saudável em cada idade" — e, logo abaixo dela, a divisão explícita: implantes e reabilitação para adultos, odontopediatria e prevenção para crianças.',
      'CRO-SP 71275 impresso acima do título e repetido num selo sobre a foto: a credencial é o argumento de confiança que a regra publicitária permite, então ela vira elemento de design.',
      'Foto real da dentista no próprio consultório, com cartões flutuantes destacando registro, satisfação e faixa etária atendida — zero banco de imagens.',
      'Navegação desenhada como jornada de decisão: Resultados, Tratamentos, Crianças, A doutora, Depoimentos, Contato — na ordem em que a dúvida aparece.',
      'Dois CTAs com pesos diferentes: "Agendar avaliação" abre o WhatsApp; "Ver casos clínicos" segura quem ainda está pesquisando, em vez de perder a visita.',
      'Tipografia serifada com itálico dourado no trecho-chave do título — registro visual de consultório de alto padrão, longe do azul clínico genérico do setor.',
      'Página estática servida pela borda da Vercel: nada de consulta a banco para carregar o topo, que é onde o paciente decide se continua lendo.',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    results: [
      { value: '2', label: 'públicos atendidos na mesma página, sem diluir nenhum' },
      { value: 'CRO-SP', label: '71275 visível acima do título, como prova de credencial' },
      { value: '7', label: 'seções na ordem em que a dúvida do paciente aparece' },
      { value: 'WhatsApp', label: 'canal de agendamento, do topo ao rodapé' },
    ],
  },
];

export const projectCategories: ('Todos' | ProjectCategory)[] = [
  'Todos',
  'Sites',
  'Aplicativos',
  'Sistemas',
  'Automação e IA',
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
