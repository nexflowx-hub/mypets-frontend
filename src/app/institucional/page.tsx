import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Globe2, Mail, Phone, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LEGAL_CONTACT, LEGAL_ENTITIES } from "@/lib/legal/entities";

export const metadata: Metadata = {
  title: "Estrutura institucional e operadores | MyPets",
  description: "Conheça os operadores da marca MyPets no Brasil e nos mercados internacionais, os contactos oficiais e a separação entre tecnologia, comércio e apoio.",
  alternates: { canonical: "/institucional" },
};

function EntityCard({ entityKey }: { entityKey: "BR" | "UK" }) {
  const entity = LEGAL_ENTITIES[entityKey];
  const isConfigured = entityKey === "UK" || (entity.legalName && entity.addressLines.length > 0);
  return (
    <article id={entityKey === "BR" ? "brasil" : "europe"} className="rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><Building2 className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">{entity.displayName}</p><h2 className="mt-1 text-xl font-black text-petrol">{isConfigured ? entity.legalName : entity.publicLabel}</h2></div></div>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="text-xs font-black uppercase tracking-[0.12em] text-petrol/45">{entity.taxIdLabel}</dt><dd className="mt-1 font-bold text-petrol">{entity.taxId}</dd></div>
        <div><dt className="text-xs font-black uppercase tracking-[0.12em] text-petrol/45">Papel</dt><dd className="mt-1 leading-6 text-muted-foreground">{entity.role}</dd></div>
        {entity.addressLines.length > 0 && <div className="sm:col-span-2"><dt className="text-xs font-black uppercase tracking-[0.12em] text-petrol/45">Endereço registado / comercial</dt><dd className="mt-1 leading-6 text-petrol">{entity.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</dd></div>}
      </dl>
      <p className="mt-6 rounded-2xl bg-[#f8faf9] p-4 text-xs leading-6 text-muted-foreground">{entity.note}</p>
    </article>
  );
}

export default function InstitutionalPage() {
  const br = LEGAL_ENTITIES.BR;
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#fbfcfc] pt-[72px]">
        <section className="bg-[#073d3a] text-white"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><p className="text-xs font-black uppercase tracking-[0.18em] text-[#8de0d8]">Estrutura institucional</p><h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">Uma marca global, com operador identificado em cada mercado.</h1><p className="mt-5 max-w-3xl text-base leading-8 text-white/70">MyPets é uma marca e experiência digital. O vendedor, prestador ou destinatário de um apoio é identificado conforme o mercado e o fluxo utilizado. Comércio, tecnologia e apoio não são tratados como a mesma operação.</p></div></section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 lg:grid-cols-2"><EntityCard entityKey="BR" /><EntityCard entityKey="UK" /></div>

          <div id="tecnologia" className="mt-8 rounded-[2rem] border border-border bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff3f1] text-coral"><Globe2 className="h-5 w-5" /></span><div><h2 className="text-xl font-black text-petrol">Tecnologia e operação</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">HUMAN IMPACT TECH LTD é a empresa tecnológica que suporta o produto MyPets e pode atuar como operador comercial internacional quando expressamente identificada no checkout ou nos termos aplicáveis. No Brasil, a venda local é atribuída ao operador brasileiro identificado acima; a participação da HUMAN IMPACT TECH LTD como fornecedora tecnológica não a transforma automaticamente no vendedor brasileiro.</p></div></div>
          </div>

          <div id="contactos" className="mt-8 grid gap-4 md:grid-cols-3">
            <a href={`mailto:${LEGAL_CONTACT.support}`} className="rounded-3xl border border-border bg-white p-5"><Mail className="h-5 w-5 text-coral" /><p className="mt-4 text-sm font-black text-petrol">Atendimento</p><p className="mt-1 text-sm text-muted-foreground">{LEGAL_CONTACT.support}</p></a>
            <a href={br.phone ? `tel:${br.phone.replace(/\D/g, "")}` : `mailto:${LEGAL_CONTACT.support}`} className="rounded-3xl border border-border bg-white p-5"><Phone className="h-5 w-5 text-coral" /><p className="mt-4 text-sm font-black text-petrol">Brasil</p><p className="mt-1 text-sm text-muted-foreground">{br.phone || "Contacto publicado na configuração de produção"}</p></a>
            <a href={`mailto:${LEGAL_CONTACT.privacy}`} className="rounded-3xl border border-border bg-white p-5"><ShieldCheck className="h-5 w-5 text-coral" /><p className="mt-4 text-sm font-black text-petrol">Privacidade</p><p className="mt-1 text-sm text-muted-foreground">{LEGAL_CONTACT.privacy}</p></a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm font-bold"><Link href="/legal/termos" className="rounded-full border border-border bg-white px-5 py-3 text-petrol">Termos de Uso</Link><Link href="/legal/privacidade" className="rounded-full border border-border bg-white px-5 py-3 text-petrol">Privacidade</Link><Link href="/legal/loja" className="rounded-full border border-border bg-white px-5 py-3 text-petrol">Termos da Loja</Link><Link href="/legal/apoios" className="rounded-full border border-border bg-white px-5 py-3 text-petrol">Apoios e contribuições</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
