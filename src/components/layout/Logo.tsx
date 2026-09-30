import { cn } from "@/lib/cn";

/**
 * Placeholder mark until the brand kit's logo SVG is shared: a line linking
 * two points, the « fil Suzalink ». Swap this file only.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cn("size-7", className)} aria-hidden focusable="false">
      <rect width="28" height="28" rx="8" fill="var(--color-accent)" />
      <path d="M7.5 17.5c2.2-7 6.4-7.6 6.5-3.5.1 4.1 4.3 3.6 6.5-3.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="7.5" cy="17.5" r="2" fill="#fff" />
      <circle cx="20.5" cy="10.5" r="2" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-sans text-[19px] font-bold tracking-[-0.02em] text-ink">Suzalink</span>
    </span>
  );
}
