/**
 * The only place a price is typed. Plan cards, the calculator, the comparison
 * table, the FAQ and the schema.org Offers all read from here, and each
 * `lookupKey` is the Stripe price lookup_key used at checkout.
 *
 * Amounts are integer cents, before VAT (HT). Values marked `proposal` were
 * not fixed in the PRD and still need sign-off.
 */

export type Billing = "monthly" | "annual";
export type PlanId = "solo" | "equipe" | "agence";
export type OfferId = PlanId | "sur-mesure";

export const VAT_RATE = 0.2;
export const ANNUAL_DISCOUNT = 0.2;
export const TRIAL_DAYS = 14;
export const READ_ONLY_DAYS_AFTER_TRIAL = 30;
export const CURRENCY = "EUR";

type Priced = {
  /** Monthly plan price, per month. */
  monthly: number;
  /** Annual plan price, per year, paid upfront (monthly × 12 × 0.8, rounded down to the euro). */
  annual: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  price: Priced;
  lookupKeys: Record<Billing, string>;
  seatsIncluded: number;
  /** Price per extra user; `null` when the plan cannot add seats. */
  extraSeat: (Priced & { lookupKeys: Record<Billing, string>; proposal: true }) | null;
  maxUsers: number;
  /** Next step once `maxUsers` is reached. */
  beyondMax: "upgrade-equipe" | "upgrade-agence" | "talk-to-sales";
  clientWorkspaces: number | "unlimited";
  contacts: number;
  mailboxesPerUser: number;
  aiCreditsPerMonth: number;
  leadCreditsPerMonth: number;
  support: "standard" | "priority" | "dedicated";
  audioHours: number;
  s3StorageGb: number;
  whiteLabel: boolean;
  start: "trial" | "demo-then-trial";
  recommended: boolean;
  /** Fields whose value is a proposal, not a locked decision. */
  proposals: ReadonlyArray<keyof Plan | "extraSeat">;
};

export const PLANS: Record<PlanId, Plan> = {
  solo: {
    id: "solo",
    name: "Indépendant",
    price: { monthly: 6_900, annual: 70_800 },
    lookupKeys: { monthly: "suzalink_independant_monthly", annual: "suzalink_independant_annual" },
    seatsIncluded: 1,
    extraSeat: null,
    maxUsers: 1,
    beyondMax: "upgrade-equipe",
    clientWorkspaces: 1,
    contacts: 15_000,
    mailboxesPerUser: 1,
    aiCreditsPerMonth: 150,
    leadCreditsPerMonth: 100,
    support: "standard",
    audioHours: 20,
    s3StorageGb: 5,
    whiteLabel: false,
    start: "trial",
    recommended: false,
    proposals: [],
  },
  equipe: {
    id: "equipe",
    name: "Small Business",
    price: { monthly: 22_900, annual: 226_800 },
    lookupKeys: { monthly: "suzalink_smallbiz_monthly", annual: "suzalink_smallbiz_annual" },
    seatsIncluded: 3,
    extraSeat: {
      monthly: 4_900,
      annual: 47_000,
      lookupKeys: { monthly: "suzalink_smallbiz_seat_monthly", annual: "suzalink_smallbiz_seat_annual" },
      proposal: true,
    },
    maxUsers: 7,
    beyondMax: "upgrade-agence",
    clientWorkspaces: 3,
    contacts: 60_000,
    mailboxesPerUser: 2,
    aiCreditsPerMonth: 600,
    leadCreditsPerMonth: 500,
    support: "priority",
    audioHours: 80,
    s3StorageGb: 25,
    whiteLabel: false,
    start: "demo-then-trial",
    recommended: true,
    proposals: ["extraSeat"],
  },
  agence: {
    id: "agence",
    name: "Medium Business",
    price: { monthly: 49_900, annual: 502_800 },
    lookupKeys: { monthly: "suzalink_mediumbiz_monthly", annual: "suzalink_mediumbiz_annual" },
    seatsIncluded: 8,
    extraSeat: {
      monthly: 3_900,
      annual: 37_400,
      lookupKeys: { monthly: "suzalink_mediumbiz_seat_monthly", annual: "suzalink_mediumbiz_seat_annual" },
      proposal: true,
    },
    maxUsers: 30,
    beyondMax: "talk-to-sales",
    clientWorkspaces: "unlimited",
    contacts: 250_000,
    mailboxesPerUser: 3,
    aiCreditsPerMonth: 2_500,
    leadCreditsPerMonth: 1_500,
    support: "dedicated",
    audioHours: 250,
    s3StorageGb: 100,
    whiteLabel: true,
    start: "demo-then-trial",
    recommended: false,
    proposals: ["extraSeat", "maxUsers", "contacts", "aiCreditsPerMonth", "leadCreditsPerMonth"],
  },
};

export const PLAN_ORDER: PlanId[] = ["solo", "equipe", "agence"];

/** Done-for-you: fixed monthly fee plus a price per booked meeting, on quote. */
export const SUR_MESURE = {
  id: "sur-mesure",
  name: "Sur-mesure",
  pricing: "quote",
} as const;

/* ------------------------------------------------------------------ */
/* Add-ons & Upsells: billed monthly on any plan, cancel any time.    */
/* ------------------------------------------------------------------ */

export const AUDIO_S3_ADDON = {
  id: "audio-s3",
  name: "Pack Stockage Audio (+50 Go S3)",
  price: 2_900,
  lookupKey: "suzalink_addon_audio_s3_monthly",
} as const;

export const MISTRAL_AI_ADDON = {
  id: "mistral-ai",
  name: "Recharge Mistral AI (+1 000 Fiches RDV)",
  price: 4_900,
  lookupKey: "suzalink_addon_mistral_1000_monthly",
} as const;

export const WHITE_LABEL_ADDON = {
  id: "white-label",
  name: "Option Marque Blanche (Packs 1 & 2)",
  price: 9_900,
  lookupKey: "suzalink_addon_white_label_monthly",
} as const;

export const WORKSPACE_ADDON = {
  id: "workspace-extra",
  name: "Workspace Client Supplémentaire",
  price: 3_900,
  lookupKey: "suzalink_addon_workspace_monthly",
} as const;

export const VOIP_ADDON = {
  id: "voip",
  /** Per user per month. Check against the provider's cost per minute. */
  pricePerUser: 4_900,
  lookupKey: "suzalink_addon_voip_user_monthly",
  fairUse: {
    outboundMinutesPerUserPerMonth: 3_000,
    destinations: "fr-metro-eu",
    concurrentCallsPerUser: 1,
  },
  availableDuringTrial: false,
  proposal: true,
} as const;

export type SourcingPackId = "none" | "500" | "2000" | "5000";

export const SOURCING_PACKS: ReadonlyArray<{
  id: Exclude<SourcingPackId, "none">;
  credits: number;
  price: number;
  lookupKey: string;
}> = [
  { id: "500", credits: 500, price: 2_900, lookupKey: "suzalink_addon_credits_500_monthly" },
  { id: "2000", credits: 2_000, price: 8_900, lookupKey: "suzalink_addon_credits_2000_monthly" },
  { id: "5000", credits: 5_000, price: 17_900, lookupKey: "suzalink_addon_credits_5000_monthly" },
];

export const CREDIT_RULES = {
  creditsPerRecord: 1,
  creditsPerPhoneFound: 5,
  chargedOnlyWhenFound: true,
  rollover: false,
} as const;

export const MAILBOX_ADDON = {
  id: "mailboxes",
  single: { price: 900, lookupKey: "suzalink_addon_mailbox_monthly" },
  pack: { size: 5, price: 3_900, lookupKey: "suzalink_addon_mailbox_pack5_monthly" },
  max: 20,
  proposal: true,
} as const;

/** Calculator input bounds. */
export const CALCULATOR_LIMITS = {
  users: { min: 1, max: 30 },
  mailboxes: { min: 0, max: MAILBOX_ADDON.max },
} as const;
