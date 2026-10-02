import { CURRENCY, PLAN_ORDER, PLANS } from "@/config/pricing.config";
import { site } from "@/config/site";

/** schema.org data. Offers are generated from the pricing config, never typed by hand. Prices are HT. */
const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: { "@type": "ImageObject", url: `${site.url}/brand/suzalink-app-icon.svg`, caption: site.name },
    sameAs: [site.linkedinUrl],
    email: site.contactEmail,
    slogan: site.tagline,
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", email: site.contactEmail, availableLanguage: ["fr"] }],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: site.url,
    name: site.name,
    description: site.tagline,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  };
}

/** A page node tied to the site and organization. Use a subtype for About / Collection pages. */
export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${opts.url}#webpage`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    inLanguage: "fr-FR",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

const toAmount = (cents: number) => (cents / 100).toFixed(2);

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    publisher: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
    name: site.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: site.url,
    description: site.tagline,
    inLanguage: "fr-FR",
    offers: PLAN_ORDER.flatMap((id) => {
      const plan = PLANS[id];
      return (["monthly", "annual"] as const).map((billing) => ({
        "@type": "Offer",
        name: `${plan.name} (${billing === "monthly" ? "mensuel" : "annuel"})`,
        price: toAmount(plan.price[billing]),
        priceCurrency: CURRENCY,
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: toAmount(plan.price[billing]),
          priceCurrency: CURRENCY,
          valueAddedTaxIncluded: false,
          billingDuration: 1,
          unitCode: billing === "monthly" ? "MON" : "ANN",
          referenceQuantity: { "@type": "QuantitativeValue", value: plan.seatsIncluded, unitText: "utilisateurs" },
        },
        url: `${site.url}/tarifs`,
      }));
    }),
  };
}
