import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Entregas e Devolucoes | MyPets", alternates: { canonical: "/legal/entregas-devolucoes" } };

export default function ReturnsPage() {
  return <LegalDocument eyebrow="Loja MyPets" title="Entregas, cancelamentos e devolucoes" intro="As regras abaixo sao uma base operacional comum. O prazo, transportador, custo e vendedor aplicaveis a cada pedido devem ser exibidos no checkout e na confirmacao da compra." sections={[
    { title: "1. Entrega", paragraphs: ["A Loja MyPets deve informar o prazo estimado, custo de frete e restricoes de entrega antes da confirmacao do pedido. Prazos podem variar por CEP, pais, estoque e transportador.", "O cliente deve informar um endereco completo e acompanhar comunicacoes sobre tentativas de entrega ou necessidade de correcao de dados."] },
    { title: "2. Cancelamento antes do envio", paragraphs: ["Quando o pedido ainda nao tiver sido expedido, o cancelamento pode ser solicitado ao suporte. A possibilidade de interceptar o pedido depende do estado logistico e nao reduz direitos obrigatorios previstos em lei."] },
    { title: "3. Direito de arrependimento", paragraphs: ["No Brasil, compras realizadas fora do estabelecimento comercial possuem o direito de arrependimento previsto na legislacao aplicavel, contado do recebimento do produto ou da assinatura do contrato, conforme o caso.", "Em mercados internacionais, os prazos e requisitos legais obrigatorios do pais do consumidor e da operacao prevalecem quando aplicaveis."] },
    { title: "4. Produto com defeito, avaria ou divergencia", paragraphs: ["O cliente deve contactar o suporte assim que identificar defeito, avaria de transporte, item incorreto ou falta de componente. Podemos solicitar fotografias ou informacoes objetivas para organizar troca, reposicao, reparo ou reembolso, sem afastar garantias legais."] },
    { title: "5. Reembolsos", paragraphs: ["Reembolsos comerciais devem referenciar o pagamento original e ser processados pelo mesmo meio sempre que tecnicamente possivel. O prazo de visualizacao do credito pode depender do banco, adquirente ou provedor de pagamento."] },
    { title: "6. Contacto", paragraphs: ["Solicitacoes: contact@mypets.lat. Brasil: +55 (62) 99619-7224 por telefone ou WhatsApp. Inclua o numero do pedido e uma descricao objetiva do pedido de suporte."] },
  ]} />;
}
