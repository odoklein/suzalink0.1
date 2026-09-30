import type { Metadata } from "next";
import { site } from "@/config/site";
import { localizePath, type Href } from "@/i18n/paths";
import { routing, type Locale, type StaticPathname } from "@/i18n/routing";
import type { Meta } from "@/content/types";

/** Absolute URL of a localized pathname. */
export function absoluteUrl(locale: Locale, href: Href): string {
  const path = localizePath(href, locale);
  return new URL(path, site.url).toString().replace(/\/$/, "") || site.url;
}

/** Per-page metadata: unique title and description, canonical URL and hreflang alternates. */
export function pageMetadata(
  locale: Locale,
  pathname: StaticPathname,
  meta: Meta,
  options: { noindex?: boolean; canonical?: StaticPathname; ogTitle?: string } = {},
): Metadata {
  const canonicalPath = options.canonical ?? pathname;
  const canonical = absoluteUrl(locale, canonicalPath);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(l, canonicalPath);
  languages["x-default"] = absoluteUrl(routing.defaultLocale, canonicalPath);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      title: options.ogTitle ?? meta.title,
      description: meta.description,
      url: canonical,
      siteName: site.name,
      locale: "fr_FR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: options.ogTitle ?? meta.title, description: meta.description },
    robots: options.noindex ? { index: false, follow: true } : undefined,
  };
}

export function breadcrumbSchema(locale: Locale, items: { name: string; href: StaticPathname }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.href),
    })),
  };
}
