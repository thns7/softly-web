/** Perguntas frequentes — alimentam a seção de FAQ e o JSON-LD FAQPage. */
export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'Quanto tempo leva para o meu projeto ficar pronto?',
    answer:
      'Uma landing page fica pronta em 3 a 4 semanas. Um site institucional, em 4 a 6. Aplicativos e sistemas variam de 8 a 16 semanas, dependendo do escopo. O prazo é fechado na proposta e vira cronograma com marcos: você acompanha entrega parcial toda semana, em ambiente de testes.',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'Projetos fechados: 40% na assinatura, 30% na aprovação do design e 30% na entrega. Aceitamos Pix (com 5% de desconto), cartão em até 6× sem juros e boleto em 3×. Planos mensais são cobrados por assinatura, com o setup no primeiro mês. Emitimos nota fiscal em todas as modalidades.',
  },
  {
    question: 'O que acontece depois que o site entra no ar?',
    answer:
      'Você recebe treinamento gravado do painel, a documentação do projeto e 30 dias de ajustes inclusos. No plano Growth, seguimos otimizando todo mês. Nos demais, você pode contratar manutenção avulsa ou tocar sozinho. O projeto é seu e funciona sem nós.',
  },
  {
    question: 'Vocês fazem manutenção depois da entrega?',
    answer:
      'Fazemos. A manutenção cobre atualização de segurança, monitoramento de uptime, backup e uma janela mensal de pequenos ajustes. Começa em R$ 490/mês para sites e é dimensionada por SLA em sistemas. Não é obrigatória para você levar o projeto.',
  },
  {
    question: 'De quem é o código no final?',
    answer:
      'Seu. Na entrega, transferimos o repositório, as contas de hospedagem e todos os acessos para o seu nome. Não trabalhamos com plataforma proprietária que prende cliente: se um dia você quiser trocar de fornecedor, leva tudo e continua de onde parou.',
  },
  {
    question: 'Quem paga a hospedagem e os domínios?',
    answer:
      'A hospedagem fica em contas no seu nome, pagas por você, normalmente entre R$ 0 e R$ 120 por mês para sites, porque usamos infraestrutura com plano gratuito generoso. Nos planos com hospedagem inclusa, isso já está no valor mensal. Domínio custa cerca de R$ 40 por ano no registro.br.',
  },
  {
    question: 'E se o escopo mudar no meio do projeto?',
    answer:
      'Mudança pequena entra sem custo. Mudança que altera prazo ou esforço vira um aditivo curto, com valor e impacto no cronograma, aprovado por você antes de qualquer linha de código. Nunca há surpresa na fatura final: se não foi aprovado, não foi cobrado.',
  },
  {
    question: 'Como funciona o suporte no dia a dia?',
    answer:
      'Você fala direto com quem construiu o projeto, por WhatsApp e e-mail, sem abrir chamado em fila. O tempo de resposta é de 1 dia útil no Essencial e 4 horas úteis no Growth. Para sistemas críticos, definimos SLA em contrato, com plantão fora do horário comercial.',
  },
];
