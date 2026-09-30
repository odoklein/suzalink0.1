/**
 * Locales and localized pathnames, as plain data so both the proxy (through
 * next-intl) and the client-side Link can read them without shipping
 * next-intl to the browser.
 *
 * English later: add "en" to `locales` and turn each value into `{ fr, en }`,
 * e.g. "/tarifs": { fr: "/tarifs", en: "/pricing" }.
 */
export const locales = ["fr"] as const;
export const defaultLocale = "fr" as const;

export const pathnames = {
  "/": "/",
  "/accueil/[audience]": "/accueil/[audience]",
  "/tarifs": "/tarifs",
  "/fonctionnalites": "/fonctionnalites",
  "/fonctionnalites/appels": "/fonctionnalites/appels",
  "/fonctionnalites/emails": "/fonctionnalites/emails",
  "/fonctionnalites/rendez-vous": "/fonctionnalites/rendez-vous",
  "/fonctionnalites/listes-et-leads": "/fonctionnalites/listes-et-leads",
  "/fonctionnalites/ia": "/fonctionnalites/ia",
  "/fonctionnalites/pilotage": "/fonctionnalites/pilotage",
  "/fonctionnalites/portail-client": "/fonctionnalites/portail-client",
  "/solutions/directeur-commercial": "/solutions/directeur-commercial",
  "/solutions/equipes-commerciales": "/solutions/equipes-commerciales",
  "/solutions/agences": "/solutions/agences",
  "/sur-mesure": "/sur-mesure",
  "/integrations": "/integrations",
  "/securite": "/securite",
  "/a-propos": "/a-propos",
  "/demo": "/demo",
  "/nouveautes": "/nouveautes",
  "/mentions-legales": "/mentions-legales",
  "/cgv": "/cgv",
  "/confidentialite": "/confidentialite",
  "/cookies": "/cookies",
  "/dpa": "/dpa",
} satisfies Record<string, string | Record<(typeof locales)[number], string>>;

export type Locale = (typeof locales)[number];
export type Pathname = keyof typeof pathnames;
/** Routes that need no params, usable as plain hrefs. */
export type StaticPathname = Exclude<Pathname, `${string}[${string}]${string}`>;
