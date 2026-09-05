"use client";

import * as React from "react";
import Link from "next/link";
import { Link2, MousePointerClick, Share2 } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Payload = {
  activeLinks: number;
  clicks: number;
  topLinks: Array<{ code: string; path: string; destinationPath: string; channel: string | null; clicks: number }>;
};
type Envelope<T> = { data: T };

export function ReferralPanel() {
  const [data, setData] = React.useState<Payload | null>(null);

  const load = React.useCallback(async () => {
    const session = await getValidSession();
    if (!session) { setData(null); return; }
    try {
      setData((await authApi<Envelope<Payload>>("/me/referrals")).data);
    } catch {
      setData(null);
    }
  }, []);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  if (!data) return null;

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-border bg-petrol p-6 text-white sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-coral">A sua rede também ajuda</p>
            <h2 className="mt-2 text-2xl font-extrabold">Impacto das suas partilhas</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/65">Quando partilha uma página MyPets autenticado, criamos um link atribuível para medir quantas pessoas chegaram através de si.</p>
          </div>
          <Button asChild className="h-11 rounded-xl bg-coral px-5 font-bold text-white hover:bg-coral-dark">
            <Link href="/join/ajudar?v=social&utm_source=member&utm_medium=dashboard&utm_campaign=ambassadors&src_cta=referral_panel"><Share2 className="mr-2 h-4 w-4" />Partilhar MyPets</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/7 p-4"><div className="flex items-center gap-2 text-coral"><MousePointerClick className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">Cliques gerados</span></div><p className="mt-2 text-3xl font-extrabold">{data.clicks}</p></div>
          <div className="rounded-2xl bg-white/7 p-4"><div className="flex items-center gap-2 text-coral"><Link2 className="h-4 w-4" /><span className="text-xs font-bold uppercase tracking-wide">Links ativos</span></div><p className="mt-2 text-3xl font-extrabold">{data.activeLinks}</p></div>
        </div>

        {data.topLinks.length > 0 && (
          <div className="mt-5 space-y-2">
            {data.topLinks.slice(0, 3).map((item) => (
              <div key={item.code} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
                <span className="min-w-0 truncate text-white/70">{item.destinationPath}</span>
                <span className="font-extrabold text-white">{item.clicks} {item.clicks === 1 ? "clique" : "cliques"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
