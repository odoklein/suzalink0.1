"use client";

import { useCallback, useEffect, useState } from "react";
import type { Billing } from "@/config/pricing.config";
import { BILLING_EVENT, readBilling, writeBilling } from "@/lib/billing-pref";

/** Monthly/annual state shared by the plan toggle and the calculator (and carried into signup). */
export function useBilling(): [Billing, (b: Billing) => void] {
  const [billing, setBilling] = useState<Billing>("monthly");

  useEffect(() => {
    const stored = readBilling();
    // Restore the visitor's earlier choice after hydration (storage is browser-only).
    if (stored) queueMicrotask(() => setBilling(stored));
    const onChange = (e: Event) => setBilling((e as CustomEvent<Billing>).detail);
    window.addEventListener(BILLING_EVENT, onChange);
    return () => window.removeEventListener(BILLING_EVENT, onChange);
  }, []);

  const update = useCallback((next: Billing) => {
    setBilling(next);
    writeBilling(next);
  }, []);

  return [billing, update];
}
