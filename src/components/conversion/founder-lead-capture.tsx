"use client";

import * as React from "react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { createGrowthLead } from "@/lib/growth";

export function FounderLeadCapture() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [marketingConsent, setMarketingConsent] = React.useState(true);
  const [status, setStatus] = React.useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = React.useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const params = new URLSearchParams(window.location.search);
      await createGrowthLead({
        intent: "SUPPORT",
        name: name.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        country: "BR",
        source: params.get("utm_source") ?? "mypets",
        medium: params.get("utm_medium") ?? "owned",
        campaign: params.get("utm_campaign") ?? "ebook_racao_founder_v1",
        content: params.get("utm_content") ?? "founder_waitlist",
        term: params.get("utm_term"),
        landingPath: `${window.location.pathname}${window.location.search}`.slice(0, 500),
        contactConsent: true,
        marketingConsent,
        message: "Interesse no Membro Fundador MyPets — acesso vitalício à biblioteca e beta Virtual-Pet.",
        metadata: {
          offer: "mypets-founder-lifetime",
          advertisedPriceBrl: 99.9,
          currentLibraryGuides: 13,
          founderBadge: true,
          virtualPetPreview: true,
          whatsappCommunityInterest: true,
        },
      });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível guardar o seu interesse.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-emerald-950">Está na lista prioritária de Fundadores.</p>
            <p className="mt-1 text-xs leading-5 text-emerald-900/70">
              Vamos avisar quando a adesão vitalícia estiver aberta e quando começar a ante-estreia da Virtual-Pet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-300" />
        <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-200">Lista prioritária de Fundadores</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          className="min-h-12 rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-petrol outline-none placeholder:text-petrol/40"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Seu melhor email"
          className="min-h-12 rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-petrol outline-none placeholder:text-petrol/40"
        />
      </div>

      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="WhatsApp (opcional)"
        inputMode="tel"
        className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-petrol outline-none placeholder:text-petrol/40"
      />

      <label className="mt-3 flex items-start gap-2 text-[10px] leading-4 text-white/65">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(event) => setMarketingConsent(event.target.checked)}
          className="mt-0.5"
        />
        Quero receber novidades da Biblioteca MyPets, comunidade e ante-estreia da Virtual-Pet.
      </label>

      {error && <p className="mt-2 text-xs font-bold text-rose-200">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 text-sm font-black text-[#10252c] transition hover:bg-amber-200 disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Quero prioridade como Membro Fundador
      </button>

      <p className="mt-2 text-[9px] leading-4 text-white/45">
        A inscrição na lista não gera cobrança. A regra de impacto em kg da oferta vitalícia será mostrada de forma explícita antes de qualquer adesão.
      </p>
    </form>
  );
}
