import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/home/HomePage";
import { AUDIENCES, isAudience } from "@/config/audiences";
import { getContent } from "@/content";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

/**
 * Pre-rendered home variants for ?utm_audience=… (the proxy rewrites / here).
 * Not meant to be visited directly: noindex, canonical to /.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => AUDIENCES.map((audience) => ({ locale, audience })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/accueil/[audience]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const { home } = getContent(locale);
  return { ...pageMetadata(locale, "/", home.meta, { noindex: true }), title: { absolute: home.meta.title } };
}

export default async function Page({ params }: PageProps<"/[locale]/accueil/[audience]">) {
  const { locale, audience } = await params;
  if (!isAudience(audience)) notFound();
  setRequestLocale(locale as Locale);
  return <HomePage audience={audience} />;
}
