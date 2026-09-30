import { Check } from "lucide-react";
import { dict, resolveTexts } from "@/content";
import type { Text } from "@/content/types";
import { cn } from "@/lib/cn";
import { Badge } from "../ui/Badge";

/** Checked bullet list. Claim-dependent items are resolved (hidden, fallback or « Bientôt »). */
export async function Bullets({ items, className, columns }: { items: Text[]; className?: string; columns?: boolean }) {
  const { ui } = await dict();
  return (
    <ul className={cn(columns ? "grid gap-x-8 gap-y-3 md:grid-cols-3" : "space-y-3", className)}>
      {resolveTexts(items).map((item) => (
        <li key={item.text} className="flex gap-3">
          <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent">
            <Check aria-hidden className="size-3.5" strokeWidth={2.5} />
          </span>
          <span className="text-ink-soft">
            {item.text}
            {item.soon ? (
              <Badge tone="soon" className="ml-2 align-middle">
                {ui.badges.soon}
              </Badge>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
