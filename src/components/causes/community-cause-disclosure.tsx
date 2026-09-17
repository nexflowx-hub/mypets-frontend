import { ExternalLink, Instagram, Facebook, MessageCircle, ShieldAlert } from "lucide-react";

export type SubmittedSocialLink = { platform: string; url: string };

function label(platform: string) {
  if (platform === "INSTAGRAM") return "Instagram";
  if (platform === "FACEBOOK") return "Facebook";
  if (platform === "TIKTOK") return "TikTok";
  return platform;
}

function Icon({ platform }: { platform: string }) {
  if (platform === "INSTAGRAM") return <Instagram className="h-4 w-4" />;
  if (platform === "FACEBOOK") return <Facebook className="h-4 w-4" />;
  return <ExternalLink className="h-4 w-4" />;
}

export function CommunityCauseDisclosure({ socialLinks, publicWhatsapp }: { socialLinks: SubmittedSocialLink[]; publicWhatsapp: string | null }) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800"><ShieldAlert className="h-5 w-5" /></span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-800">Enviada pela comunidade</p>
          <h2 className="mt-1 text-xl font-black text-petrol">Esta causa ainda não foi verificada pelo MyPets.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-950/75">O conteúdo foi fornecido pelo responsável indicado na submissão. O MyPets ainda não confirmou identidade, documentos, necessidade financeira ou titularidade das redes apresentadas. Por isso, a captação financeira através da plataforma está desativada.</p>
        </div>
      </div>

      {(socialLinks.length > 0 || publicWhatsapp) && (
        <div className="mt-5 border-t border-amber-200 pt-5">
          <p className="text-xs font-black uppercase tracking-wide text-amber-900/60">Contactos e redes informados na submissão</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.map((item) => <a key={`${item.platform}-${item.url}`} href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-amber-300 bg-white/70 px-4 text-xs font-bold text-petrol hover:border-coral/50 hover:text-coral"><Icon platform={item.platform} />{label(item.platform)}<ExternalLink className="h-3 w-3" /></a>)}
            {publicWhatsapp && <a href={`https://wa.me/${publicWhatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-amber-300 bg-white/70 px-4 text-xs font-bold text-petrol hover:border-coral/50 hover:text-coral"><MessageCircle className="h-4 w-4" />WhatsApp informado pelo responsável</a>}
          </div>
        </div>
      )}
    </section>
  );
}