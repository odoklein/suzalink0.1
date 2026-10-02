/** Domains, product URLs and third-party identifiers. Secrets never go here. */
export const site = {
  name: "Suzalink",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://suzalink.com",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.suzalink.com",
  statusUrl: "https://status.suzalink.com",
  linkedinUrl: "https://www.linkedin.com/company/suzalink",
  contactEmail: "contact@suzalink.com",
  /** The app tagline stays the default meta description. */
  tagline: "La plateforme d'exécution commerciale qui transforme l'activité en résultats.",
} as const;

/**
 * Only the production domain is indexed. Staging, previews and `next dev` stay
 * out of search engines (robots.txt and the X-Robots-Tag header).
 * Force either way with SITE_INDEXING=on|off.
 */
export const indexable =
  process.env.SITE_INDEXING === "on" ||
  (process.env.SITE_INDEXING !== "off" &&
    process.env.NODE_ENV === "production" &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production") &&
    !/^(localhost|127\.|(staging|preview|dev|test)[.-])|\.vercel\.app$/.test(new URL(site.url).hostname));

/** Last significant content change, used by the sitemap. Bump it when copy changes. */
export const contentUpdatedAt = "2026-10-01";

export const appLinks = {
  login: `${site.appUrl}/connexion`,
  signup: `${site.appUrl}/inscription`,
} as const;

/** Cal.com event slugs. Set them per environment; the page shows a fallback when missing. */
export const calLinks = {
  demo: process.env.NEXT_PUBLIC_CAL_DEMO_LINK ?? "",
  expert: process.env.NEXT_PUBLIC_CAL_EXPERT_LINK ?? "",
} as const;

export const integrationsKeys = {
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
  linkedinPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? "",
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
} as const;
