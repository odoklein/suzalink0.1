import type { Billing, PlanId } from "@/config/pricing.config";
import { appLinks } from "@/config/site";

/**
 * Signup URL contract with app.suzalink.com/inscription:
 *   plan     solo | equipe | agence (Équipe and Agence make the booking step required)
 *   billing  monthly | annual
 * UTM parameters and the landing page are appended at click time (see Analytics).
 */
export function signupUrl(plan: PlanId, billing: Billing = "monthly"): string {
  const params = new URLSearchParams({ plan, billing });
  return `${appLinks.signup}?${params.toString()}`;
}

export function isSignupUrl(href: string): boolean {
  return href.startsWith(appLinks.signup);
}
