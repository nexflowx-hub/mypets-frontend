import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Globe2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LEGAL_CONTACT, LEGAL_ENTITIES } from "@/lib/legal-entities";

export const metadata: Metadata = {
  title: "Entidades e operadores | MyPets",
  description: "Identificacao dos operadores juridicos e comerciais do ecossistema MyPets no Brasil e na operacao internacional.",
  alternates: { canonical: "/institucional/entidades" },
};

const entities = [LEGAL_ENTITIES.MYPETS_BR, LEGAL_ENTITIES.HUMAN_IMPACT_UK];

export default function LegalEntitiesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f8fbfa] pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8de0d8]">Informacao institucional</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Quem opera o MyPets em cada mercado.</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/70">MyPets e a marca e experiencia digital. A entidade que vende produtos, processa uma operacao comercial ou presta determinados servicos depende do mercado. A identificacao completa fica concentrada aqui e e repetida no checkout quando juridicamente relevante.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            {entities.map((entity) => (
              <article key={entity.code} className="rounded-[2rem] border border-border bg-white p-7 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">{entity.publicLabel}</p><h2 className="mt-2 text-2xl font-black text-petrol">{entity.legalName}</h2></div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8f7] text-[#0d6e6b]"><Building2 className="h-5 w-5" /></span>
                </div>
                <dl className="mt-7 space-y-4 text-sm">
                  <div><dt className="font-black text-petrol">{entity.registrationLabel}</dt><dd className="mt-1 text-muted-foreground">{entity.registrationNumber}</dd></div>
                  <div><dt className="font-black text-petrol">Papel no ecossistema</dt><dd className="mt-1 leading-6 text-muted-foreground">{entity.role}</dd></div>
                  <div><dt className="flex items-center gap-2 font-black text-petrol"><MapPin className="h-4 w-4" /> Endereco</dt><dd className="mt-1 leading-6 text-muted-foreground">{entity.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</dd></div>
                  <div><dt className="flex items-center gap-2 font-black text-petrol"><Mail className="h-4 w-4" /> Contacto</dt><dd className="mt-1 text-muted-foreground"><a href={`mailto:${entity.supportEmail}`} className="hover:text-coral">{entity.supportEmail}</a></dd></div>
                  {entity.supportPhone && <div><dt className="flex items-center gap-2 font-black text-petrol"><Phone className="h-4 w-4" /> Brasil</dt><dd className="mt-1 text-muted-foreground"><a href="tel:+5562996197224" className="hover:text-coral">{entity.supportPhone}</a> · <a href={LEGAL_CONTACT.brazilWhatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-coral">WhatsApp</a></dd></div>}
                </dl>
                <div className="mt-7 rounded-2xl bg-[#f7fbfa] p-4 text-xs leading-6 text-muted-foreground"><ShieldCheck className="mb-2 h-5 w-5 text-[#0d6e6b]" />{entity.note}</div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-border bg-white p-7">
            <div className="flex items-center gap-3"><Globe2 className="h-6 w-6 text-coral" /><h2 className="text-xl font-black text-petrol">Separacao por mercado</h2></div>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">No Brasil, a operacao comercial local usa a identificacao MyPets Brasil e o fornecedor juridico brasileiro indicado acima. Para Reino Unido e experiencia europeia/internacional, a entidade juridica e HUMAN IMPACT TECH LTD. “MyPets Europe” e uma designacao comercial e nao pretende representar uma sociedade constituida na Uniao Europeia.</p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Os fluxos de apoio a causas, fundos e protetores permanecem separados das compras da Loja MyPets. A entidade, o destino e a natureza do pagamento devem ser apresentados antes da confirmacao financeira.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold"><Link href="/legal/termos" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Termos de Uso</Link><Link href="/legal/privacidade" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Privacidade</Link><Link href="/legal/loja" className="rounded-full border border-border bg-white px-4 py-2 text-petrol">Termos da Loja</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
