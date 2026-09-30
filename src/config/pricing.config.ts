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
  start: "trial" | "demo-then-trial";
  recommended: boolean;
  /** Fields whose value is a proposal, not a locked decision. */
  proposals: ReadonlyArray<keyof Plan | "extraSeat">;
};

export const PLANS: Record<PlanId, Plan> = {
  solo: {
    id: "solo",
    name: "Solo",
    price: { monthly: 7_900, annual: 75_800 },
    lookupKeys: { monthly: "suzalink_solo_monthly", annual: "suzalink_solo_annual" },
    seatsIncluded: 1,
    extraSeat: null,
    maxUsers: 1,
    beyondMax: "upgrade-equipe",
    clientWorkspaces: 1,
    contacts: 10_000,
    mailboxesPerUser: 1,
    aiCreditsPerMonth: 200,
    leadCreditsPerMonth: 100,
    support: "standard",
    start: "trial",
    recommended: false,
    proposals: [],
  },
  equipe: {
    id: "equipe",
    name: "Équipe",
    price: { monthly: 24_900, annual: 239_000 },
    lookupKeys: { monthly: "suzalink_equipe_monthly", annual: "suzalink_equipe_annual" },
    seatsIncluded: 3,
    extraSeat: {
      monthly: 6_900,
      annual: 66_200,
      lookupKeys: { monthly: "suzalink_equipe_seat_monthly", annual: "suzalink_equipe_seat_annual" },
      proposal: true,
    },
    maxUsers: 10,
    beyondMax: "upgrade-agence",
    clientWorkspaces: 3,
    contacts: 50_000,
    mailboxesPerUser: 2,
    aiCreditsPerMonth: 1_000,
    leadCreditsPerMonth: 500,
    support: "priority",
    start: "demo-then-trial",
    recommended: true,
    proposals: ["extraSeat"],
  },
  agence: {
    id: "agence",
    name: "Agence",
    price: { monthly: 49_900, annual: 479_000 },
    lookupKeys: { monthly: "suzalink_agence_monthly", annual: "suzalink_agence_annual" },
    seatsIncluded: 5,
    extraSeat: {
      monthly: 5_900,
      annual: 56_600,
      lookupKeys: { monthly: "suzalink_agence_seat_monthly", annual: "suzalink_agence_seat_annual" },
      proposal: true,
    },
    maxUsers: 30,
    beyondMax: "talk-to-sales",
    clientWorkspaces: "unlimited",
    contacts: 250_000,
    mailboxesPerUser: 3,
    aiCreditsPerMonth: 3_000,
    leadCreditsPerMonth: 1_500,
    support: "dedicated",
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
/* Add-ons: billed monthly on any plan, cancel any time. All proposals. */
/* ------------------------------------------------------------------ */

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
