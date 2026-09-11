"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, HeartHandshake, PawPrint, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { growthDestination } from "@/lib/growth-navigation";

type GatewayPath = {
  icon: LucideIcon;
  title: string;
  text: string;
  href: string;
  campaign: string;
  ctaId: string;
  tone: "teal" | "coral" | "gold";
};

const paths: Record<"pt-PT" | "pt-BR" | "en", GatewayPath[]> = {
  "pt-PT": [
    { icon: PawPrint, title: "Pedir apoio", text: "É protetor, associação ou tutor numa situação urgente? Conte a sua história e encontre apoio.", href: "/join/protetor", campaign: "need_support", ctaId: "gateway_request_support", tone: "teal" },
    { icon: HeartHandshake, title: "Apoiar uma causa", text: "Escolha uma causa, acompanhe a evolução e ajude a transformar uma história real.", href: "/causas", campaign: "supporters", ctaId: "gateway_support", tone: "coral" },
    { icon: UsersRound, title: "Ser padrinho", text: "Acompanhe um animal ou causa e ofereça apoio continuado ao longo do tempo.", href: "/join/padrinho", campaign: "sponsors", ctaId: "gateway_sponsor", tone: "gold" },
  ],
  "pt-BR": [
    { icon: PawPrint, title: "Pedir apoio", text: "É protetor, ONG ou tutor em uma situação de emergência? Conte sua história e receba apoio.", href: "/join/protetor", campaign: "need_support", ctaId: "gateway_request_support", tone: "teal" },
    { icon: HeartHandshake, title: "Apoiar uma causa", text: "Escolha uma causa, acompanhe a evolução e ajude a transformar uma história real.", href: "/causas", campaign: "supporters", ctaId: "gateway_support", tone: "coral" },
    { icon: UsersRound, title: "Ser padrinho", text: "Acompanhe um animal ou causa e ofereça suporte contínuo ao longo do tempo.", href: "/join/padrinho", campaign: "sponsors", ctaId: "gateway_sponsor", tone: "gold" },
  ],
  en: [
    { icon: PawPrint, title: "Request support", text: "Are you a protector, NGO or pet guardian facing an urgent situation? Tell your story and find support.", href: "/join/protetor", campaign: "need_support", ctaId: "gateway_request_support", tone: "teal" },
    { icon: HeartHandshake, title: "Support a cause", text: "Choose a cause, follow its progress and help transform a real story.", href: "/causas", campaign: "supporters", ctaId: "gateway_support", tone: "coral" },
    { icon: UsersRound, title: "Become a sponsor", text: "Follow an animal or cause and provide ongoing support over time.", href: "/join/padrinho", campaign: "sponsors", ctaId: "gateway_sponsor", tone: "gold" },
  ],
};

const tones = {
  teal: { wrap: "bg-[#eef8f7] border-[#d5efec]", icon: "bg-[#0d6e6b] text-white", arrow: "bg-[#ccebea] text-[#0d6e6b]" },
  coral: { wrap: "bg-[#fff0ee] border-[#ffe0db]", icon: "bg-coral text-white", arrow: "bg-[#ffd4cf] text-coral-dark" },
  gold: { wrap: "bg-[#fff8ec] border-[#f5e8cf]", icon: "bg-[#c99546] text-white", arrow: "bg-[#f3ddb6] text-[#936923]" },
};

export function GrowthGateway() {
  const router = useRouter();
  const { locale } = useLocale();
  const items = paths[locale as keyof typeof paths] ?? paths["pt-BR"];

  return (
    <section id="como-ajudar" className="relative z-20 -mt-1 bg-white py-4 sm:py-5">
      <div className="mx-auto grid max-w-[1320px] gap-3 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((path, index) => {
          const Icon = path.icon;
          const tone = tones[path.tone];
          return (
            <motion.button
              key={path.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.42, delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => router.push(growthDestination(path.href, { campaign: path.campaign, cta: path.ctaId }))}
              className={`group flex min-h-[112px] items-center gap-4 rounded-2xl border p-4 text-left shadow-[0_8px_24px_-22px_rgba(16,32,42,0.35)] transition-shadow hover:shadow-[0_14px_30px_-20px_rgba(16,32,42,0.3)] ${tone.wrap}`}
            >
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-inner ring-4 ring-white/45 ${tone.icon}`}><Icon className="h-6 w-6" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[18px] font-black tracking-tight text-petrol">{path.title}</span><span className="mt-1 block text-[12px] font-medium leading-[1.45] text-ink/68">{path.text}</span></span>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${tone.arrow}`}><ArrowRight className="h-4 w-4" /></span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
