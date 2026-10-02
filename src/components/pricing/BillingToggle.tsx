"use client";

import type { Billing } from "@/config/pricing.config";
import { cn } from "@/lib/cn";

/** Monthly / annual switch: a dark pill slides (with a little spring) under the chosen option. */
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
        "relative z-10 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-medium transition-colors duration-300",
        value === b ? "text-white" : "text-muted hover:text-ink",
      )}
    >
      {label}
      {extra ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold transition-colors duration-300",
            value === b ? "bg-mint text-white" : "bg-mint-soft text-mint-ink",
          )}
        >
          {extra}
        </span>
      ) : null}
    </button>
  );

  return (
    <div
      role="radiogroup"
      aria-label={labels.group}
      className={cn("relative inline-grid grid-cols-2 rounded-full bg-white/80 p-1 shadow-[0_1px_2px_rgb(11_18_32/0.05),0_8px_24px_-12px_rgb(11_18_32/0.18)] ring-1 ring-line backdrop-blur", className)}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_6px_16px_-6px_rgb(11_18_32/0.6)] transition-transform duration-500 ease-spring"
        style={{ transform: value === "annual" ? "translateX(100%)" : "translateX(0)" }}
      />
      {option("monthly", labels.monthly)}
      {option("annual", labels.annual, labels.discount)}
    </div>
  );
}
