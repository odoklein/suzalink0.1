import { defaultLocale, pathnames, type Locale, type Pathname, type StaticPathname } from "./config";

export type Href =
  | StaticPathname
  | { pathname: StaticPathname; hash?: string; query?: Record<string, string> }
  | { pathname: Exclude<Pathname, StaticPathname>; params: Record<string, string>; hash?: string };

/**
 * Internal route → public URL path for a locale, following the same rules as
 * the next-intl proxy (default locale unprefixed, translated slugs).
 */
export function localizePath(href: Href, locale: Locale = defaultLocale): string {
  const { pathname, hash, query, params } =
    typeof href === "string" ? { pathname: href, hash: undefined, query: undefined, params: undefined } : { query: undefined, params: undefined, ...href };
  const entry = pathnames[pathname] as string | Record<Locale, string>;
  let path = typeof entry === "string" ? entry : entry[locale];
  if (params) for (const [k, v] of Object.entries(params)) path = path.replace(`[${k}]`, encodeURIComponent(v));
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const base = prefix + (path === "/" && prefix ? "" : path);
  const search = query ? `?${new URLSearchParams(query).toString()}` : "";
  return `${base || "/"}${search}${hash ? `#${hash}` : ""}`;
}
