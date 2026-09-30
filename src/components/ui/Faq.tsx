import { Plus } from "lucide-react";
import { resolveText, visibleItems } from "@/content";
import type { Faq as FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";
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

/** Native <details> accordion: accessible and works without JavaScript. */
export function Faq({ items, schema = true, className }: { items: FaqItem[]; schema?: boolean; className?: string }) {
  const resolved = resolveFaq(items);
  return (
    <div className={cn("space-y-2", className)}>
      {resolved.map((item) => (
        <details
          key={item.q}
          className="group rounded-[16px] bg-white ring-1 ring-line transition-shadow duration-200 open:shadow-[var(--shadow-card)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[16px] px-5 py-4 text-left text-base font-medium text-ink md:px-6 md:text-[17px]">
            {item.q}
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[8px] bg-accent-tint text-accent transition-transform duration-200 group-open:rotate-45">
              <Plus aria-hidden className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl px-5 pb-5 pr-14 text-[15px] leading-6 text-muted md:px-6">{item.a}</p>
        </details>
      ))}
      {schema ? <JsonLd data={faqSchema(resolved)} /> : null}
    </div>
  );
}
