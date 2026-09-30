/**
 * Claims that depend on product work (PRD, "Product dependencies"). Flip
 * `verified` once the dependency ships and has been checked.
 *
 * In strict mode (Vercel production, or SITE_STRICT_CLAIMS=1), an unverified
 * claim is hidden or shown as « Bientôt », depending on `whenUnverified`.
 * Previews and local dev show everything so the pages can be reviewed.
 * `npm run check:claims` lists what still blocks the public launch.
 */
export type ClaimId =
  | "ai-mistral"
  | "hosting-fr"
  | "uptime-99"
  | "voip-addon"
  | "lead-credits"
  | "pay-only-found"
  | "grain-fireflies"
  | "tokens-encrypted"
  | "email-ab"
  | "email-warmup"
  | "mailbox-rotation"
  | "daily-ai-report"
  | "crm-import-presets"
  | "billing-facturx";

type Claim = {
  dependency: number;
  statement: string;
  verified: boolean;
  whenUnverified: "hide" | "soon";
};

export const CLAIMS: Record<ClaimId, Claim> = {
  "ai-mistral": {
    dependency: 9,
    statement: "Every AI route runs on Mistral AI (list-import mapping, onboarding and script still call OpenAI or Gemini).",
    verified: false,
    whenUnverified: "hide",
  },
  "hosting-fr": {
    dependency: 10,
    statement: "Every subprocessor is hosted in France, with backups in Germany and Spain.",
    verified: false,
    whenUnverified: "hide",
  },
  "uptime-99": {
    dependency: 15,
    statement: "99 % uptime from January to September 2026, backed by a public status page.",
    verified: false,
    whenUnverified: "hide",
  },
  "voip-addon": {
    dependency: 11,
    statement: "Native VoIP add-on: provider, French numbers, recording, fair-use metering.",
    verified: false,
    whenUnverified: "soon",
  },
  "lead-credits": {
    dependency: 12,
    statement: "Lead-credit wallet for Apollo, Google Maps and enrichment packs.",
    verified: false,
    whenUnverified: "soon",
  },
  "pay-only-found": {
    dependency: 12,
    statement: "Credits are charged only when data is found.",
    verified: false,
    whenUnverified: "hide",
  },
  "grain-fireflies": {
    dependency: 16,
    statement: "Grain and Fireflies connectors (only Leexi exists in code today).",
    verified: false,
    whenUnverified: "soon",
  },
  "tokens-encrypted": {
    dependency: 8,
    // suzalink-repo already has AES-256-GCM in lib/encryption.ts; confirm it covers every stored secret.
    statement: "Mailbox tokens and passwords are encrypted at rest.",
    verified: false,
    whenUnverified: "hide",
  },
  // Found missing during the code review of suzalink-repo (not in the PRD dependency list).
  "email-ab": {
    dependency: 0,
    statement: "A/B variants in email sequences (schema fields exist, no code uses them).",
    verified: false,
    whenUnverified: "soon",
  },
  "email-warmup": {
    dependency: 0,
    statement: "Automatic mailbox warmup (a status field and queue exist, nothing sends warmup emails).",
    verified: false,
    whenUnverified: "soon",
  },
  "mailbox-rotation": {
    dependency: 0,
    statement: "Mailbox rotation inside sequences.",
    verified: false,
    whenUnverified: "soon",
  },
  "daily-ai-report": {
    dependency: 0,
    statement: "A daily AI report (today the AI recap runs on demand and daily feedback is manual).",
    verified: false,
    whenUnverified: "soon",
  },
  "crm-import-presets": {
    dependency: 0,
    statement: "HubSpot and Salesforce list-import presets (only CSV and Apollo today).",
    verified: false,
    whenUnverified: "hide",
  },
  "billing-facturx": {
    dependency: 3,
    statement: "Suzalink's own subscription invoices are issued as Factur-X (Stripe does not do this natively).",
    verified: false,
    whenUnverified: "hide",
  },
};

/** Features that are not claims but are not built yet (P1). */
export const FEATURES = {
  stackCalculator: false,
  resources: false,
  comparisons: false,
} as const;

export const strictClaims =
  process.env.SITE_STRICT_CLAIMS === "1" || process.env.VERCEL_ENV === "production";

export type ClaimState = "live" | "soon" | "hidden";

export function claimState(id: ClaimId): ClaimState {
  const claim = CLAIMS[id];
  if (claim.verified || !strictClaims) return "live";
  return claim.whenUnverified === "soon" ? "soon" : "hidden";
}

export const isLive = (id: ClaimId) => claimState(id) === "live";
export const isShown = (id: ClaimId) => claimState(id) !== "hidden";
