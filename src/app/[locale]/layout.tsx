import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/layout/Analytics";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { LocaleProvider } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { organizationSchema } from "@/lib/schema";
import "../globals.css";

// Display serif for headlines (one weight), Satoshi for body and UI.
const lastik = localFont({
  src: "../../fonts/lastik-regular.woff",
  weight: "400",
  variable: "--font-lastik",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
const satoshi = localFont({
  src: [
    { path: "../../fonts/satoshi-regular.woff", weight: "400", style: "normal" },
    { path: "../../fonts/satoshi-medium.woff", weight: "500", style: "normal" },
    { path: "../../fonts/satoshi-bold.woff", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Suzalink, la console d'exécution commerciale", template: "%s | Suzalink" },
  description: site.tagline,
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { ui } = getContent(locale);

  return (
    <html lang={locale} className={`${lastik.variable} ${satoshi.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileCtaBar trial={ui.cta.trialShort} demo={ui.cta.demo} label={ui.mobileBar.label} />
          <ConsentBanner labels={ui.consent} />
          <Analytics />
        </LocaleProvider>
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
