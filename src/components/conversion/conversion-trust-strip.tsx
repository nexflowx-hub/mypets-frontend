import Link from "next/link";
import { ArrowRight, BadgeCheck, LockKeyhole, ShieldCheck, WalletCards } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Destino identificado",
    text: "Antes do pagamento, fica claro se o apoio é para o MyPets, uma frente temática ou uma causa específica.",
  },
  {
    icon: LockKeyhole,
    title: "Pagamento protegido",
    text: "O fluxo financeiro é processado através da infraestrutura segura XPAYMENTS.",
  },
  {
    icon: WalletCards,
    title: "Fundos separados",
    text: "Apoio institucional, fundos temáticos e causas de terceiros não são apresentados como o mesmo destino.",
  },
];

export function ConversionTrustStrip() {
  return (
    <section className="border-y border-border/70 bg-white" aria-label="Confiança e transparência">
      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b] ring-1 ring-[#d5efec]">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black text-petrol">{title}</p>
                <p className="mt-1 max-w-xs text-[11px] leading-5 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/apoiar/mypets?utm_source=mypets&utm_medium=internal&utm_campaign=always_on&utm_content=trust_strip_primary" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white shadow-[0_10px_24px_-12px_rgba(232,79,69,0.7)] transition hover:bg-coral-dark">
              <ShieldCheck className="h-4 w-4" /> Apoiar agora
            </Link>
            <Link href="/causas?utm_source=mypets&utm_medium=internal&utm_campaign=always_on&utm_content=trust_strip_causes" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-white px-5 text-sm font-black text-petrol transition hover:border-coral/40 hover:text-coral">
              Escolher causa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
