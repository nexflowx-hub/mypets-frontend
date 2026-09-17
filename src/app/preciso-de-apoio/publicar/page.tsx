import type { Metadata } from "next";
import { CommunityCauseIntake } from "@/components/causes/community-cause-intake";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { CommunityCauseType } from "@/lib/cause-intake";
import { apiGet } from "@/lib/api";
import { BadgeCheck, Clock3, Globe2, HeartHandshake, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Publicar uma causa | MyPets",
  description: "Apresente uma causa animal e crie uma presença pública no MyPets sem documentos ou dados bancários na primeira etapa.",
  alternates: { canonical: "/preciso-de-apoio/publicar" },
};

const allowedTypes = new Set<CommunityCauseType>(["VET_HELP", "RESCUE", "SHELTER", "FEEDING", "ADOPTION", "EMERGENCY", "NGO_PROJECT", "OTHER"]);
type ConfigEnvelope = { data: { causeIntakeEnabled?: boolean } };

async function intakeIsLive() {
  try {
    const config = await apiGet<ConfigEnvelope>("/config");
    return config.data.causeIntakeEnabled === true;
  } catch {
    return false;
  }
}

export default async function PublishCausePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [query, enabled] = await Promise.all([searchParams, intakeIsLive()]);
  const rawType = Array.isArray(query.type) ? query.type[0] : query.type;
  const initialType = rawType && allowedTypes.has(rawType as CommunityCauseType) ? rawType as CommunityCauseType : "OTHER";

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Abrir uma causa</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Dê visibilidade à causa agora. A verificação financeira vem depois.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">A primeira etapa foi desenhada para ser simples: conte a história, indique a região, redes sociais e um contacto. A causa pode ganhar uma página pública no MyPets sem enviar documentos ou dados bancários.</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Globe2 className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black">Presença pública</p><p className="mt-1 text-xs leading-5 text-white/60">URL própria, indexável e partilhável.</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><Megaphone className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black">Fila de promoção</p><p className="mt-1 text-xs leading-5 text-white/60">Entrada editorial para canais e parceiros MyPets.</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><HeartHandshake className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black">Sem captação imediata</p><p className="mt-1 text-xs leading-5 text-white/60">Nenhum pagamento é ativado nesta fase.</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><BadgeCheck className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black">Verificação opcional</p><p className="mt-1 text-xs leading-5 text-white/60">Identidade, documentos e captação numa segunda etapa.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-7 rounded-3xl border border-border bg-white p-5 text-sm leading-7 text-muted-foreground sm:p-6"><strong className="text-petrol">Como funciona:</strong> a publicação inicial aparece como <strong>“Enviada pela comunidade · ainda não verificada pelo MyPets”</strong>. Se quiser receber apoios financeiros através da plataforma, poderá solicitar o selo MyPets Verificado e avançar para validação do responsável e habilitação financeira.</div>
          {enabled ? (
            <CommunityCauseIntake initialType={initialType} />
          ) : (
            <div className="rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700"><Clock3 className="h-7 w-7" /></span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-amber-700">Ativação em curso</p>
              <h2 className="mt-2 text-3xl font-black text-petrol">O novo canal de publicação está a ser ativado.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">A página já está disponível, mas o envio de novas causas só será liberado quando a API e a base de dados concluírem o rollout. Isto evita perder submissões durante uma atualização técnica.</p>
              <a href="https://wa.me/5562996197224?text=Ol%C3%A1%20MyPets%2C%20preciso%20de%20apoio%20e%20quero%20apresentar%20uma%20causa." target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#20b65a] px-6 text-sm font-black text-white">Falar com o MyPets pelo WhatsApp</a>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}