/** Bloco "Sobre a Softly". TODO: substituir por dado real — história e time. */
export const about = {
  eyebrow: 'Sobre a Softly',
  title: 'Somos engenharia de produto, não fábrica de site.',
  paragraphs: [
    'A Softly nasceu em 2025 com uma pergunta incômoda: por que empresa boa aceita software ruim? A resposta quase sempre era a mesma: porque contratou pelo preço da hora, não pelo resultado da entrega.',
    'Somos dois engenheiros de software em São Paulo, e é isso mesmo: não terceirizamos desenvolvimento e não colocamos estagiário para tocar projeto de cliente. Quem vende é quem constrói.',
  ],
  /* Dois valores, não quatro. "Entrega semanal" e "fala direta" já estavam
     ditos na seção de processo e no painel de entrega — repetir aqui só
     somava 60 palavras. Ficaram os dois que ninguém mais diz na página. */
  values: [
    {
      title: 'Escopo fechado, preço fechado',
      description: 'Você sabe o que vai receber e quanto custa antes de assinar. Mudança vira aditivo aprovado, nunca surpresa na fatura.',
    },
    {
      title: 'O código é seu',
      description: 'Repositório, hospedagem e acessos ficam no seu nome. Nenhuma plataforma proprietária prendendo você a nós.',
    },
  ],
  /* O time é este — dois fundadores, os dois engenheiros de software.
     Nada de nome de enfeite para o quadro parecer maior. */
  team: [
    { name: 'Thiago Nascimento', role: 'Fundador · Engenheiro de software', initials: 'TN' },
    { name: 'Vinícius Herreira', role: 'Fundador · Engenheiro de software', initials: 'VH' },
  ],
} as const;
