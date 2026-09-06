"use client";

import Link from "next/link";
import { HeartHandshake, Share2, UserRoundPlus, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDonateStore, useUiStore } from "@/lib/stores";

export function SupportIntentDialog() {
  const { open, target, closeDonate } = useDonateStore();
  const setAuthOpen = useUiStore((state) => state.setAuthOpen);

  const share = async () => {
    const url = window.location.href;
    const text = target?.label
      ? `Conheça ${target.label} no MyPets e veja como pode ajudar.`
      : "Conheça as causas e histórias do MyPets e veja como pode ajudar.";
    if (navigator.share) {
      try {
        await navigator.share({ title: "MyPets", text, url });
        return;
      } catch {
        // A cancelled share simply falls back to copying the link.
      }
    }
    await navigator.clipboard.writeText(url);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && closeDonate()}>
      <DialogContent className="rounded-2xl border-border bg-white p-0 sm:max-w-[440px]">
        <div className="bg-petrol px-6 pb-6 pt-6 text-white sm:rounded-t-2xl">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-coral"><HeartHandshake className="h-5 w-5" /></span>
          <DialogHeader className="mt-3 text-left">
            <DialogTitle className="text-xl font-extrabold text-white">Quero ajudar</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/70">
              {target?.label ? `Mostrou interesse em apoiar ${target.label}.` : "Obrigado por querer fazer parte desta rede de apoio."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-xl border border-border bg-sand/55 p-4">
            <p className="text-sm font-extrabold text-petrol">Apoio financeiro acontece nas causas</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">O MyPets só apresenta checkout financeiro em causas ativas e elegíveis. Histórias editoriais ou de demonstração nunca geram uma cobrança direta.</p>
          </div>

          <div className="mt-5 grid gap-2.5">
            <Button asChild className="h-11 rounded-xl bg-coral font-bold text-white hover:bg-coral-dark">
              <Link href="/causas" onClick={closeDonate}>Ver causas para apoiar <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button
              onClick={() => {
                closeDonate();
                setAuthOpen(true);
              }}
              variant="outline"
              className="h-11 rounded-xl font-bold"
            >
              <UserRoundPlus className="mr-2 h-4 w-4" /> Criar conta / acompanhar
            </Button>
            <Button variant="outline" onClick={() => void share()} className="h-11 rounded-xl font-bold">
              <Share2 className="mr-2 h-4 w-4" /> Partilhar esta página
            </Button>
            <Button asChild variant="ghost" className="h-11 rounded-xl font-bold text-petrol">
              <Link href="/dashboard" onClick={closeDonate}>Ver formas de participar</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
