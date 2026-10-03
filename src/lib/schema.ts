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
    description: "Console d'exécution commerciale et CRM outbound B2B tout-en-un avec téléphonie Allo & OnOff, Call Vault audio S3 et IA Mistral.",
    inLanguage: "fr-FR",
    featureList: [
      "Intégration native téléphonie Allo & OnOff Business via webhooks",
      "Call Vault : Stockage et réécoute audio sécurisés sur S3 privé",
      "Génération automatique de fiches de RDV en 10 secondes par Mistral AI",
      "Cockpit manager et suivi du rythme SDR en direct",
      "Moteur d'exclusions et détection anti-collision",
      "Architecture Single-Tenant avec instance et base PostgreSQL dédiées",
      "Marque blanche complète et portail client spectateur pour agences",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "38",
      bestRating: "5",
      worstRating: "1",
    },
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

export function faqPageSchema(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
