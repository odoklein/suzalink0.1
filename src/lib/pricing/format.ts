import { PLANS, type Billing, type PlanId } from "@/config/pricing.config";

const whole = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const integer = new Intl.NumberFormat("fr-FR");

/** 7900 → « 79 € » (fr-FR already uses no-break spaces). */
export function euros(amountInCents: number): string {
  return amountInCents % 100 === 0 ? whole.format(amountInCents / 100) : cents.format(amountInCents / 100);
}

/** Always two decimals, for totals that must match checkout to the cent. */
export function eurosExact(amountInCents: number): string {
  return cents.format(amountInCents / 100);
}

export function formatInt(n: number): string {
  return integer.format(n);
}

/** The per-month price shown on a plan card: annual price ÷ 12, rounded to the euro. */
export function planMonthlyDisplay(planId: PlanId, billing: Billing): number {
  const { price } = PLANS[planId];
  return billing === "monthly" ? price.monthly : Math.round(price.annual / 12 / 100) * 100;
}
