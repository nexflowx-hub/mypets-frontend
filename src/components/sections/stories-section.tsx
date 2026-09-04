"use client";

import Image from "next/image";
import { ArrowRight, Flag, BadgeCheck, RefreshCw, Eye, ShieldAlert } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { StoryDTO } from "@/lib/types";
import { useDonateStore } from "@/lib/stores";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

function StoryCard({ story, index }: { story: StoryDTO; index: number }) {
  const { dict, money, locale } = useLocale();
  const openDonate = useDonateStore((s) => s.openDonate);
  const [reported, setReported] = useState(false);

  const description =
    locale === "pt-BR" ? story.descPtBR : locale === "en" ? story.descEn : story.descPtPT;

  const ctaLabel = dict.stories.support.replace("{name}", story.name);
  const kindTarget = story.kind === "ANIMAL" ? "ANIMAL" : "PROTECTOR";

  const report = async () => {
    if (reported) return;
    try {
      await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: `Report from story card: ${story.slug}`,
          entityUrl: `/historias/${story.slug}`,
        }),
      });
      setReported(true);
    } catch {
      /* silent — report is a side channel */
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-white shadow-[0_1px_2px_rgba(16,32,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_38px_-20px_rgba(16,32,42,0.3)]">
      <div className="relative aspect-[4/2.9] overflow-hidden bg-sand">
        <Image
          src={story.image}
          alt={story.imageAlt}
          fill
          sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw"
          loading={index < 2 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <button
          onClick={report}
          title={reported ? "✓" : dict.stories.report}
          aria-label={dict.stories.report}
          className={cn(
            "absolute right-2.5 top-2.5 rounded-full p-2 backdrop-blur-sm transition-all focus-visible:outline-2 focus-visible:outline-coral",
            reported
              ? "bg-emerald-600/85 text-white"
              : "bg-black/35 text-white/90 opacity-0 hover:bg-black/55 focus-visible:opacity-100 group-hover:opacity-100"
          )}
        >
          <Flag className="h-3.5 w-3.5" aria-hidden />
        </button>
        {story.isDemo && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            {dict.stories.demo}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15.5px] font-extrabold tracking-tight text-petrol">
          {story.name}
          {story.location && <span className="font-semibold text-muted-foreground"> • {story.location}</span>}
        </h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {story.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sand px-2.5 py-1 text-[10.5px] font-bold text-ink/70"
            >
              {dict.tags[tag] ?? tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-2 text-[12px]">
            <span className="font-extrabold text-petrol">
              {money(story.raisedCents, story.currency)}{" "}
              <span className="font-medium text-muted-foreground">
                {dict.stories.of} {money(story.targetCents, story.currency)}
              </span>
            </span>
            <span className="font-bold text-coral">{story.progress}%</span>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sand"
            role="progressbar"
            aria-valuenow={story.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${ctaLabel}: ${story.progress}%`}
          >
            <div
              className="h-full rounded-full bg-coral transition-[width] duration-700"
              style={{ width: `${story.progress}%` }}
            />
          </div>

          <Button
            onClick={() =>
              openDonate({ type: kindTarget, storyId: story.id, label: story.name })
            }
            className="mt-4 h-10 w-full rounded-md bg-coral text-[13.5px] font-bold text-white hover:bg-coral-dark"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

/** Trust transparency strip (verify / updates / clear needs / moderation) */
function TrustStrip() {
  const { dict } = useLocale();
  const items = [
    { icon: BadgeCheck, label: dict.trust.verified },
    { icon: RefreshCw, label: dict.trust.updates },
    { icon: Eye, label: dict.trust.clearNeeds },
    { icon: ShieldAlert, label: dict.trust.moderation },
  ];
  return (
    <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Trust">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-[12.5px] font-semibold text-ink/60">
          <item.icon className="h-4 w-4 text-coral" aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export function StoriesSection({ stories }: { stories: StoryDTO[] }) {
  const { dict } = useLocale();

  return (
    <section id="historias" className="bg-cream pb-16 pt-4 lg:pb-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="max-w-md text-balance text-[24px] font-extrabold leading-[1.15] tracking-tight text-petrol sm:text-[28px]">
            {dict.stories.title}
          </h2>
          <button
            onClick={() => document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-1.5 text-[13.5px] font-bold text-coral transition-colors hover:text-coral-dark focus-visible:outline-2 focus-visible:outline-coral"
          >
            {dict.stories.viewAll}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </button>
        </div>

        {stories.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-white p-12 text-center">
            <p className="text-[15px] font-semibold text-muted-foreground">{dict.stories.empty}</p>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stories.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} />
            ))}
          </div>
        )}

        <TrustStrip />
      </div>
    </section>
  );
}
