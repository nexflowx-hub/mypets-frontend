"use client";

import { motion } from "framer-motion";
import { ArrowRight, HandHeart, HeartHandshake, Megaphone, PawPrint, ShieldCheck, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { growthDestination } from "@/lib/growth-navigation";

const copy = {
  "pt-PT": {
    eyebrow: "Comece pelo que precisa agora",
    title: "Um caminho simples para pedir ajuda, apoiar ou participar.",
    text: "O MyPets adapta o onboarding à sua intenção. Não precisa preencher tudo antes de começar.",
    paths: [
      {
        icon: PawPrint,
        kicker: "Preciso de apoio",
        title: "Ajudo animais e preciso de ajuda",
        text: "Crie o seu perfil, registe animais, necessidades ou apresente um projeto.",
        cta: "Pedir apoio",
        href: "/join/protetor",
        campaign: "need_support",
        ctaId: "gateway_request_support",
        links: [
          ["Sou protetor", "/join/protetor"],
          ["Tenho um projeto", "/join/projeto"],
          ["Encontrei um animal", "/join/encontrei-um-animal"],
        ],
      },
      {
        icon: HeartHandshake,
        kicker: "Quero apoiar",
        title: "Quero transformar uma história",
        text: "Descubra causas, acompanhe um animal, torne-se padrinho ou manifeste intenção de apoiar.",
        cta: "Quero ajudar",
        href: "/join/ajudar",
        campaign: "supporters",
        ctaId: "gateway_support",
        links: [
          ["Ser padrinho", "/join/padrinho"],
          ["Ser doador", "/join/doador"],
          ["Ver causas", "/causas"],
        ],
      },
      {
        icon: UsersRound,
        kicker: "Quero participar",
        title: "Tempo, alcance e presença também salvam",
        text: "Ajude como voluntário, adotante, divulgador ou membro da comunidade MyPets.",
        cta: "Participar",
        href: "/join/voluntario",
        campaign: "participation",
        ctaId: "gateway_participate",
        links: [
          ["Voluntariado", "/join/voluntario"],
          ["Adotar", "/join/adotar"],
          ["Divulgar", "/join/ajudar"],
        ],
      },
    ],
    trust: ["Onboarding rápido", "Perfis e causas ligados", "Partilha com atribuição"],
  },
  "pt-BR": {
    eyebrow: "Comece pelo que você precisa agora",
    title: "Um caminho simples para pedir ajuda, apoiar ou participar.",
    text: "O MyPets adapta o onboarding à sua intenção. Você não precisa preencher tudo antes de começar.",
    paths: [
      { icon: PawPrint, kicker: "Preciso de apoio", title: "Ajudo animais e preciso de ajuda", text: "Crie seu perfil, registre animais, necessidades ou apresente um projeto.", cta: "Pedir apoio", href: "/join/protetor", campaign: "need_support", ctaId: "gateway_request_support", links: [["Sou protetor", "/join/protetor"], ["Tenho um projeto", "/join/projeto"], ["Encontrei um animal", "/join/encontrei-um-animal"]] },
      { icon: HeartHandshake, kicker: "Quero apoiar", title: "Quero transformar uma história", text: "Descubra causas, acompanhe um animal, torne-se padrinho ou manifeste intenção de apoiar.", cta: "Quero ajudar", href: "/join/ajudar", campaign: "supporters", ctaId: "gateway_support", links: [["Ser padrinho", "/join/padrinho"], ["Ser doador", "/join/doador"], ["Ver causas", "/causas"]] },
      { icon: UsersRound, kicker: "Quero participar", title: "Tempo, alcance e presença também salvam", text: "Ajude como voluntário, adotante, divulgador ou membro da comunidade MyPets.", cta: "Participar", href: "/join/voluntario", campaign: "participation", ctaId: "gateway_participate", links: [["Voluntariado", "/join/voluntario"], ["Adotar", "/join/adotar"], ["Divulgar", "/join/ajudar"]] },
    ],
    trust: ["Onboarding rápido", "Perfis e causas conectados", "Compartilhamento com atribuição"],
  },
  en: {
    eyebrow: "Start with what you need now",
    title: "A simple path to ask for help, support or take part.",
    text: "MyPets adapts onboarding to your intent. You do not need to complete everything before getting started.",
    paths: [
      { icon: PawPrint, kicker: "I need support", title: "I help animals and need help", text: "Create your profile, register animals, needs or submit a project.", cta: "Request support", href: "/join/protetor", campaign: "need_support", ctaId: "gateway_request_support", links: [["I am a protector", "/join/protetor"], ["I run a project", "/join/projeto"], ["I found an animal", "/join/encontrei-um-animal"]] },
      { icon: HeartHandshake, kicker: "I want to support", title: "I want to change a story", text: "Discover causes, follow an animal, become a sponsor or show your intent to help.", cta: "I want to help", href: "/join/ajudar", campaign: "supporters", ctaId: "gateway_support", links: [["Become a sponsor", "/join/padrinho"], ["Become a donor", "/join/doador"], ["View causes", "/causas"]] },
      { icon: UsersRound, kicker: "I want to participate", title: "Time, reach and presence save lives too", text: "Help as a volunteer, adopter, advocate or member of the MyPets community.", cta: "Take part", href: "/join/voluntario", campaign: "participation", ctaId: "gateway_participate", links: [["Volunteer", "/join/voluntario"], ["Adopt", "/join/adotar"], ["Share", "/join/ajudar"]] },
    ],
    trust: ["Fast onboarding", "Connected profiles and causes", "Attributed sharing"],
  },
} as const;

export function GrowthGateway() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = copy[locale as keyof typeof copy] ?? copy["pt-PT"];

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-white py-14 sm:py-16 lg:py-20">
      <div aria-hidden className="absolute left-1/2 top-0 h-52 w-[80%] -translate-x-1/2 rounded-full bg-coral/5 blur-3xl" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-coral">{t.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-petrol sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">{t.text}</p>
        </motion.div>

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {t.paths.map((path, index) => {
            const Icon = path.icon;
            return (
              <motion.article key={path.kicker} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -5 }} className="group relative overflow-hidden rounded-3xl border border-border/80 bg-cream p-6 shadow-[0_14px_34px_-28px_rgba(16,32,42,0.35)] transition-shadow hover:shadow-[0_22px_48px_-28px_rgba(16,32,42,0.42)] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-soft text-coral"><Icon className="h-5 w-5" /></span>
                  <span className="rounded-full border border-border bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">{path.kicker}</span>
                </div>
                <h3 className="mt-6 max-w-sm text-[22px] font-extrabold leading-tight tracking-tight text-petrol">{path.title}</h3>
                <p className="mt-3 min-h-[66px] text-sm leading-6 text-muted-foreground">{path.text}</p>

                <button onClick={() => router.push(growthDestination(path.href, { campaign: path.campaign, cta: path.ctaId }))} className="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-petrol px-4 text-sm font-extrabold text-white transition-colors hover:bg-petrol-light focus-visible:outline-2 focus-visible:outline-coral">
                  {path.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="mt-4 flex flex-wrap gap-2">
                  {path.links.map(([label, href], chipIndex) => (
                    <button key={label} onClick={() => router.push(growthDestination(href, { campaign: path.campaign, cta: `${path.ctaId}_chip_${chipIndex + 1}` }))} className="rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-bold text-ink/70 transition hover:border-coral/40 hover:text-coral">
                      {label}
                    </button>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-xs font-semibold text-ink/55">
          {t.trust.map((item, index) => {
            const Icon = index === 0 ? HandHeart : index === 1 ? ShieldCheck : Megaphone;
            return <span key={item} className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-coral" />{item}</span>;
          })}
        </motion.div>
      </div>
    </section>
  );
}
