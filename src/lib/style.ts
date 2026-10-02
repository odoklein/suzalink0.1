import type { CSSProperties } from "react";

/** Inline CSS custom properties, e.g. `vars({ "--i": 2 })` for a reveal stagger. */
export function vars(values: Record<`--${string}`, string | number>): CSSProperties {
  return values as CSSProperties;
}
