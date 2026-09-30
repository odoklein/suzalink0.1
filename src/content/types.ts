import type { ClaimId } from "@/config/claims";
import type { PlanId } from "@/config/pricing.config";
import type { ScreenshotId, VisualId } from "@/config/visuals";
import type { StaticPathname } from "@/i18n/routing";

export type Meta = { title: string; description: string };

/**
 * Text that depends on a product claim. When the claim is hidden, `fallback`
 * replaces it (or the item disappears); when it is « soon », it gets a badge.
 */
export type Claimed = { text: string; claim: ClaimId; fallback?: string };
export type Text = string | Claimed;

export type Faq = { q: string; a: Text; claim?: ClaimId };

export type Cta =
  | { kind: "trial" }
  | { kind: "demo" }
  | { kind: "expert" }
  | { kind: "signup"; plan: PlanId };

export type Media = { screenshot: ScreenshotId } | { visual: VisualId };

export type IconName =
  | "phone"
  | "mail"
  | "calendar"
  | "list"
  | "sparkles"
  | "chart"
  | "portal"
  | "shield"
  | "plug"
  | "users"
  | "building"
  | "user"
  | "headset"
  | "server"
  | "lock"
  | "file"
  | "euro"
  | "clock"
  | "check"
  | "compass"
  | "inbox"
  | "target"
  | "flag"
  | "share"
  | "keyboard"
  | "refresh";

export type ModuleSlug =
  | "appels"
  | "emails"
  | "rendez-vous"
  | "listes-et-leads"
  | "ia"
  | "pilotage"
  | "portail-client";

export type SolutionSlug = "directeur-commercial" | "equipes-commerciales" | "agences";

export type FeatureCard = { icon?: IconName; title: string; body: Text; claim?: ClaimId };

export type DeepDive = {
  eyebrow?: string;
  title: string;
  body: string;
  bullets: Text[];
  media: Media;
  link?: { label: string; href: StaticPathname };
};

export type ModuleContent = {
  slug: ModuleSlug;
  path: StaticPathname;
  icon: IconName;
  name: string;
  navBlurb: string;
  meta: Meta;
  hero: { eyebrow: string; title: string; sub: string; cta: "trial" | "demo"; media: Media };
  highlights: FeatureCard[];
  sections: DeepDive[];
  addon?: "voip" | "sourcing" | "mailboxes";
  soon?: { title: string; body: string }[];
  faq: Faq[];
  related: ModuleSlug[];
};

export type SolutionContent = {
  slug: SolutionSlug;
  path: StaticPathname;
  icon: IconName;
  name: string;
  navBlurb: string;
  plan: PlanId;
  visual: VisualId;
  meta: Meta;
  hero: { eyebrow: string; title: string; sub: string; cta: "trial" | "demo" };
  pains: { title: string; body: string }[];
  day: { title: string; sub: string; steps: { time: string; title: string; body: Text }[] };
  features: { module: ModuleSlug; title: string; body: Text }[];
  plan_pitch: { title: string; body: string; bullets: Text[] };
  faq: Faq[];
};
