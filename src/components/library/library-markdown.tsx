"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import type { GuideHeading } from "@/lib/digital-library";

function headingId(text: string) {
  return text.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\\s-]/g, "").trim().replace(/\\s+/g, "-").replace(/-+/g, "-");
}

function textFromChildren(children: React.ReactNode) {
  return React.Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
    .join("");
}

export function LibraryMarkdown({
  markdown,
  headings = [],
  progressKey,
}: {
  markdown: string;
  headings?: GuideHeading[];
  progressKey?: string;
}) {
  const [completed, setCompleted] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!progressKey) return;
    try {
      const value = window.localStorage.getItem(progressKey);
      if (value) setCompleted(JSON.parse(value));
    } catch {
      // Local fallback only; failure must never block reading.
    }
  }, [progressKey]);

  function toggle(id: string) {
    if (!progressKey) return;
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      try {
        window.localStorage.setItem(progressKey, JSON.stringify(next));
      } catch {
        // Local fallback only.
      }
      return next;
    });
  }

  const progress = headings.length ? Math.round((completed.length / headings.length) * 100) : 0;

  return (
    <div>
      {progressKey && headings.length > 0 && (
        <div className="sticky top-0 z-30 -mx-4 mb-8 border-b border-border/70 bg-[#f8f6ef]/95 px-4 py-3 backdrop-blur print:hidden sm:-mx-6 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-petrol/10">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: progress + "%" }} />
            </div>
            <span className="text-[11px] font-black tabular-nums text-petrol/60">{progress}%</span>
          </div>
        </div>
      )}

      <div className="library-prose">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="mb-6 mt-2 text-4xl font-black leading-tight tracking-tight text-petrol sm:text-5xl">
                {children}
              </h1>
            ),
            h2: ({ children }) => {
              const text = textFromChildren(children);
              const id = headingId(text);
              const isDone = completed.includes(id);
              return (
                <div className="group mt-14 flex scroll-mt-28 items-start gap-3" id={id}>
                  <h2 className="min-w-0 flex-1 text-2xl font-black leading-tight text-petrol sm:text-3xl">{children}</h2>
                  {progressKey && (
                    <button
                      type="button"
                      onClick={() => toggle(id)}
                      aria-label={isDone ? "Marcar seção como não concluída" : "Marcar seção como concluída"}
                      className="mt-0.5 rounded-full p-1 text-emerald-600 transition hover:bg-emerald-50 print:hidden"
                    >
                      {isDone ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 text-petrol/20" />}
                    </button>
                  )}
                </div>
              );
            },
            h3: ({ children }) => {
              const text = textFromChildren(children);
              return <h3 id={headingId(text)} className="mt-9 scroll-mt-28 text-xl font-black text-petrol">{children}</h3>;
            },
            p: ({ children }) => <p className="mt-4 text-[15px] leading-7 text-petrol/78 sm:text-base sm:leading-8">{children}</p>,
            ul: ({ children }) => <ul className="mt-4 space-y-2 pl-5 text-[15px] leading-7 text-petrol/78 marker:text-emerald-500 sm:text-base">{children}</ul>,
            ol: ({ children }) => <ol className="mt-4 space-y-2 pl-5 text-[15px] leading-7 text-petrol/78 marker:font-black marker:text-emerald-700 sm:text-base">{children}</ol>,
            li: ({ children }) => <li className="pl-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="my-7 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold leading-7 text-emerald-950/80">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="my-7 overflow-x-auto rounded-2xl border border-border bg-white">
                <table className="w-full min-w-[580px] border-collapse text-left text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => <th className="border-b border-border bg-petrol/[.04] px-4 py-3 font-black text-petrol">{children}</th>,
            td: ({ children }) => <td className="border-b border-border/70 px-4 py-3 align-top leading-6 text-petrol/75">{children}</td>,
            hr: () => <hr className="my-10 border-border" />,
            a: ({ href, children }) => (
              <a
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noreferrer" : undefined}
                className="font-bold text-emerald-700 underline underline-offset-4"
              >
                {children}{href?.startsWith("http") && <ExternalLink className="ml-1 inline h-3 w-3" />}
              </a>
            ),
            strong: ({ children }) => <strong className="font-black text-petrol">{children}</strong>,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
