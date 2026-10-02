import type { ReactNode } from "react";
import { hueVar, type Hue } from "@/config/hues";
import { cn } from "@/lib/cn";

/**
 * The stage a product shot stands on: a rounded field of light in the
 * module's hue with a hairline grid, or a night sky with stars and aurora
 * (`tone="night"`, for the AI). Children sit above the backdrop.
 */
export function Stage({
  hue = "accent",
  tone = "day",
  className,
  children,
}: {
  hue?: Hue;
  tone?: "day" | "night";
  className?: string;
  children: ReactNode;
}) {
  const night = tone === "night";
  return (
    <div className={cn("relative isolate rounded-[32px]", className)} style={hueVar(hue)}>
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
        {night ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,#1d2a72_0%,#0b1230_48%,#060a1a_100%)]" />
            <div className="stars absolute inset-0 animate-pulse-dot opacity-90 [animation-duration:7s]" />
            <div className="absolute -left-[10%] top-[8%] h-[70%] w-[50%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.55),transparent)] blur-3xl" />
            <div className="absolute -right-[8%] top-[18%] h-[60%] w-[46%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(31_147_255/0.42),transparent)] blur-3xl [animation-delay:-9s]" />
            <div className="absolute bottom-[-20%] left-[30%] h-[50%] w-[44%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(247_70_138/0.3),transparent)] blur-3xl [animation-delay:-15s]" />
            <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
            <div className="bg-grid absolute inset-0 [--grid-color:rgb(255_255_255/0.05)] [mask-image:radial-gradient(ellipse_at_50%_0%,#000,transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--hue)_13%,white)_0%,color-mix(in_srgb,var(--hue)_5%,white)_55%,white_100%)]" />
            <div className="absolute -top-[30%] left-1/2 h-[80%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--hue)_30%,transparent),transparent)] blur-2xl" />
            <div className="bg-grid absolute inset-0 [--grid-color:color-mix(in_srgb,var(--hue)_12%,transparent)] [--grid-size:48px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_10%,#000_30%,transparent_80%)]" />
          </>
        )}
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-ink/[0.06]" />
      </div>
      {children}
    </div>
  );
}
