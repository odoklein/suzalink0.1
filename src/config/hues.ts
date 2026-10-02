import type { CSSProperties } from "react";
import type { ModuleSlug, SolutionSlug } from "@/content/types";

/**
 * The sky palette around Suzalink blue (tokens in globals.css). Each module and
 * persona owns one hue, carried by its icon tile, its stage glow and its charts.
 * CTAs, links and the thread always stay Suzalink blue.
 */
export type Hue = "accent" | "azure" | "violet" | "mint" | "sun" | "coral" | "rose";

export const MODULE_HUE: Record<ModuleSlug, Hue> = {
  appels: "coral",
  emails: "azure",
  "rendez-vous": "mint",
  "listes-et-leads": "sun",
  ia: "violet",
  pilotage: "accent",
  "portail-client": "rose",
};

export const SOLUTION_HUE: Record<SolutionSlug, Hue> = {
  "directeur-commercial": "sun",
  "equipes-commerciales": "azure",
  agences: "violet",
};

/** Class names spelled out in full so Tailwind can see them. `color` is the raw CSS value. */
export const HUE: Record<Hue, { text: string; bg: string; soft: string; ink: string; ring: string; color: string }> = {
  accent: { text: "text-accent", bg: "bg-accent", soft: "bg-accent-tint", ink: "text-accent-ink", ring: "ring-accent/15", color: "var(--color-accent)" },
  azure: { text: "text-azure", bg: "bg-azure", soft: "bg-azure-soft", ink: "text-azure-ink", ring: "ring-azure/20", color: "var(--color-azure)" },
  violet: { text: "text-violet", bg: "bg-violet", soft: "bg-violet-soft", ink: "text-violet-ink", ring: "ring-violet/20", color: "var(--color-violet)" },
  mint: { text: "text-mint", bg: "bg-mint", soft: "bg-mint-soft", ink: "text-mint-ink", ring: "ring-mint/20", color: "var(--color-mint)" },
  sun: { text: "text-sun", bg: "bg-sun", soft: "bg-sun-soft", ink: "text-sun-ink", ring: "ring-sun/25", color: "var(--color-sun)" },
  coral: { text: "text-coral", bg: "bg-coral", soft: "bg-coral-soft", ink: "text-coral-ink", ring: "ring-coral/20", color: "var(--color-coral)" },
  rose: { text: "text-rose", bg: "bg-rose", soft: "bg-rose-soft", ink: "text-rose-ink", ring: "ring-rose/20", color: "var(--color-rose)" },
};

/** Inline style that tints spotlights and glows (`--hue` is read by globals.css). */
export const hueVar = (hue: Hue) => ({ "--hue": HUE[hue].color }) as CSSProperties;
