"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, CirclePlus, LogOut, PawPrint, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged, signOut } from "@/lib/auth-client";
import type { CoreNeed, CorePet, MePayload } from "@/lib/core-types";
import { useUiStore } from "@/lib/stores";

type Envelope<T> = { data: T };

const fieldClass = "h-11 rounded-xl border-border bg-white";
const selectClass = "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30";

export function DashboardClient() {
  const router = useRouter();
  const setAuthOpen = useUiStore((s) => s.setAuthOpen);
  const [me, setMe] = React.useState<MePayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState("");
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const session = await getValidSession();
      if (!session) {
        setMe(null);
        return;
      }
      const response = await authApi<Envelope<MePayload>>("/me");
      setMe(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar a conta.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  async function run(name: string, action: () => Promise<void>) {
    setBusy(name);
    setError("");
    setNotice("");
    try {
      await action();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-6xl items-center justify-center px-6">
        <RefreshCw className="h-6 w-6 animate-spin text-coral" aria-label="A carregar" />
      </div>
    );
  }

  if (!me) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-coral"><PawPrint className="h-7 w-7" /></span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-petrol">A sua área MyPets</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">Entre ou crie uma conta para registar o seu perfil de protetor, animais, necessidades e atualizações.</p>
        <Button onClick={() => setAuthOpen(true)} className="mt-7 h-12 rounded-xl bg-coral px-7 font-bold text-white hover:bg-coral-dark">Entrar / criar conta</Button>
      </section>
    );
  }

  const protector = me.protector;
  const pets = protector?.pets ?? [];
  const needs = protector?.needs ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">O Meu Impacto</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-petrol sm:text-4xl">Olá{me.displayName ? `, ${me.displayName}` : ""}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">{me.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {protector && (
            <Button asChild variant="outline" className="rounded-xl"><Link href={`/protetores/${protector.slug}`}>Ver perfil público</Link></Button>
          )}
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => void run("logout", async () => { await signOut(); router.push("/"); router.refresh(); })}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      {(error || notice) && (
        <div className="mt-6">
          {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
          {notice && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{notice}</p>}
        </div>
      )}

      {!protector ? (
        <ProtectorForm busy={busy === "protector"} onSubmit={(payload) => run("protector", async () => {
          await authApi("/protectors", { method: "POST", body: JSON.stringify(payload) });
          setNotice("Perfil de protetor criado. Agora pode registar o primeiro animal.");
        })} />
      ) : (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Verificação" value={protector.verification.replaceAll("_", " ")} icon={<ShieldCheck className="h-5 w-5" />} />
            <Stat label="Animais registados" value={String(pets.length)} icon={<PawPrint className="h-5 w-5" />} />
            <Stat label="Necessidades" value={String(needs.length)} icon={<CirclePlus className="h-5 w-5" />} />
            <Stat label="Localização" value={`${protector.city}, ${protector.country}`} icon={<BadgeCheck className="h-5 w-5" />} />
          </section>

          <div className="mt-8 grid gap-8 xl:grid-cols-2">
            <PetForm
              country={protector.country}
              busy={busy === "pet"}
              onSubmit={(payload) => run("pet", async () => {
                const result = await authApi<Envelope<CorePet>>("/pets", { method: "POST", body: JSON.stringify(payload) });
                setNotice(`Animal registado com FacePets ID ${result.data.facepetsId}.`);
              })}
            />
            <NeedForm
              country={protector.country}
              pets={pets}
              busy={busy === "need"}
              onSubmit={(payload) => run("need", async () => {
                await authApi<Envelope<CoreNeed>>("/needs", { method: "POST", body: JSON.stringify(payload) });
                setNotice("Necessidade publicada.");
              })}
            />
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-petrol">Os meus animais</h2>
            {pets.length === 0 ? <Empty text="Ainda não registou nenhum animal." /> : (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <Link key={pet.id} href={`/pets/${pet.facepetsId}`} className="rounded-2xl border border-border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-extrabold text-petrol">{pet.name}</h3>
                      <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink/65">{pet.status}</span>
                    </div>
                    <p className="mt-2 font-mono text-xs font-bold text-coral">{pet.facepetsId}</p>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{pet.story || "Sem história publicada ainda."}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-petrol">Necessidades publicadas</h2>
            {needs.length === 0 ? <Empty text="Ainda não publicou nenhuma necessidade." /> : (
              <div className="mt-4 grid gap-3">
                {needs.map((need) => (
                  <div key={need.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide text-coral">{need.type}</p>
                      <h3 className="mt-1 font-extrabold text-petrol">{need.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{need.description}</p>
                    </div>
                    <span className="w-fit rounded-full bg-sand px-3 py-1 text-xs font-bold text-ink/70">{need.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-2 text-coral">{icon}<span className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">{label}</span></div>
      <p className="mt-3 text-lg font-extrabold text-petrol">{value}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mt-4 rounded-2xl border border-dashed border-border bg-white p-7 text-sm text-muted-foreground">{text}</p>;
}

function ProtectorForm({ busy, onSubmit }: { busy: boolean; onSubmit: (payload: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = React.useState({ displayName: "", country: "PT", city: "", region: "", bio: "", yearsActive: "0", animalsCurrent: "0", activityTypes: "resgate, acolhimento, alimentação" });
  return (
    <section className="mt-8 rounded-3xl border border-border bg-white p-6 sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Primeiro passo</p>
      <h2 className="mt-2 text-2xl font-extrabold text-petrol">Criar perfil de protetor</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Este perfil identifica quem está na linha da frente. A verificação documental será adicionada numa etapa separada e nunca será publicada.</p>
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void onSubmit({
        displayName: form.displayName,
        country: form.country,
        city: form.city,
        region: form.region || null,
        bio: form.bio || null,
        yearsActive: Number(form.yearsActive),
        animalsCurrent: Number(form.animalsCurrent),
        activityTypes: form.activityTypes.split(",").map((v) => v.trim()).filter(Boolean),
        socialLinks: {},
      }); }}>
        <Input required placeholder="Nome público" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className={fieldClass} />
        <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={selectClass}><option value="PT">Portugal</option><option value="BR">Brasil</option></select>
        <Input required placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={fieldClass} />
        <Input placeholder="Região / distrito / estado" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={fieldClass} />
        <Input type="number" min="0" placeholder="Anos de atividade" value={form.yearsActive} onChange={(e) => setForm({ ...form, yearsActive: e.target.value })} className={fieldClass} />
        <Input type="number" min="0" placeholder="Animais atualmente" value={form.animalsCurrent} onChange={(e) => setForm({ ...form, animalsCurrent: e.target.value })} className={fieldClass} />
        <Input placeholder="Atividades separadas por vírgula" value={form.activityTypes} onChange={(e) => setForm({ ...form, activityTypes: e.target.value })} className={`sm:col-span-2 ${fieldClass}`} />
        <Textarea placeholder="Conte brevemente o trabalho que realiza" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="min-h-32 rounded-xl border-border sm:col-span-2" />
        <Button disabled={busy} className="h-12 rounded-xl bg-coral font-bold text-white hover:bg-coral-dark sm:col-span-2">{busy ? "A criar..." : "Criar perfil de protetor"}</Button>
      </form>
    </section>
  );
}

function PetForm({ country, busy, onSubmit }: { country: "PT" | "BR"; busy: boolean; onSubmit: (payload: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = React.useState({ name: "", species: "DOG", sex: "UNKNOWN", city: "", rescueDate: "", status: "RESCUED", story: "" });
  return (
    <section className="rounded-3xl border border-border bg-white p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">FacePets</p>
      <h2 className="mt-2 text-xl font-extrabold text-petrol">Registar animal</h2>
      <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void onSubmit({ ...form, country, city: form.city || null, rescueDate: form.rescueDate || null, story: form.story || null }); }}>
        <Input required placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
        <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value })} className={selectClass}><option value="DOG">Cão</option><option value="CAT">Gato</option><option value="OTHER">Outro</option></select>
        <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className={selectClass}><option value="UNKNOWN">Sexo desconhecido</option><option value="FEMALE">Fêmea</option><option value="MALE">Macho</option></select>
        <Input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={fieldClass} />
        <Input type="date" value={form.rescueDate} onChange={(e) => setForm({ ...form, rescueDate: e.target.value })} className={fieldClass} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}><option value="RESCUED">Resgatado</option><option value="TREATMENT">Em tratamento</option><option value="RECOVERED">Recuperado</option><option value="ADOPTABLE">Disponível para adoção</option><option value="ADOPTED">Adotado</option></select>
        <Textarea placeholder="História do animal" value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} className="min-h-28 rounded-xl border-border sm:col-span-2" />
        <Button disabled={busy} className="h-11 rounded-xl bg-petrol font-bold text-white hover:bg-petrol/90 sm:col-span-2">{busy ? "A registar..." : "Registar animal e gerar FacePets ID"}</Button>
      </form>
    </section>
  );
}

function NeedForm({ country, pets, busy, onSubmit }: { country: "PT" | "BR"; pets: CorePet[]; busy: boolean; onSubmit: (payload: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = React.useState({ petId: "", type: "FOOD", title: "", description: "", supportMode: "BOTH", target: "", status: "OPEN" });
  const financial = form.supportMode !== "NON_FINANCIAL";
  return (
    <section className="rounded-3xl border border-border bg-white p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Ajuda concreta</p>
      <h2 className="mt-2 text-xl font-extrabold text-petrol">Publicar necessidade</h2>
      <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void onSubmit({
        petId: form.petId || null,
        type: form.type,
        title: form.title,
        description: form.description || null,
        supportMode: form.supportMode,
        targetAmountCents: financial ? Math.round(Number(form.target) * 100) : null,
        currency: financial ? (country === "PT" ? "EUR" : "BRL") : null,
        status: form.status,
        isPublic: true,
      }); }}>
        <select value={form.petId} onChange={(e) => setForm({ ...form, petId: e.target.value })} className={selectClass}><option value="">Necessidade geral do protetor</option>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name} — {pet.facepetsId}</option>)}</select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}><option value="FOOD">Ração</option><option value="MEDICATION">Medicação</option><option value="VET">Veterinário</option><option value="TRANSPORT">Transporte</option><option value="FOSTER">Acolhimento</option><option value="STERILIZATION">Esterilização</option><option value="SUPPLIES">Materiais</option><option value="ADOPTION">Adoção</option><option value="VOLUNTEER">Voluntariado</option><option value="OTHER">Outra</option></select>
        <Input required placeholder="Título da necessidade" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`sm:col-span-2 ${fieldClass}`} />
        <select value={form.supportMode} onChange={(e) => setForm({ ...form, supportMode: e.target.value })} className={selectClass}><option value="BOTH">Apoio financeiro ou material</option><option value="FINANCIAL">Apenas apoio financeiro</option><option value="NON_FINANCIAL">Apenas apoio não financeiro</option></select>
        {financial ? <Input required type="number" min="1" step="0.01" placeholder={country === "PT" ? "Objetivo (€)" : "Objetivo (R$)"} value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className={fieldClass} /> : <div />}
        <Textarea placeholder="Explique exatamente o que é necessário" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-28 rounded-xl border-border sm:col-span-2" />
        <Button disabled={busy} className="h-11 rounded-xl bg-petrol font-bold text-white hover:bg-petrol/90 sm:col-span-2">{busy ? "A publicar..." : "Publicar necessidade"}</Button>
      </form>
    </section>
  );
}
