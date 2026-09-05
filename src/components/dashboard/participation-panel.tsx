"use client";

import * as React from "react";
import { HeartHandshake, HandHeart, PawPrint, Users, Home, Sparkles } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import type { ParticipationPayload, ParticipationRole } from "@/lib/core-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Envelope<T> = { data: T };

const ROLE_OPTIONS: Array<{ role: ParticipationRole; title: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
  { role: "PROTECTOR", title: "Protejo animais", description: "Resgato, acolho, alimento ou acompanho animais e posso precisar de apoio.", icon: PawPrint },
  { role: "VOLUNTEER", title: "Quero ser voluntário", description: "Posso oferecer tempo, transporte, acolhimento, divulgação ou outras competências.", icon: Users },
  { role: "DONOR", title: "Quero doar", description: "Quero apoiar causas, necessidades ou a rede MyPets com contribuições pontuais.", icon: HandHeart },
  { role: "SPONSOR", title: "Quero apadrinhar", description: "Quero acompanhar e apoiar de forma continuada um animal ou uma causa.", icon: HeartHandshake },
  { role: "ADOPTER", title: "Quero adotar", description: "Tenho interesse em conhecer animais disponíveis para adoção responsável.", icon: Home },
  { role: "SUPPORTER", title: "Quero divulgar e apoiar", description: "Quero seguir histórias, partilhar causas e ajudar a ampliar o alcance.", icon: Sparkles },
];

const fieldClass = "h-11 rounded-xl border-border bg-white";
const selectClass = "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-coral/30";

export function ParticipationPanel() {
  const [data, setData] = React.useState<ParticipationPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [error, setError] = React.useState("");
  const [volunteer, setVolunteer] = React.useState({ country: "PT", city: "", region: "", availability: "", participation: "transporte, divulgação", skills: "", radiusKm: "30", notes: "" });

  const load = React.useCallback(async () => {
    const session = await getValidSession();
    if (!session) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      const response = await authApi<Envelope<ParticipationPayload>>("/me/participation");
      setData(response.data);
      if (response.data.volunteer) {
        setVolunteer({
          country: response.data.volunteer.country ?? "PT",
          city: response.data.volunteer.city ?? "",
          region: response.data.volunteer.region ?? "",
          availability: response.data.volunteer.availability ?? "",
          participation: response.data.volunteer.participation.join(", "),
          skills: response.data.volunteer.skills.join(", "),
          radiusKm: response.data.volunteer.radiusKm?.toString() ?? "30",
          notes: response.data.volunteer.notes ?? "",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar as formas de participação.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  if (loading || !data) return null;

  const toggleRole = async (role: ParticipationRole) => {
    const selected = data.roles.includes(role);
    const roles = selected ? data.roles.filter((item) => item !== role) : [...data.roles, role];
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await authApi<Envelope<{ roles: ParticipationRole[] }>>("/me/roles", {
        method: "PUT",
        body: JSON.stringify({ roles }),
      });
      setData({ ...data, roles: response.data.roles });
      setNotice("Formas de participação atualizadas.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar.");
    } finally {
      setBusy(false);
    }
  };

  const saveVolunteer = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await authApi<Envelope<ParticipationPayload["volunteer"]>>("/me/volunteer", {
        method: "PUT",
        body: JSON.stringify({
          country: volunteer.country,
          city: volunteer.city || null,
          region: volunteer.region || null,
          availability: volunteer.availability || null,
          participation: volunteer.participation.split(",").map((v) => v.trim()).filter(Boolean),
          skills: volunteer.skills.split(",").map((v) => v.trim()).filter(Boolean),
          radiusKm: volunteer.radiusKm ? Number(volunteer.radiusKm) : null,
          notes: volunteer.notes || null,
          isActive: true,
        }),
      });
      setData({ ...data, roles: Array.from(new Set([...data.roles, "VOLUNTEER"])), volunteer: response.data });
      setNotice("Perfil de voluntariado guardado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível guardar o voluntariado.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">Como quer participar?</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-petrol">Uma conta, várias formas de ajudar.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Pode escolher mais do que uma opção e alterar depois. Ser doador, padrinho ou voluntário não exige criar um perfil de protetor.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLE_OPTIONS.map(({ role, title, description, icon: Icon }) => {
            const selected = data.roles.includes(role);
            return (
              <button
                key={role}
                type="button"
                disabled={busy}
                onClick={() => void toggleRole(role)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all disabled:opacity-60",
                  selected ? "border-coral bg-coral/5 shadow-sm" : "border-border bg-white hover:border-coral/40 hover:bg-sand/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", selected ? "bg-coral text-white" : "bg-sand text-coral")}><Icon className="h-5 w-5" /></span>
                  <div><p className="font-extrabold text-petrol">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></div>
                </div>
              </button>
            );
          })}
        </div>

        {(error || notice) && <div className="mt-4">{error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}</div>}

        {data.roles.includes("VOLUNTEER") && (
          <form onSubmit={saveVolunteer} className="mt-7 border-t border-border pt-7">
            <h3 className="text-lg font-extrabold text-petrol">Disponibilidade de voluntariado</h3>
            <p className="mt-1 text-sm text-muted-foreground">Estes dados servem para aproximar necessidades concretas de pessoas disponíveis para ajudar.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <select value={volunteer.country} onChange={(e) => setVolunteer({ ...volunteer, country: e.target.value })} className={selectClass}><option value="PT">Portugal</option><option value="BR">Brasil</option></select>
              <Input placeholder="Cidade" value={volunteer.city} onChange={(e) => setVolunteer({ ...volunteer, city: e.target.value })} className={fieldClass} />
              <Input placeholder="Região / distrito / estado" value={volunteer.region} onChange={(e) => setVolunteer({ ...volunteer, region: e.target.value })} className={fieldClass} />
              <Input placeholder="Disponibilidade (ex.: fins de semana)" value={volunteer.availability} onChange={(e) => setVolunteer({ ...volunteer, availability: e.target.value })} className={fieldClass} />
              <Input placeholder="Como posso ajudar, separado por vírgulas" value={volunteer.participation} onChange={(e) => setVolunteer({ ...volunteer, participation: e.target.value })} className={fieldClass} />
              <Input placeholder="Competências, separado por vírgulas" value={volunteer.skills} onChange={(e) => setVolunteer({ ...volunteer, skills: e.target.value })} className={fieldClass} />
              <Input type="number" min="0" max="500" placeholder="Raio em km" value={volunteer.radiusKm} onChange={(e) => setVolunteer({ ...volunteer, radiusKm: e.target.value })} className={fieldClass} />
              <Textarea placeholder="Observações" value={volunteer.notes} onChange={(e) => setVolunteer({ ...volunteer, notes: e.target.value })} className="min-h-24 rounded-xl border-border sm:col-span-2" />
            </div>
            <Button disabled={busy} className="mt-4 h-11 rounded-xl bg-petrol px-5 font-bold text-white hover:bg-petrol/90">Guardar voluntariado</Button>
          </form>
        )}
      </div>
    </section>
  );
}
