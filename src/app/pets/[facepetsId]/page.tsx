import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Heart, MapPin, ShieldCheck } from "lucide-react";
import { apiGet } from "@/lib/api";
import type { CoreNeed, CorePet } from "@/lib/core-types";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const dynamic = "force-dynamic";

type PetPayload = CorePet & {
  protector: { id: string; slug: string; displayName: string; verification: string };
  updates: Array<{ id: string; title: string | null; body: string; statusAfter: string | null; createdAt: string }>;
  needs: CoreNeed[];
};
type Envelope<T> = { data: T };

export default async function FacePetsPage({ params }: { params: Promise<{ facepetsId: string }> }) {
  const { facepetsId } = await params;
  let pet: PetPayload;
  try {
    pet = (await apiGet<Envelope<PetPayload>>(`/pets/${encodeURIComponent(facepetsId)}`)).data;
  } catch {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="font-mono text-sm font-extrabold tracking-[0.18em] text-coral">{pet.facepetsId}</p>
            <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-5xl font-extrabold tracking-tight">{pet.name}</h1>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{pet.city || pet.country}</span>
                  {pet.rescueDate && <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />Resgatado em {new Intl.DateTimeFormat("pt-PT").format(new Date(pet.rescueDate))}</span>}
                </div>
              </div>
              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wide">{pet.status}</span>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div>
            <section className="rounded-3xl border border-border bg-white p-6 sm:p-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Every pet has a story.</p>
              <h2 className="mt-2 text-2xl font-extrabold text-petrol">A história de {pet.name}</h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-ink/75">{pet.story || "A história deste animal está a ser preparada pelo protetor responsável."}</p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-extrabold text-petrol">Atualizações</h2>
              {pet.updates.length === 0 ? <Empty text="Ainda não existem atualizações públicas." /> : (
                <div className="mt-5 space-y-4">
                  {pet.updates.map((update) => (
                    <article key={update.id} className="rounded-2xl border border-border bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-extrabold text-petrol">{update.title || "Atualização"}</h3><time className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(update.createdAt))}</time></div>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{update.body}</p>
                      {update.statusAfter && <p className="mt-3 text-xs font-bold text-coral">Estado: {update.statusAfter}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-border bg-white p-6">
              <div className="flex items-center gap-2 text-coral"><ShieldCheck className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wide">Responsável</span></div>
              <Link href={`/protetores/${pet.protector.slug}`} className="mt-3 block text-lg font-extrabold text-petrol hover:text-coral">{pet.protector.displayName}</Link>
              <p className="mt-1 text-xs font-bold text-muted-foreground">{pet.protector.verification.replaceAll("_", " ")}</p>
            </section>

            <section className="rounded-3xl border border-border bg-white p-6">
              <div className="flex items-center gap-2 text-coral"><Heart className="h-5 w-5" /><h2 className="font-extrabold text-petrol">Como ajudar</h2></div>
              {pet.needs.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Não existem necessidades públicas neste momento.</p> : (
                <div className="mt-4 space-y-3">
                  {pet.needs.map((need) => (
                    <div key={need.id} className="rounded-xl bg-sand p-4"><p className="text-[10px] font-extrabold uppercase tracking-wide text-coral">{need.type}</p><p className="mt-1 text-sm font-extrabold text-petrol">{need.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{need.description}</p></div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mt-5 rounded-2xl border border-dashed border-border bg-white p-7 text-sm text-muted-foreground">{text}</p>;
}
