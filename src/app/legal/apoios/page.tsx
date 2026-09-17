import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Termos de Apoio | MyPets", alternates: { canonical: "/legal/apoios" } };

export default function SupportTermsPage() {
  return <LegalDocument eyebrow="Apoio e impacto" title="Termos de Apoio e Contribuicoes" intro="Estes termos explicam como o MyPets diferencia apoios financeiros de compras comerciais e como o destino de cada fluxo deve ser apresentado." sections={[
    { title: "1. Natureza do apoio", paragraphs: ["Os fluxos de apoio podem ser destinados ao proprio ecossistema MyPets, a fundos tematicos, a projetos, protetores ou causas especificas. A pagina do fluxo deve identificar o destino antes da confirmacao do pagamento.", "O uso da palavra apoio ou contribuicao nao significa, por si so, que o pagamento seja uma doacao beneficente, dedutivel de impostos ou destinado a uma charity/entidade beneficente registrada."] },
    { title: "2. Confirmacao financeira", paragraphs: ["Gerar QR Code, PaymentIntent, checkout ou referencia de pagamento nao equivale a pagamento concluido. Apenas a confirmacao do provedor financeiro e a reconciliacao persistida na plataforma determinam o estado final."] },
    { title: "3. Separacao da Loja", paragraphs: ["Compras na Loja MyPets sao pedidos comerciais e nao sao registradas como apoio. Se uma colecao comercial destinar parte da receita a impacto, a regra, percentual ou valor deve ser declarado de forma clara antes da compra e contabilizado separadamente."] },
    { title: "4. Reembolsos e correcoes", paragraphs: ["Pedidos de correcao, duplicidade, erro de valor ou reembolso serao analisados conforme o destino do apoio, estado do pagamento, repasse eventualmente realizado e legislacao aplicavel. A possibilidade de reembolso nao deve ser presumida depois que os fundos tiverem sido transferidos ao beneficiario, salvo direito obrigatorio ou erro comprovado."] },
    { title: "5. Transparencia", paragraphs: ["O MyPets procura manter identificacao do destino, historico financeiro e informacao suficiente para distinguir fundos proprios, causas de terceiros e compras. Informacoes de impacto ou repasses devem refletir dados verificaveis e nao apenas intencoes futuras."] },
    { title: "6. Contacto", paragraphs: ["Questoes sobre apoios: contact@mypets.lat. No Brasil, +55 (62) 99619-7224 por telefone ou WhatsApp."] },
  ]} />;
}
