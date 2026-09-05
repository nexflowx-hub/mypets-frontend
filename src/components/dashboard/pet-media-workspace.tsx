"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, ImageIcon, Loader2 } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { getValidSession, onAuthChanged } from "@/lib/auth-client";
import type { MePayload } from "@/lib/core-types";
import { PetMediaManager } from "./pet-media-manager";

type Envelope<T> = { data: T };

export function PetMediaWorkspace() {
  const [me, setMe] = React.useState<MePayload | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      const session = await getValidSession();
      if (!session) { setMe(null); return; }
      const response = await authApi<Envelope<MePayload>>("/me");
      setMe(response.data);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
    return onAuthChanged(() => void load());
  }, [load]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><Loader2 className="h-5 w-5 animate-spin text-coral" /></div>;
  const pets = me?.protector?.pets ?? [];
  if (!pets.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-[0_18px_44px_-36px_rgba(16,32,42,0.45)]">
        <div className="flex flex-col gap-3 border-b border-border bg-gradient-to-r from-petrol to-petrol-light px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-coral">Media & FacePets</p>
            <h2 className="mt-1 text-xl font-extrabold">Fotos dos seus animais</h2>
            <p className="mt-1 text-xs leading-relaxed text-white/65">Fotos reais aumentam confiança e tornam cada história muito mais partilhável.</p>
          </div>
          <Camera className="hidden h-8 w-8 text-white/30 sm:block" />
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <article key={pet.id} className="flex items-center gap-4 rounded-2xl border border-border bg-cream p-3.5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                {pet.primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pet.primaryImage} alt={pet.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-coral/60"><ImageIcon className="h-6 w-6" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/pets/${pet.facepetsId}`} className="block truncate text-sm font-extrabold text-petrol hover:text-coral">{pet.name}</Link>
                <p className="mt-0.5 truncate font-mono text-[10px] font-bold text-muted-foreground">{pet.facepetsId}</p>
                <div className="mt-2"><PetMediaManager pet={pet} onChanged={() => void load()} /></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
