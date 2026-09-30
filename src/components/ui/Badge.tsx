import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "soon" | "accent" | "success" | "neutral";

const tones: Record<Tone, string> = {
  soon: "bg-white text-muted ring-1 ring-inset ring-line-strong",
  accent: "bg-accent text-white",
  success: "bg-success-tint text-success-ink ring-1 ring-inset ring-success/20",
  neutral: "bg-surface text-ink-soft ring-1 ring-inset ring-line",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
        tones[tone],
        className,
      )}
    >
      {tone === "soon" ? <span aria-hidden className="size-1.5 rounded-full bg-accent/70" /> : null}
      {children}
    </span>
  );
}
