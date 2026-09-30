import type { MetadataRoute } from "next";
import { localizePath } from "@/i18n/paths";
import { routing, type StaticPathname } from "@/i18n/routing";
import { site } from "@/config/site";

const PRIORITY: Partial<Record<StaticPathname, number>> = { "/": 1, "/tarifs": 0.9, "/demo": 0.8, "/fonctionnalites": 0.8 };
const LEGAL = new Set<StaticPathname>(["/mentions-legales", "/cgv", "/confidentialite", "/cookies", "/dpa"]);

/** Every static page, with hreflang alternates ready for /en. Home variants (/accueil/…) are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = (Object.keys(routing.pathnames) as string[]).filter((p) => !p.includes("[")) as StaticPathname[];
  const lastModified = new Date();
  const url = (locale: (typeof routing.locales)[number], href: StaticPathname) =>
    new URL(localizePath(href, locale), site.url).toString().replace(/\/$/, "");

  return paths.map((href) => ({
    url: url(routing.defaultLocale, href),
    lastModified,
    changeFrequency: LEGAL.has(href) ? "yearly" : "monthly",
    priority: PRIORITY[href] ?? (LEGAL.has(href) ? 0.2 : 0.6),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, url(l, href)])) },
  }));
}
