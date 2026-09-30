import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** A keyboard key cap. */
export function Key({ children, animated, className }: { children: string; animated?: boolean; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-10 select-none items-center justify-center rounded-[10px] bg-white px-2.5 font-sans text-lg font-bold leading-10 text-ink ring-1 ring-line-strong",
        "shadow-[0_3px_0_var(--color-line-strong),0_6px_16px_-6px_rgb(11_18_32/0.2)]",
        animated && "animate-key-press",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * The hero chip: a key press logs an outcome in one keystroke. The toast is
 * decorative; the sentence next to it carries the meaning for screen readers.
 */
export function KeyChip({ keyLabel, label, sub, className }: { keyLabel: string; label: string; sub: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-4 shadow-[var(--shadow-lift)] ring-1 ring-line backdrop-blur",
        className,
      )}
    >
      <Key animated>{keyLabel}</Key>
      <div className="relative min-w-40">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-success text-white">
            <Check aria-hidden className="size-3" strokeWidth={3} />
          </span>
          {label}
        </p>
        <p className="animate-toast text-xs text-muted">{sub}</p>
      </div>
    </div>
  );
}
