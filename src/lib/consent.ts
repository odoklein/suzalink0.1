/**
 * CNIL-style consent: nothing non-exempt loads before a choice, refusing is as
 * easy as accepting, and the choice is kept for six months.
 */
export type Consent = { v: 1; analytics: boolean; marketing: boolean; ts: number };

const COOKIE = "sz_consent";
const MAX_AGE_DAYS = 182;
export const CONSENT_EVENT = "sz:consent";
export const CONSENT_OPEN_EVENT = "sz:consent-open";

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Consent;
    return value.v === 1 ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const consent: Consent = { v: 1, ...choice, ts: Date.now() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
