import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartHandshake, Megaphone, ShieldCheck, UsersRound } from "lucide-react";
import { CommunityCauseIntake } from "@/components/causes/community-cause-intake";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { apiGet } from "@/lib/api";

export const metadata: Metadata = {
  title: "Apresentar um projeto | MyPets",
  description: "Apresente ao MyPets um projeto, ONG, associação ou iniciativa comunitária dedicada à proteção e ao bem-estar animal.",
  alternates: { canonical: "/projetos/apresentar" },
};

type ConfigEnvelope = { data: { causeIntakeEnabled?: boolean } };

async function intakeIsLive() {
  try {
    const config = await apiGet<ConfigEnvelope>("/config");
    return config.data.causeIntakeEnabled === true;
  } catch {
    return false;
  }
}

const steps = [
  { title: "Apresente o projeto", text: "Conte quem atua, onde, que problema resolve e de que apoio precisa.", icon: UsersRound },
  { title: "Ganhe uma página pública", text: "A iniciativa entra no MyPets com URL própria e origem de captação preservada.", icon: Megaphone },
  { title: "Passe pela verificação", text: "A equipa valida responsável, evidências e condições para avançar.", icon: ShieldCheck },
  { title: "Ative apoio quando elegível", text: "A captação financeira só é habilitada depois das validações aplicáveis.", icon: BadgeCheck },
];

export default async function SubmitProjectPage() {
  const enabled = await intakeIsLive();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-cream pt-[72px]">
        <section className="relative overflow-hidden bg-petrol text-white">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,98,88,.2),transparent_30%),radial-gradient(circle_at_85%_66%,rgba(46,163,160,.16),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-black uppercase tracking-[.18em] text-coral">Projetos que merecem ser encontrados</p>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              O seu projeto ajuda animais? Apresente-o ao MyPets.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">
              ONG, associação, protetor, iniciativa comunitária ou projeto local: comece pela história e pelo impacto. A primeira etapa não exige conta bancária nem documentação financeira.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#formulario" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-coral px-6 text-sm font-black text-white transition hover:bg-coral-dark">
                Apresentar projeto agora <ArrowRight className="h-4 w-4" />
              </a>
              <Link href="/projetos" className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-black text-white transition hover:bg-white/10">
                Ver projetos MyPets
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {steps.map(({ title, text, icon: Icon }, index) => (
              <article key={title} className="rounded-2xl bg-sand/60 p-4">
                <Icon className="h-5 w-5 text-coral" />
                <p className="mt-3 text-sm font-black text-petrol">{index + 1} · {title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-white p-6 sm:p-7">
              <HeartHandshake className="h-6 w-6 text-coral" />
              <h2 className="mt-4 text-xl font-black text-petrol">O que procuramos</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Projetos reais de alimentação, resgate, tratamento, acolhimento, adoção e outras iniciativas com impacto animal verificável.
              </p>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-white p-6 sm:p-7">
              <ShieldCheck className="h-6 w-6 text-amber-700" />
              <h2 className="mt-4 text-xl font-black text-petrol">Projetos conduzidos por menores</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                O contacto da submissão deve ser de um responsável adulto. Não publique telefone, documento, endereço, escola ou outros dados pessoais de crianças e adolescentes.
              </p>
            </div>
          </div>

          <div id="formulario" className="scroll-mt-24">
            {enabled ? (
              <CommunityCauseIntake initialType="NGO_PROJECT" />
            ) : (
              <div className="rounded-3xl border border-amber-200 bg-white p-8 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-amber-700" />
                <h2 className="mt-4 text-2xl font-black text-petrol">O formulário está temporariamente indisponível.</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Mantemos o envio bloqueado quando a API não confirma a integração com a base de dados, para evitar perder submissões.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
