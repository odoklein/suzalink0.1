import { Check } from "lucide-react";
import { HUE, type Hue } from "@/config/hues";
import { dict, resolveTexts } from "@/content";
import type { Text } from "@/content/types";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { Badge } from "../ui/Badge";

/** Checked bullet list. Claim-dependent items are resolved (hidden, fallback or « Bientôt »). */
export async function Bullets({ items, className, columns, hue = "accent" }: { items: Text[]; className?: string; columns?: boolean; hue?: Hue }) {
  const { ui } = await dict();
  const h = HUE[hue];
  return (
    <ul className={cn(columns ? "grid gap-x-8 gap-y-5 md:grid-cols-3" : "space-y-3", className)}>
      {resolveTexts(items).map((item, i) => (
        <li
          key={item.text}
          data-reveal
          style={vars({ "--i": i })}
          className={cn("flex gap-3", columns && "border-t border-line pt-4 md:pt-5")}
        >
          <span className={cn("mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", h.soft, h.text, h.ring)}>
            <Check aria-hidden className="size-3.5" strokeWidth={2.75} />
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
