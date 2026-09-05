"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import type { MePayload } from "@/lib/core-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Envelope<T> = { data: T };

export function ProtectorSocialPanel() {
  const [protectorId, setProtectorId] = React.useState<string | null>(null);
  const [links, setLinks] = React.useState({ instagram: "", facebook: "", tiktok: "", youtube: "", website: "" });
  const [busy, setBusy] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    const session = await getValidSession();
    if (!session) return setProtectorId(null);
    try {
      const response = await authApi<Envelope<MePayload>>("/me");
      const protector = response.data.protector;
      if (!protector) return setProtectorId(null);
      setProtectorId(protector.id);
      const current = protector.socialLinks ?? {};
      setLinks({
        instagram: current.instagram ?? "",
        facebook: current.facebook ?? "",
        tiktok: current.tiktok ?? "",
        youtube: current.youtube ?? "",
        website: current.website ?? "",
      });
    } catch {
      setProtectorId(null);
    }
  }, []);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  if (!protectorId) return null;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const socialLinks = Object.fromEntries(Object.entries(links).filter(([, value]) => value.trim()).map(([key, value]) => [key, value.trim()]));
      await authApi(`/protectors/${protectorId}`, { method: "PATCH", body: JSON.stringify({ socialLinks }) });
      setNotice("Redes sociais atualizadas.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível guardar as redes sociais.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-coral"><ExternalLink className="h-5 w-5" /></span>
          <div><h2 className="text-xl font-extrabold text-petrol">Redes e presença pública</h2><p className="mt-1 text-sm text-muted-foreground">Ligue os canais onde as pessoas podem conhecer melhor o seu trabalho. Só URLs públicas são apresentadas.</p></div>
        </div>
        <form onSubmit={save} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input type="url" placeholder="https://instagram.com/..." value={links.instagram} onChange={(e) => setLinks({ ...links, instagram: e.target.value })} className="h-11 rounded-xl" />
          <Input type="url" placeholder="https://facebook.com/..." value={links.facebook} onChange={(e) => setLinks({ ...links, facebook: e.target.value })} className="h-11 rounded-xl" />
          <Input type="url" placeholder="https://tiktok.com/@..." value={links.tiktok} onChange={(e) => setLinks({ ...links, tiktok: e.target.value })} className="h-11 rounded-xl" />
          <Input type="url" placeholder="https://youtube.com/@..." value={links.youtube} onChange={(e) => setLinks({ ...links, youtube: e.target.value })} className="h-11 rounded-xl" />
          <Input type="url" placeholder="https://site-pessoal.org" value={links.website} onChange={(e) => setLinks({ ...links, website: e.target.value })} className="h-11 rounded-xl sm:col-span-2" />
          <div className="flex items-center gap-3 lg:col-span-3">
            <Button disabled={busy} className="h-11 rounded-xl bg-petrol px-5 font-bold text-white hover:bg-petrol/90">{busy ? "A guardar..." : "Guardar redes sociais"}</Button>
            {notice && <span className="text-sm font-medium text-emerald-700">{notice}</span>}
            {error && <span className="text-sm font-medium text-red-700">{error}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}
