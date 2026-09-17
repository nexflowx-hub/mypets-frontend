import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Cookies | MyPets", alternates: { canonical: "/legal/cookies" } };

export default function CookiesPage() {
  return <LegalDocument eyebrow="Privacidade" title="Politica de Cookies" intro="Esta politica descreve, de forma resumida, como tecnologias de armazenamento local e medicao podem ser usadas no MyPets." sections={[
    { title: "1. Cookies essenciais", paragraphs: ["Podemos utilizar cookies ou armazenamento local necessarios para sessao, seguranca, preferencia de idioma/mercado, carrinho e funcionamento basico da plataforma. Esses mecanismos sao usados apenas quando tecnicamente necessarios para a experiencia solicitada."] },
    { title: "2. Analitica e desempenho", paragraphs: ["Ferramentas de analitica podem ser utilizadas para compreender utilizacao, erros e desempenho. Quando a legislacao do mercado exigir consentimento previo para tecnologias nao essenciais, a ativacao deve respeitar essa escolha."] },
    { title: "3. Marketing", paragraphs: ["Tecnologias de publicidade ou remarketing, se adotadas, devem ser documentadas no gestor de consentimento e condicionadas ao consentimento quando exigido por lei. O MyPets nao deve ativar parceiros publicitarios silenciosamente sem refletir isso nesta politica."] },
    { title: "4. Gestao", paragraphs: ["O utilizador pode controlar cookies pelo navegador e, quando disponivel, pelo painel de preferencias do site. O bloqueio de tecnologias essenciais pode impedir funcionalidades como autenticacao ou carrinho."] },
    { title: "5. Contacto", paragraphs: ["Duvidas sobre cookies e privacidade podem ser enviadas para contact@mypets.lat."] },
  ]} />;
}
