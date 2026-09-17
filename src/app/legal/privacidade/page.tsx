import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Privacidade | MyPets", alternates: { canonical: "/legal/privacidade" } };

export default function PrivacyPage() {
  return <LegalDocument eyebrow="Privacidade" title="Politica de Privacidade" intro="Explicamos aqui como o MyPets trata dados pessoais em contas, formularios, causas, loja, suporte e pagamentos, respeitando a legislacao aplicavel em cada mercado." sections={[
    { title: "1. Quem trata os dados", paragraphs: ["O controlador ou operador juridico pode variar conforme o mercado e o servico utilizado. No Brasil, a operacao local e identificada como MyPets Brasil; na operacao internacional, HUMAN IMPACT TECH LTD atua no ecossistema MyPets. Os dados completos estao em /institucional/entidades."] },
    { title: "2. Dados que podemos tratar", paragraphs: ["Podemos tratar dados de identificacao e contacto, dados de conta, preferencia de idioma e mercado, dados necessarios para pedidos e entregas, informacoes submetidas em causas ou perfis e metadados tecnicos de seguranca."], bullets: ["Dados de pagamento sensiveis podem ser processados diretamente por provedores de pagamento e adquirentes.", "Quando um CPF ou outro documento e solicitado para um fluxo financeiro, ele deve ser usado apenas para a finalidade informada e com os controles tecnicos aplicaveis."] },
    { title: "3. Finalidades", paragraphs: ["Usamos dados para prestar o servico, processar pedidos, dar suporte, prevenir fraude, cumprir obrigacoes legais, melhorar a experiencia, medir desempenho e enviar comunicacoes quando houver base legal ou consentimento aplicavel."] },
    { title: "4. Compartilhamento", paragraphs: ["Podemos compartilhar dados estritamente necessarios com provedores de infraestrutura, pagamentos, logistica, comunicacao, analitica e outros prestadores vinculados a operacao. Nao vendemos dados pessoais como produto."] },
    { title: "5. Retencao e seguranca", paragraphs: ["Mantemos dados pelo periodo necessario para as finalidades informadas, obrigacoes legais, prevencao de fraude e defesa de direitos. Aplicamos medidas tecnicas e organizacionais proporcionais ao risco, sem prometer seguranca absoluta."] },
    { title: "6. Direitos e contacto", paragraphs: ["Pedidos relacionados a acesso, correcao, eliminacao, oposicao, portabilidade ou outros direitos previstos na legislacao aplicavel podem ser enviados para contact@mypets.lat. A resposta pode exigir verificacao de identidade e observancia de prazos legais."] },
  ]} />;
}
