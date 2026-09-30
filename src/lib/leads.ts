/** Lead rules shared by the forms (client) and the server action. No zod here: keeps it out of the browser. */
export const TEAM_SIZES = ["1", "2-5", "6-10", "11+"] as const;

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.fr", "outlook.com", "outlook.fr", "live.com", "live.fr",
  "msn.com", "yahoo.com", "yahoo.fr", "icloud.com", "me.com", "aol.com", "orange.fr", "wanadoo.fr", "free.fr",
  "sfr.fr", "neuf.fr", "laposte.net", "bbox.fr", "gmx.fr", "gmx.com", "protonmail.com", "proton.me",
]);

/** A warning, never a block (PRD). */
export function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  return domain ? PERSONAL_DOMAINS.has(domain) : false;
}

export type LeadResult =
  | { ok: true; leadId: string }
  | { ok: false; error: "validation" | "rate_limited" | "captcha" | "server"; fields?: Record<string, string> };

/**
 * Simple lead score (PRD): team size, role, professional email, phone given,
 * pricing page or calculator used. A hot lead gets a call within one business hour.
 */
export function scoreLead(input: {
  teamSize?: string;
  role?: string;
  email: string;
  phone?: string;
  visitedPricing?: boolean;
  usedCalculator?: boolean;
  surMesure?: boolean;
}): { score: number; hot: boolean } {
  let score = 0;
  score += { "1": 1, "2-5": 2, "6-10": 3, "11+": 3 }[input.teamSize ?? ""] ?? 0;
  if (input.role && ["Directeur commercial", "Manager", "Fondateur", "Agence"].includes(input.role)) score += 1;
  if (!isPersonalEmail(input.email)) score += 2;
  if (input.phone) score += 1;
  if (input.visitedPricing) score += 1;
  if (input.usedCalculator) score += 1;
  if (input.surMesure) score += 2;
  return { score, hot: score >= 6 };
}
