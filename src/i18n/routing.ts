import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales, pathnames } from "./config";

export type { Locale, Pathname, StaticPathname } from "./config";

/** French at the root; English will live under /en with translated slugs (see config.ts). */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  // One language today: no Accept-Language redirects and no locale cookie.
  localeDetection: false,
  localeCookie: false,
  pathnames,
});
