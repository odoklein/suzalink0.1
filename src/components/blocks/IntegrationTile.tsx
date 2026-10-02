import { HUE, hueVar, type Hue } from "@/config/hues";
import type { IntegrationCategory } from "@/content/fr/integrations";
import { cn } from "@/lib/cn";
import { Badge } from "../ui/Badge";

/** Each category of tool keeps one hue from the sky palette, on its monogram. */
export const CATEGORY_HUE: Record<IntegrationCategory, Hue> = {
  messagerie: "azure",
  agenda: "mint",
  telephonie: "coral",
  crm: "sun",
  donnees: "violet",
  reunions: "rose",
  finance: "mint",
  fichiers: "accent",
};

/**
 * Name tile until official logo files are added (each brand's usage rules
 * apply). A monogram keeps the grid readable without borrowing any artwork.
 */
export function IntegrationTile({
  name,
  line,
  soon,
  soonLabel,
  compact,
  hue = "accent",
  className,
}: {
  name: string;
  line?: string;
  soon?: boolean;
  soonLabel: string;
  /** Name only, vertically centred (homepage grid). */
  compact?: boolean;
  hue?: Hue;
  className?: string;
}) {
  const monogram = name
    .replace(/[^A-Za-zÀ-ÿ0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const h = HUE[hue];

  return (
    <div
      data-spotlight
      className={cn(
        "group flex gap-3 rounded-[16px] bg-white p-4 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line transition-[box-shadow,translate] duration-300 ease-out-quint hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        compact ? "items-center p-3" : "items-start",
        className,
      )}
      style={hueVar(hue)}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-[11px] font-sans text-sm font-bold ring-1 ring-inset transition-transform duration-300 ease-spring group-hover:scale-110",
          h.soft,
          h.ink,
          h.ring,
        )}
      >
        {monogram}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-semibold leading-6 text-ink">
          {name}
          {soon ? <Badge tone="soon">{soonLabel}</Badge> : null}
        </p>
        {line ? <p className="mt-1 text-sm leading-5 text-muted">{line}</p> : null}
      </div>
    </div>
  );
}
