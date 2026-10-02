import type { Meta } from "@/content/types";
import type { Locale, StaticPathname } from "@/i18n/routing";
import { webPageSchema } from "@/lib/schema";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** WebPage node plus, below the home page, its breadcrumb trail. */
export function PageJsonLd({
  locale,
  pathname,
  meta,
  homeLabel,
  type,
  dateModified,
}: {
  locale: Locale;
  pathname: StaticPathname;
  meta: Meta;
  homeLabel: string;
  type?: Parameters<typeof webPageSchema>[0]["type"];
  dateModified?: string;
}) {
  const page = webPageSchema({ url: absoluteUrl(locale, pathname), name: meta.title, description: meta.description, type, dateModified });
  if (pathname === "/") return <JsonLd data={page} />;
  const trail = breadcrumbSchema(locale, [
    { name: homeLabel, href: "/" },
    { name: meta.title, href: pathname },
  ]);
  return <JsonLd data={[page, trail]} />;
}
