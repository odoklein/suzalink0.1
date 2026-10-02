import { Plus } from "lucide-react";
import { resolveText, visibleItems } from "@/content";
import type { Faq as FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { JsonLd } from "./JsonLd";

export type ResolvedFaq = { q: string; a: string };

/** Drops entries whose claim is hidden and resolves claim-dependent answers. */
export function resolveFaq(items: FaqItem[]): ResolvedFaq[] {
  return visibleItems(items).flatMap((item) => {
    const answer = resolveText(item.a);
    // An answer about something not shipped yet is left out rather than badged.
    return answer && !answer.soon && !item.soon ? [{ q: item.q, a: answer.text }] : [];
  });
}

export function faqSchema(items: ResolvedFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * Native <details> accordion: accessible and works without JavaScript. Where
 * the browser can animate to `auto`, answers slide open (`.faq-item` in globals.css).
 */
export function Faq({ items, schema = true, className }: { items: FaqItem[]; schema?: boolean; className?: string }) {
  const resolved = resolveFaq(items);
  return (
    <div className={cn("space-y-3", className)}>
      {resolved.map((item, i) => (
        <details
          key={item.q}
          data-reveal
          style={vars({ "--i": Math.min(i, 4) })}
          className="faq-item group rounded-[20px] bg-white ring-1 ring-line transition-[box-shadow] duration-300 open:shadow-[var(--shadow-card)] open:ring-accent/25 hover:ring-line-strong"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[20px] px-5 py-4 text-left text-base font-medium text-ink md:px-6 md:py-5 md:text-[17px]">
            <span className="flex items-baseline gap-3">
              <span aria-hidden className="num w-6 shrink-0 text-sm font-semibold text-ink/30 transition-colors duration-300 group-open:text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.q}
            </span>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent transition-[rotate,background-color,color] duration-300 ease-spring group-open:rotate-45 group-open:bg-accent group-open:text-white">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl px-5 pb-6 pr-14 text-[15px] leading-6 text-muted md:px-6 md:pl-[3.75rem]">{item.a}</p>
        </details>
      ))}
      {schema ? <JsonLd data={faqSchema(resolved)} /> : null}
    </div>
  );
}
