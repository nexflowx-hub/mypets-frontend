import Link from "next/link";
import { CheckCircle2, Globe2 } from "lucide-react";
import { COMMERCE_MARKETS } from "@/lib/commerce/markets";
import { LEGAL_ENTITIES } from "@/lib/legal/entities";

export function StoreMarketNotice() {
  const br = COMMERCE_MARKETS.BR;
  const eu = COMMERCE_MARKETS.EU;
  const uk = COMMERCE_MARKETS.UK;

  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-6 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3">
          <div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {br.label} · mercado prioritário</p><p className="mt-1 text-xs text-emerald-950/65">BRL · Pix e cartões · vendedor local identificado no checkout.</p></div>
          <Link href="/institucional#brasil" className="shrink-0 text-[11px] font-black text-emerald-800 underline-offset-4 hover:underline">{LEGAL_ENTITIES.BR.publicLabel}</Link>
        </div>
        {[eu, uk].map((market) => <div key={market.key} className="flex items-center gap-3 rounded-2xl border border-border bg-[#fbfcfc] px-4 py-3"><Globe2 className="h-4 w-4 shrink-0 text-petrol/45" /><div><p className="text-xs font-black text-petrol">{market.label}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{market.currency} · preparação comercial</p></div></div>)}
      </div>
    </section>
  );
}
