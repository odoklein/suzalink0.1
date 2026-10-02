"use client";

import { useEffect, useState } from "react";

/**
 * A step counter for the product mocks: 0, 1, 2… every `ms` while `active`.
 * It never moves under reduced motion, so the mocks show their first state.
 */
export function useTicker(ms: number, active: boolean) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms, active]);

  return tick;
}
