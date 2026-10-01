import { cn } from "@/lib/cn";
import { LOGO_VIEWBOX, SYMBOL, SYMBOL_VIEWBOX, WORDMARK } from "./logoPaths";

/**
 * The Suzalink logo: « le fil », one line folded into an S that ends in two
 * dots, and the "suzalink" wordmark. Vector source files live in public/brand.
 * Decorative here: the links around it carry the accessible name.
 */

type Tone = "color" | "white";

function SymbolShape({ color }: { color: string }) {
  return (
    <g transform={`translate(${SYMBOL.offset.x} ${SYMBOL.offset.y})`}>
      <path d={SYMBOL.d} fill="none" stroke={color} strokeWidth={SYMBOL.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      {SYMBOL.dots.map((dot) => (
        <circle key={dot.cx} cx={dot.cx} cy={dot.cy} r={SYMBOL.dotRadius} fill={color} />
      ))}
    </g>
  );
}

/** The symbol alone, e.g. for tight spaces. */
export function LogoMark({ className, tone = "color" }: { className?: string; tone?: Tone }) {
  return (
    <svg viewBox={SYMBOL_VIEWBOX} className={cn("h-7 w-auto", className)} aria-hidden focusable="false">
      <SymbolShape color={tone === "white" ? "#fff" : "var(--color-accent)"} />
    </svg>
  );
}

/** Symbol and wordmark. Height comes from `className` (28 px by default). */
export function Logo({ className, tone = "color" }: { className?: string; tone?: Tone }) {
  const accent = tone === "white" ? "#fff" : "var(--color-accent)";
  const ink = tone === "white" ? "#fff" : "var(--color-ink)";
  return (
    <svg viewBox={LOGO_VIEWBOX} className={cn("h-7 w-auto", className)} aria-hidden focusable="false">
      <SymbolShape color={accent} />
      <g transform={`translate(${WORDMARK.offset.x} ${WORDMARK.offset.y})`}>
        <path d={WORDMARK.d} fill={ink} />
        <circle cx={WORDMARK.iDot.cx} cy={WORDMARK.iDot.cy} r={WORDMARK.iDot.r} fill={accent} />
      </g>
    </svg>
  );
}
