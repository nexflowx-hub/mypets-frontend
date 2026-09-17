import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Termos de Uso | MyPets", alternates: { canonical: "/legal/termos" } };

export default function TermsPage() {
  return <LegalDocument eyebrow="Legal" title="Termos de Uso" intro="Estes termos regulam o acesso e a utilizacao do ecossistema digital MyPets. Compras na Loja MyPets e fluxos de apoio possuem condicoes adicionais especificas." sections={[
    { title: "1. Plataforma e operadores", paragraphs: ["MyPets e uma marca e experiencia digital. A entidade responsavel por uma operacao depende do mercado e do tipo de servico. A identificacao dos operadores e vendedores esta disponivel em /institucional/entidades e e apresentada no checkout quando aplicavel."] },
    { title: "2. Utilizacao da plataforma", paragraphs: ["O utilizador deve fornecer informacao verdadeira, utilizar a plataforma de forma licita e nao tentar interferir na seguranca, disponibilidade ou integridade dos sistemas."], bullets: ["Nao e permitido usar perfis, causas ou meios de pagamento de forma fraudulenta.", "Conteudo submetido pode ser moderado ou removido quando viole estes termos, direitos de terceiros ou a lei aplicavel."] },
    { title: "3. Causas, projetos e apoios", paragraphs: ["A criacao de um pagamento, QR Code ou checkout nao representa confirmacao financeira. Apenas estados confirmados pelo provedor de pagamento e persistidos pela plataforma sao tratados como pagamento concluido.", "Apoios a causas, fundos e protetores sao mantidos separados dos pedidos comerciais da Loja MyPets. A plataforma procura identificar o destino e a natureza de cada fluxo antes da confirmacao."] },
    { title: "4. Loja MyPets", paragraphs: ["Compras de produtos estao sujeitas aos Termos da Loja, politica de entrega e politica de devolucoes aplicaveis ao mercado do comprador. O vendedor juridico e identificado antes da conclusao do pedido."] },
    { title: "5. Responsabilidade e disponibilidade", paragraphs: ["A plataforma pode sofrer manutencoes, indisponibilidades de terceiros ou alteracoes tecnicas. Nada nestes termos limita direitos obrigatorios do consumidor ou outras garantias que nao possam ser excluidas por lei."] },
    { title: "6. Contacto", paragraphs: ["Para questoes institucionais, legais ou de suporte: contact@mypets.lat. No Brasil, o atendimento tambem pode ser feito pelo telefone e WhatsApp +55 (62) 99619-7224."] },
  ]} />;
}
