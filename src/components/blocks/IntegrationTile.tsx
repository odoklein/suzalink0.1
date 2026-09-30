import { cn } from "@/lib/cn";
import { Badge } from "../ui/Badge";

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
  className,
}: {
  name: string;
  line?: string;
  soon?: boolean;
  soonLabel: string;
  /** Name only, vertically centred (homepage grid). */
  compact?: boolean;
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

  return (
    <div className={cn("flex gap-3 rounded-[16px] bg-white p-4 ring-1 ring-line", compact ? "items-center" : "items-start", className)}>
      <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-surface font-sans text-sm font-bold text-ink-soft ring-1 ring-inset ring-line">
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
