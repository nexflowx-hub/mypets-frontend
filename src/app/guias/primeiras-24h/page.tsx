import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, HeartHandshake, MapPin, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthDialog } from "@/components/layout/auth-dialog";

export const metadata: Metadata = {
  title: "Encontrei um animal na rua. E agora? | Guia MyPets",
  description: "Guia prático MyPets para as primeiras 24 horas após encontrar um cão ou gato: segurança, urgência, transporte, documentação e pedido de ajuda.",
  alternates: { canonical: "/guias/primeiras-24h" },
  openGraph: {
    title: "Encontrei um animal na rua. E agora?",
    description: "Guia prático MyPets para as primeiras 24 horas.",
    url: "https://mypets.lat/guias/primeiras-24h",
    siteName: "MyPets",
    type: "article",
  },
};

const sections = [
  {
    title: "1. Segurança antes de tudo",
    items: [
      "Observe trânsito, outros animais, água, fogo, fios elétricos e o comportamento do animal antes de se aproximar.",
      "Reduza estímulos: fale baixo, evite movimentos bruscos e não cerque o animal com várias pessoas.",
      "Não force contacto. Dor e medo podem provocar mordidas ou arranhões mesmo em animais normalmente dóceis.",
    ],
  },
  {
    title: "2. Identifique sinais de urgência",
    items: [
      "Dificuldade para respirar, sangramento intenso, atropelamento, queda importante ou suspeita de fratura.",
      "Inconsciência, desmaio, convulsão prolongada/repetida ou incapacidade de se levantar.",
      "Queimadura, choque elétrico, possível intoxicação ou temperatura corporal aparentemente extrema.",
    ],
  },
  {
    title: "3. Contenção e transporte",
    items: [
      "Cães: quando for seguro, use guia, peitoral ou uma barreira que evite perseguição e fuga.",
      "Gatos: prefira caixa de transporte ou caixa firme e ventilada; uma toalha pode reduzir estímulos sem obstruir a respiração.",
      "Em suspeita de trauma, movimente o mínimo possível e confirme previamente uma clínica ou serviço de destino.",
    ],
  },
  {
    title: "4. O que evitar",
    items: [
      "Não dê medicamentos humanos ou veterinários sem indicação profissional.",
      "Não provoque vómito após possível intoxicação sem orientação veterinária.",
      "Não force alimento ou água em animal inconsciente, muito prostrado ou com trauma importante.",
      "Não publique morada residencial completa nem dados pessoais de terceiros ao pedir ajuda online.",
    ],
  },
  {
    title: "5. Documente e procure o tutor",
    items: [
      "Registe fotos, data, hora e localização aproximada do encontro.",
      "Anote características distintivas e coleira sem fazer diagnósticos públicos.",
      "Quando apropriado, procure uma clínica ou serviço habilitado para verificar microchip onde esse recurso estiver disponível.",
      "Guarde um ou dois detalhes não publicados para ajudar a confirmar a identidade de um possível tutor.",
    ],
  },
];

export default function First24HoursGuidePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="bg-petrol text-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Guia MyPets · primeiras 24 horas</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-black tracking-tight sm:text-5xl">Encontrei um animal na rua. E agora?</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">Um roteiro rápido para agir com mais segurança até conseguir ajuda adequada. Este conteúdo é educativo e não substitui avaliação veterinária.</p>
          </div>
        </section>

        <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-3xl border border-[#ffe0db] bg-[#fff0ee] p-5 sm:p-6">
            <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral" /><div><h2 className="font-black text-petrol">Se houver risco grave, procure ajuda profissional imediatamente.</h2><p className="mt-1 text-sm leading-6 text-ink/75">Dificuldade respiratória, hemorragia, atropelamento, inconsciência, convulsão, queimadura ou possível intoxicação justificam avaliação rápida. Não tente procedimentos complexos por conta própria.</p></div></div>
          </div>

          <div className="mt-8 grid gap-5">
            {sections.map((section) => (
              <section key={section.title} className="rounded-3xl border border-border bg-white p-6 sm:p-8">
                <h2 className="text-2xl font-black text-petrol">{section.title}</h2>
                <div className="mt-5 grid gap-3">
                  {section.items.map((item) => <p key={item} className="flex gap-3 text-sm leading-6 text-ink/78"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{item}</p>)}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-3xl border border-[#cfe8e6] bg-[#eef8f7] p-6 sm:p-8">
            <div className="flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#0d6e6b]" /><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#0d6e6b]">Como pedir ajuda</p><h2 className="mt-1 text-2xl font-black text-petrol">Contexto claro recebe respostas melhores.</h2><p className="mt-2 text-sm leading-6 text-ink/75">Informe cidade/bairro aproximado, espécie, condição observada, se o animal está contido e qual ajuda é necessária: transporte, consulta, lar temporário, alimentação ou outro apoio. Preserve dados pessoais e localização sensível.</p></div></div>
          </section>

          <section className="mt-8 grid gap-4 rounded-3xl bg-petrol p-6 text-white sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div><p className="text-xs font-black uppercase tracking-[0.14em] text-coral">Próxima ação</p><h2 className="mt-1 text-2xl font-black">Precisa organizar um pedido de apoio?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">O MyPets encaminha o pedido pelo tema correto para não misturar resgate, tratamento, abrigo e emergência.</p></div>
            <div className="flex flex-col gap-2"><Link href="/preciso-de-apoio" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-coral px-5 text-sm font-black text-white"><HeartHandshake className="h-4 w-4" /> Preciso de apoio</Link><Link href="/apoiar" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 text-sm font-black text-white">Quero apoiar <ArrowRight className="h-4 w-4" /></Link></div>
          </section>

          <p className="mt-8 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Guia educativo geral. Regras, serviços e canais oficiais variam por cidade e país; em situações urgentes, siga orientação veterinária e das autoridades locais.</p>
        </article>
      </main>
      <SiteFooter />
      <AuthDialog />
    </>
  );
}
