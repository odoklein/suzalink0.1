import type { Metadata, Viewport } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { IdleBlocks } from "@/components/fx/IdleBlocks";
import { PointerFX } from "@/components/fx/PointerFX";
import { Analytics } from "@/components/layout/Analytics";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";
import { getContent } from "@/content";
import { CONSENT_COOKIE } from "@/lib/consent";
import { LocaleProvider } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "../globals.css";

// Sora (variable, 100–800) for headlines and figures, Satoshi for body and UI.
const sora = localFont({
  src: "../../fonts/sora-variable.woff2",
  weight: "100 800",
  variable: "--font-sora",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Arial", "sans-serif"],
});
const satoshi = localFont({
  src: [
    { path: "../../fonts/satoshi-regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/satoshi-medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/satoshi-bold.woff2", weight: "700", style: "normal" },
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
  category: "business",
  alternates: { canonical: "./" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { type: "website", siteName: site.name, locale: "fr_FR" },
  twitter: { card: "summary_large_image" },
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
    // suppressHydrationWarning: the pre-paint script below adds data-consent-needed to <html>.
    <html lang={locale} className={`${sora.variable} ${satoshi.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Before first paint: no saved choice means the server-rendered consent banner shows right away. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!/(?:^|; )${CONSENT_COOKIE}=/.test(document.cookie))document.documentElement.setAttribute("data-consent-needed","")`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {/* Reading progress: the thread grows along the top edge as the page scrolls (CSS only). */}
        <div aria-hidden className="scroll-thread pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2.5px] bg-[linear-gradient(90deg,#3355ff_0%,#7a5cff_55%,#ff8a65_100%)]" />
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileCtaBar trial={ui.cta.trialShort} demo={ui.cta.demo} label={ui.mobileBar.label} />
          <ConsentBanner labels={ui.consent} />
          <Analytics />
          <PointerFX />
          <IdleBlocks />
        </LocaleProvider>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
