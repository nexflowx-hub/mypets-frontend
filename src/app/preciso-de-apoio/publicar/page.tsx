import type { Metadata } from "next";
import { CommunityCauseIntake } from "@/components/causes/community-cause-intake";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { CommunityCauseType } from "@/lib/cause-intake";
import { apiGet } from "@/lib/api";
import { BadgeCheck, Clock3, Globe2, HeartHandshake, Megaphone, ShieldCheck, Sparkles } from "lucide-react";

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
        <section className="relative overflow-hidden bg-petrol text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-coral/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#3aa69f]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-coral">
                <Sparkles className="h-3.5 w-3.5" /> Abrir uma causa
              </div>
              <h1 className="mt-5 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">A sua história pode encontrar quem quer ajudar.</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-white/72">Conte o que está a acontecer, mostre a realidade da causa e crie uma presença pública no MyPets. Nesta primeira etapa não pedimos documentos nem dados bancários.</p>
              <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-white/75">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Sem conta obrigatória</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Sem dados bancários</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Página pública em minutos</span>
              </div>
            </div>

            <figure className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20">
              <img
                src="https://images.pexels.com/photos/35231857/pexels-photo-35231857/free-photo-of-volunteer-feeding-rescued-dogs-at-animal-shelter.jpeg?auto=compress&dpr=1&h=900&w=1400"
                alt="Voluntário alimentando cães resgatados num abrigo"
                className="h-[360px] w-full object-cover sm:h-[430px]"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-petrol via-petrol/80 to-transparent px-6 pb-6 pt-24">
                <p className="max-w-md text-lg font-black leading-6">Uma causa começa com contexto, rosto e história — não com um formulário bancário.</p>
                <p className="mt-2 text-xs leading-5 text-white/65">O MyPets transforma a submissão numa página partilhável e prepara o caminho para verificação posterior.</p>
              </div>
            </figure>
          </div>
        </section>

        <section className="border-b border-border/70 bg-white">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            <div className="rounded-2xl bg-sand/60 p-4"><Globe2 className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black text-petrol">1 · Presença pública</p><p className="mt-1 text-xs leading-5 text-muted-foreground">URL própria, indexável e pronta para partilha.</p></div>
            <div className="rounded-2xl bg-sand/60 p-4"><Megaphone className="h-5 w-5 text-coral" /><p className="mt-3 text-sm font-black text-petrol">2 · Fila editorial</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A causa entra no fluxo de conteúdo e promoção MyPets.</p></div>
            <div className="rounded-2xl bg-sand/60 p-4"><ShieldCheck className="h-5 w-5 text-[#0d6e6b]" /><p className="mt-3 text-sm font-black text-petrol">3 · Verificação</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Identidade e documentos só quando quiser avançar.</p></div>
            <div className="rounded-2xl bg-sand/60 p-4"><BadgeCheck className="h-5 w-5 text-emerald-700" /><p className="mt-3 text-sm font-black text-petrol">4 · Captação habilitada</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Recebimentos apenas depois da análise financeira aplicável.</p></div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8 grid overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm md:grid-cols-[.9fr_1.1fr]">
            <img
              src="https://images.pexels.com/photos/7474086/pexels-photo-7474086.jpeg?auto=compress&dpr=1&h=750&w=1100"
              alt="Voluntária com um cão resgatado"
              className="h-full min-h-72 w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Como funciona</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-petrol sm:text-3xl">Primeiro damos visibilidade. Depois construímos confiança.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">A publicação inicial aparece como <strong className="text-petrol">“Enviada pela comunidade · ainda não verificada pelo MyPets”</strong>. A página pode ser partilhada desde o primeiro momento, mas não recebe pagamentos pelo MyPets nesta fase.</p>
              <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                <p><strong className="text-petrol">Quer avançar?</strong> Solicite o selo MyPets Verificado pelo canal indicado após a publicação.</p>
                <p><strong className="text-petrol">Quer captar?</strong> A habilitação financeira só acontece depois da validação do responsável e da configuração do beneficiário com os prestadores integrados.</p>
              </div>
            </div>
          </div>

          {enabled ? (
            <CommunityCauseIntake initialType={initialType} />
          ) : (
            <div className="rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700"><Clock3 className="h-7 w-7" /></span>
              <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-amber-700">Sincronização final</p>
              <h2 className="mt-2 text-3xl font-black text-petrol">Estamos a concluir a ligação do formulário à base MyPets.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Enquanto a API conclui a atualização, mantemos o envio bloqueado para garantir que nenhuma história é perdida. O canal humano continua disponível.</p>
              <a href="https://wa.me/5562996197224?text=Ol%C3%A1%20MyPets%2C%20preciso%20de%20apoio%20e%20quero%20apresentar%20uma%20causa." target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#20b65a] px-6 text-sm font-black text-white">Falar com o MyPets pelo WhatsApp</a>
            </div>
          )}

          <div className="mt-10 rounded-[2rem] bg-petrol p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Depois da publicação</p>
                <h2 className="mt-2 text-2xl font-black">A página da causa continua a ser sua história.</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">Pode partilhar o link, acompanhar o processo de verificação e, numa fase posterior, gerir apoios e atualizações sem perder a URL original.</p>
              </div>
              <HeartHandshake className="h-12 w-12 shrink-0 text-coral" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
