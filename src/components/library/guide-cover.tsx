import Image from "next/image";
import {
  Baby,
  BookOpen,
  Brain,
  Building2,
  Footprints,
  Heart,
  HeartHandshake,
  Home,
  MessageCircle,
  PawPrint,
  Search,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";
import { MyPetsRoundSeal } from "@/components/brand/round-seal";
import { cn } from "@/lib/utils";

const coverThemes = {
  "cuidados-essenciais": { kicker: "Rotina · segurança · bem-estar", icon: Heart, wash: "from-[#0d3c36]/92 via-[#0d3c36]/66 to-[#e4b75e]/16" },
  "primeiros-30-dias": { kicker: "Filhote · adaptação · primeiros passos", icon: Baby, wash: "from-[#17364e]/92 via-[#17364e]/62 to-[#f2c16b]/18" },
  "treino-gentil": { kicker: "Treino · cooperação · vida real", icon: Sparkles, wash: "from-[#26351d]/92 via-[#26351d]/62 to-[#b9d77a]/18" },
  "guia-das-racas": { kicker: "Atlas 64 · escolha responsável", icon: Search, wash: "from-[#38284f]/92 via-[#38284f]/62 to-[#e0b7f5]/18" },
  "alimentacao-bem-estar": { kicker: "Alimentação · corpo · rotina", icon: Utensils, wash: "from-[#5a321f]/92 via-[#5a321f]/62 to-[#f0b870]/18" },
  "linguagem-corporal-canina": { kicker: "Comunicação · sinais · distância", icon: MessageCircle, wash: "from-[#203f4a]/92 via-[#203f4a]/62 to-[#74c6c9]/18" },
  "passeios-sem-stress": { kicker: "Passeio · farejo · guia frouxa", icon: Footprints, wash: "from-[#21432d]/92 via-[#21432d]/62 to-[#8fd5a8]/18" },
  "ficar-sozinho": { kicker: "Autonomia · calma · progressão", icon: Home, wash: "from-[#34313e]/92 via-[#34313e]/62 to-[#c8b5d5]/18" },
  "cao-em-apartamento": { kicker: "Vida urbana · ruído · rotina", icon: Building2, wash: "from-[#25384a]/92 via-[#25384a]/62 to-[#a9c7de]/18" },
  "higiene-saude-oral": { kicker: "Higiene · dentes · cooperação", icon: ShieldCheck, wash: "from-[#23433e]/92 via-[#23433e]/62 to-[#b5e1d5]/18" },
  "adotei-cao-adulto": { kicker: "Adoção · confiança · novo começo", icon: HeartHandshake, wash: "from-[#4b3027]/92 via-[#4b3027]/62 to-[#ebb38f]/18" },
  "caes-e-criancas": { kicker: "Família · supervisão · respeito", icon: Users, wash: "from-[#493846]/92 via-[#493846]/62 to-[#f1c3d8]/18" },
  "50-ideias-enriquecimento": { kicker: "Brincadeiras · farejo · cérebro", icon: Brain, wash: "from-[#27401f]/92 via-[#27401f]/62 to-[#d3d66f]/18" },
} as const;

export function GuideCover({
  slug,
  title,
  image,
  className,
  compact = false,
}: {
  slug: string;
  title: string;
  image: string;
  className?: string;
  compact?: boolean;
}) {
  const theme = coverThemes[slug as keyof typeof coverThemes] ?? {
    kicker: "Coleção MyPets — Cuidar Melhor",
    icon: BookOpen,
    wash: "from-petrol/95 via-petrol/65 to-emerald-300/10",
  };
  const Icon = theme.icon;

  return (
    <div className={cn("relative overflow-hidden bg-petrol", className)}>
      <Image
        src={image}
        alt=""
        fill
        sizes={compact ? "(min-width:1280px) 25vw, 50vw" : "(min-width:1024px) 430px, 100vw"}
        className="object-cover scale-[1.02]"
      />
      <div className={cn("absolute inset-0 bg-gradient-to-br", theme.wash)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.18),transparent_24%)]" />

      <div className={cn("absolute inset-0 flex flex-col justify-between", compact ? "p-4" : "p-6 sm:p-7")}>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/18 px-3 py-1.5 text-[9px] font-black uppercase tracking-[.14em] text-white/88 backdrop-blur-sm">
            <Icon className="h-3.5 w-3.5 text-emerald-200" />
            Coleção MyPets
          </span>
          <MyPetsRoundSeal className={compact ? "h-12 w-12" : "h-16 w-16"} />
        </div>

        <div className={compact ? "pr-2" : "max-w-[88%]"}>
          <p className="text-[9px] font-black uppercase tracking-[.15em] text-emerald-200">{theme.kicker}</p>
          <h3 className={cn(
            "mt-2 text-balance font-black leading-[1.02] tracking-[-.025em] text-white drop-shadow-sm",
            compact ? "text-xl" : "text-3xl sm:text-4xl",
          )}>
            {title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-white/65">
            <PawPrint className="h-3.5 w-3.5 text-emerald-200" />
            Cuidar melhor · impacto real
          </div>
        </div>
      </div>
    </div>
  );
}
