import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Termos da Loja | MyPets", alternates: { canonical: "/legal/loja" } };

export default function StoreTermsPage() {
  return <LegalDocument eyebrow="Loja MyPets" title="Termos da Loja" intro="Estas condicoes regulam compras comerciais na Loja MyPets. O vendedor juridico, moeda, preco total, entrega e condicoes aplicaveis devem ser apresentados antes da confirmacao do pedido." sections={[
    { title: "1. Vendedor por mercado", paragraphs: ["No Brasil, as vendas locais sao operadas sob a designacao MyPets Brasil pelo fornecedor juridico identificado em /institucional/entidades. No Reino Unido e na experiencia europeia/internacional, o vendedor ou operador comercial indicado no checkout e HUMAN IMPACT TECH LTD, sob a designacao MyPets Europe quando aplicavel.", "MyPets Europe e uma designacao comercial e nao representa uma sociedade constituida na Uniao Europeia."] },
    { title: "2. Oferta e formacao do pedido", paragraphs: ["A exibicao de um produto nao garante estoque ate a confirmacao do pedido. Antes do pagamento, o checkout deve apresentar produto, quantidade, preco, moeda, frete, vendedor, endereco de entrega e valor total.", "Um pedido somente e considerado pago quando o estado financeiro for confirmado pelo provedor de pagamento e persistido pela plataforma."] },
    { title: "3. Precos, impostos e cobranca", paragraphs: ["Os precos sao apresentados na moeda do mercado selecionado. Tributos, frete e encargos aplicaveis devem ser informados antes da conclusao. O nome exibido no extrato pode corresponder ao vendedor juridico, a marca MyPets ou ao provedor de pagamento, conforme a configuracao autorizada."] },
    { title: "4. Estoque e substituicoes", paragraphs: ["Produtos indisponiveis nao devem ser substituidos por itens diferentes sem consentimento do cliente. Em caso de indisponibilidade apos a compra, o cliente sera informado e podera receber reembolso ou alternativa expressamente aceita."] },
    { title: "5. Entrega, cancelamentos e devolucoes", paragraphs: ["Prazos e regras de entrega dependem do destino e sao apresentados no checkout. Direitos obrigatorios de arrependimento, cancelamento, garantia e devolucao prevalecem sobre qualquer disposicao contratual menos favoravel.", "No Brasil, compras fora do estabelecimento estao sujeitas ao direito de arrependimento previsto na legislacao consumerista. Para consumidores do Reino Unido ou da Uniao Europeia, aplicam-se os direitos obrigatorios do mercado e do tipo de venda quando pertinentes."] },
    { title: "6. Separacao entre compra e apoio", paragraphs: ["O valor de uma compra e receita comercial. Uma eventual campanha de impacto vinculada a produtos deve declarar previamente a regra de contribuicao. Apoios a causas, fundos e protetores usam fluxos financeiros separados dos pedidos comerciais."] },
    { title: "7. Suporte", paragraphs: ["Atendimento: contact@mypets.lat. Brasil: +55 (62) 99619-7224 por telefone ou WhatsApp."] },
  ]} />;
}
