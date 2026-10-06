import { DeliveryPanel } from '@/components/delivery-panel';

/**
 * Faixa "Padrão de entrega".
 *
 * O painel morava dentro do hero, em cinco das doze colunas. Saiu de lá para
 * a frase de abertura poder ocupar a grade inteira — e ganhou com a mudança:
 * aqui ele tem largura para pôr as três leituras lado a lado, em vez de
 * empilhadas numa coluna estreita.
 *
 * Também mudou de papel na página. No hero ele competia com o argumento;
 * logo depois da seção "O número" (sections/key-metric.tsx), ele responde a
 * ela: a frase diz que a gente descobre qual número precisa mudar, e a faixa
 * mostra os números que a Softly se compromete a entregar. Afirmação e
 * recibo, nessa ordem.
 */
export function DeliveryBand() {
  return (
    <section aria-labelledby="padrao-titulo" className="relative py-16 lg:py-20">
      <h2 id="padrao-titulo" className="sr-only">
        Padrão de entrega da Softly
      </h2>
      <div className="shell">
        <DeliveryPanel layout="row" />
      </div>
    </section>
  );
}
