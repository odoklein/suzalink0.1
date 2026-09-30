import {
  CALCULATOR_LIMITS,
  MAILBOX_ADDON,
  PLAN_ORDER,
  PLANS,
  SOURCING_PACKS,
  VAT_RATE,
  VOIP_ADDON,
  type Billing,
  type PlanId,
  type SourcingPackId,
} from "@/config/pricing.config";

export type CalculatorInput = {
  users: number;
  /** Users covered by the unlimited telephony add-on. */
  voipUsers: number;
  sourcingPack: SourcingPackId;
  extraMailboxes: number;
  billing: Billing;
  /** « Je travaille pour plusieurs clients » forces Agence. */
  multiClient: boolean;
};

export type LineItem = {
  id: "plan" | "seats" | "voip" | "sourcing" | "mailbox-pack" | "mailbox-single";
  lookupKey: string;
  quantity: number;
  /** Unit price in cents for one billing interval. */
  unitAmount: number;
  /** quantity × unitAmount, in cents. */
  amount: number;
  interval: "month" | "year";
};

export type Quote = {
  plan: PlanId;
  billing: Billing;
  users: number;
  extraSeats: number;
  lines: LineItem[];
  /** Everything billed each month (all lines on monthly billing, only add-ons on annual). */
  monthlyRecurring: number;
  /** Everything billed once a year (plan and seats on annual billing, otherwise 0). */
  yearlyRecurring: number;
  /** Cost over twelve months, before VAT. Exact to the cent. */
  annualTotal: number;
  /** annualTotal ÷ 12, rounded to the cent. Exact on monthly billing. */
  monthlyTotal: number;
  /** What the first Stripe invoice charges, before VAT. */
  firstInvoice: number;
  vatOnFirstInvoice: number;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(n)));

/** Plan price plus extra seats for one interval, or null if the plan can't hold that many users. */
function planCost(planId: PlanId, users: number, billing: Billing): number | null {
  const plan = PLANS[planId];
  if (users > plan.maxUsers) return null;
  const extra = Math.max(0, users - plan.seatsIncluded);
  if (extra > 0 && !plan.extraSeat) return null;
  return plan.price[billing] + extra * (plan.extraSeat?.[billing] ?? 0);
}

/** The cheapest plan that fits the team. Agence when working for several clients. */
export function recommendPlan(users: number, multiClient: boolean, billing: Billing = "monthly"): PlanId {
  const candidates: PlanId[] = multiClient ? ["agence"] : PLAN_ORDER;
  let best: { id: PlanId; cost: number } | null = null;
  for (const id of candidates) {
    const cost = planCost(id, users, billing);
    if (cost !== null && (best === null || cost < best.cost)) best = { id, cost };
  }
  return best?.id ?? "agence";
}

/** Cheapest mix of 5-packs and single mailboxes. */
export function splitMailboxes(count: number): { packs: number; singles: number } {
  const { pack, single } = MAILBOX_ADDON;
  const packs = Math.floor(count / pack.size);
  const rest = count % pack.size;
  // A pack beats singles as soon as the remainder costs more than one pack.
  return rest * single.price > pack.price ? { packs: packs + 1, singles: 0 } : { packs, singles: rest };
}

export function calculate(input: CalculatorInput): Quote {
  const users = clamp(input.users, CALCULATOR_LIMITS.users.min, CALCULATOR_LIMITS.users.max);
  const voipUsers = clamp(input.voipUsers, 0, users);
  const mailboxes = clamp(input.extraMailboxes, CALCULATOR_LIMITS.mailboxes.min, CALCULATOR_LIMITS.mailboxes.max);
  const { billing } = input;
  const planId = recommendPlan(users, input.multiClient, billing);
  const plan = PLANS[planId];
  const planInterval = billing === "annual" ? "year" : "month";
  const extraSeats = Math.max(0, users - plan.seatsIncluded);

  const lines: LineItem[] = [
    {
      id: "plan",
      lookupKey: plan.lookupKeys[billing],
      quantity: 1,
      unitAmount: plan.price[billing],
      amount: plan.price[billing],
      interval: planInterval,
    },
  ];

  if (extraSeats > 0 && plan.extraSeat) {
    lines.push({
      id: "seats",
      lookupKey: plan.extraSeat.lookupKeys[billing],
      quantity: extraSeats,
      unitAmount: plan.extraSeat[billing],
      amount: extraSeats * plan.extraSeat[billing],
      interval: planInterval,
    });
  }

  if (voipUsers > 0) {
    lines.push({
      id: "voip",
      lookupKey: VOIP_ADDON.lookupKey,
      quantity: voipUsers,
      unitAmount: VOIP_ADDON.pricePerUser,
      amount: voipUsers * VOIP_ADDON.pricePerUser,
      interval: "month",
    });
  }

  const pack = SOURCING_PACKS.find((p) => p.id === input.sourcingPack);
  if (pack) {
    lines.push({ id: "sourcing", lookupKey: pack.lookupKey, quantity: 1, unitAmount: pack.price, amount: pack.price, interval: "month" });
  }

  if (mailboxes > 0) {
    const { packs, singles } = splitMailboxes(mailboxes);
    if (packs > 0) {
      lines.push({
        id: "mailbox-pack",
        lookupKey: MAILBOX_ADDON.pack.lookupKey,
        quantity: packs,
        unitAmount: MAILBOX_ADDON.pack.price,
        amount: packs * MAILBOX_ADDON.pack.price,
        interval: "month",
      });
    }
    if (singles > 0) {
      lines.push({
        id: "mailbox-single",
        lookupKey: MAILBOX_ADDON.single.lookupKey,
        quantity: singles,
        unitAmount: MAILBOX_ADDON.single.price,
        amount: singles * MAILBOX_ADDON.single.price,
        interval: "month",
      });
    }
  }

  const sum = (interval: LineItem["interval"]) =>
    lines.filter((l) => l.interval === interval).reduce((total, l) => total + l.amount, 0);

  const monthlyRecurring = sum("month");
  const yearlyRecurring = sum("year");
  const annualTotal = yearlyRecurring + 12 * monthlyRecurring;
  const firstInvoice = yearlyRecurring + monthlyRecurring;

  return {
    plan: planId,
    billing,
    users,
    extraSeats,
    lines,
    monthlyRecurring,
    yearlyRecurring,
    annualTotal,
    monthlyTotal: Math.round(annualTotal / 12),
    firstInvoice,
    vatOnFirstInvoice: Math.round(firstInvoice * VAT_RATE),
  };
}
