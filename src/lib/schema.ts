import { CURRENCY, PLAN_ORDER, PLANS } from "@/config/pricing.config";
import { site } from "@/config/site";

/** schema.org data. Offers are generated from the pricing config, never typed by hand. Prices are HT. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    sameAs: [site.linkedinUrl],
    email: site.contactEmail,
  };
}

const toAmount = (cents: number) => (cents / 100).toFixed(2);

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
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
