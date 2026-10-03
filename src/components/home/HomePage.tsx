import { getLocale } from "next-intl/server";
import type { Audience } from "@/config/audiences";
import { dict } from "@/content";
import type { Locale } from "@/i18n/routing";
import { faqPageSchema, softwareApplicationSchema } from "@/lib/schema";
import { CtaBand } from "../blocks/CtaBand";
import { IntegrationsGrid } from "../blocks/IntegrationsGrid";
import { PricingTeaser } from "../blocks/PricingTeaser";
import { SovereigntyBand } from "../blocks/SovereigntyBand";
import { SurMesureBand } from "../blocks/SurMesureBand";
import { CtaLink } from "../ui/CtaLink";
import { Faq } from "../ui/Faq";
import { JsonLd } from "../ui/JsonLd";
import { PageJsonLd } from "../ui/PageJsonLd";
import { Section, SectionHeader } from "../ui/Section";
import { Mascot } from "../visuals/Mascot";
import { HomeHero } from "./HomeHero";
import { Audiences, BuiltByAgencies, FeatureDeepDives, HowItWorks, Problem, ProofBar } from "./HomeSections";
import { StackSavingsComparator } from "./StackSavingsComparator";

/** The homepage story in 13 sections: scattered tools, one console, proof, then a plan. */
export async function HomePage({ audience }: { audience: Audience | null }) {
  const { home, ui } = await dict();
  const locale = (await getLocale()) as Locale;
  return (
    <>
      <HomeHero audience={audience} />
      <ProofBar />
      <Problem />
      <StackSavingsComparator />
      <HowItWorks />
      <FeatureDeepDives />
      <Audiences audience={audience} />
      <SovereigntyBand />
      <IntegrationsGrid />
      <BuiltByAgencies />
      <PricingTeaser />
      <SurMesureBand />
      <Section aria-labelledby="faq-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.55fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader id="faq-title" title={home.faq.title} />
            <div data-reveal className="relative mt-10 overflow-clip rounded-[24px] bg-[linear-gradient(160deg,#eef2ff_0%,#f3eeff_55%,#fff1ea_100%)] p-6 ring-1 ring-inset ring-white md:p-7">
              <div className="absolute -bottom-3 right-4 w-20">
                <Mascot className="w-full" />
              </div>
              <p className="font-display text-xl text-ink">{home.faq.more.title}</p>
              <p className="mt-2 max-w-[15rem] text-[15px] leading-6 text-muted">{home.faq.more.body}</p>
              <CtaLink cta={{ kind: "demo" }} label={ui.cta.demo} section="home_faq" size="sm" variant="dark" className="mt-6" />
            </div>
          </div>
          <Faq items={home.faq.items} />
        </div>
      </Section>
      <CtaBand title={home.final.title} sub={home.final.sub} section="home_final" />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqPageSchema(home.faq.items)} />
      <PageJsonLd locale={locale} pathname="/" meta={home.meta} homeLabel="" />
    </>
  );
}
