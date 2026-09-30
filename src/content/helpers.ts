import type { ClaimId } from "@/config/claims";
import type { Claimed } from "./types";

/** Copy that depends on a product claim (see src/config/claims.ts). */
export function claimed(text: string, claim: ClaimId, fallback?: string): Claimed {
  return fallback === undefined ? { text, claim } : { text, claim, fallback };
}
