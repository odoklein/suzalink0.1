import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { Calculator } from "@/components/pricing/Calculator";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { AddOns, ComparisonTable, FairUse, IncludedModules, PricingHeader, TrustStrip } from "@/components/pricing/PricingSections";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/JsonLd";
import { H2, Section, SectionHeader } from "@/components/ui/Section";
import { claimState } from "@/config/claims";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { softwareApplicationSchema } from "@/lib/schema";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/tarifs">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/tarifs", getContent(locale).pricing.meta);
}

export default async function PricingPage({ params }: PageProps<"/[locale]/tarifs">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { pricing, ui } = getContent(locale);
  const toggle = {
    monthly: pricing.header.monthly,
    annual: pricing.header.annual,
    discount: ui.badges.annualDiscount,
    group: pricing.header.toggleLabel,
  };

  return (
    <>
      <section data-hero className="bg-white pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="container-site">
          <PricingHeader />
          <div className="mt-12">
            <PricingPlans
              labels={{
                toggle,
                plans: pricing.plans,
                card: pricing.card,
                surMesure: pricing.surMesure,
                cta: { trial: ui.cta.trial, demo: ui.cta.demo, expert: ui.cta.expert },
                recommended: ui.badges.recommended,
              }}
            />
          </div>
        </div>
      </section>

      <TrustStrip />

      <Section tone="surface" id="calculateur" aria-labelledby="calculator-title">
        <SectionHeader id="calculator-title" title={pricing.calculator.title} sub={pricing.calculator.sub} />
        <div className="mt-12">
          <Calculator
            labels={{
              ...pricing.calculator,
              toggle,
              cta: { trial: ui.cta.trial, demo: ui.cta.demo },
              soonBadge: ui.badges.soon,
            }}
            voipState={claimState("voip-addon")}
            creditsState={claimState("lead-credits")}
          />
        </div>
      </Section>

      <IncludedModules />
      <AddOns />
      <ComparisonTable />
      <FairUse />

      <Section aria-labelledby="pricing-faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <H2 id="pricing-faq-title">{pricing.faq.title}</H2>
          <Faq items={pricing.faq.items} />
        </div>
      </Section>

      <CtaBand
        title={pricing.finalCta.title}
        sub={pricing.finalCta.sub}
        primary={{ kind: "demo" }}
        secondary={{ kind: "trial" }}
        section="pricing_final"
      />

      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: ui.breadcrumbs.home, href: "/" },
          { name: ui.header.pricing, href: "/tarifs" },
        ])}
      />
    </>
  );
}
