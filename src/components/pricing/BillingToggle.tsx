"use client";

import type { Billing } from "@/config/pricing.config";
import { cn } from "@/lib/cn";

export function BillingToggle({
  value,
  onChange,
  labels,
  className,
}: {
  value: Billing;
  onChange: (b: Billing) => void;
  labels: { monthly: string; annual: string; discount: string; group: string };
  className?: string;
}) {
  const option = (b: Billing, label: string, extra?: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={value === b}
      onClick={() => onChange(b)}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-[10px] px-4 text-[15px] font-medium transition-colors duration-200",
        value === b ? "bg-white text-ink shadow-[0_1px_2px_rgb(11_18_32/0.1)] ring-1 ring-line" : "text-muted hover:text-ink",
      )}
    >
      {label}
      {extra ? (
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", value === b ? "bg-accent text-white" : "bg-accent-tint text-accent")}>
          {extra}
        </span>
      ) : null}
    </button>
  );

  return (
    <div role="radiogroup" aria-label={labels.group} className={cn("inline-flex rounded-[14px] bg-surface p-1 ring-1 ring-inset ring-line", className)}>
      {option("monthly", labels.monthly)}
      {option("annual", labels.annual, labels.discount)}
    </div>
  );
}
