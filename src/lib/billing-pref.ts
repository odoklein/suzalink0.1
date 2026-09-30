import type { Billing } from "@/config/pricing.config";

/** The monthly/annual choice, shared by the pricing toggle, the calculator and every signup link. */
const KEY = "sz_billing";
export const BILLING_EVENT = "sz:billing";

export function readBilling(): Billing | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === "annual" || v === "monthly" ? v : null;
  } catch {
    return null;
  }
}

export function writeBilling(billing: Billing) {
  try {
    sessionStorage.setItem(KEY, billing);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent<Billing>(BILLING_EVENT, { detail: billing }));
}
