import type { Audience } from "@/config/audiences";
import { dict } from "@/content";
import { CtaBand } from "../blocks/CtaBand";
import { IntegrationsGrid } from "../blocks/IntegrationsGrid";
import { PricingTeaser } from "../blocks/PricingTeaser";
import { SovereigntyBand } from "../blocks/SovereigntyBand";
import { SurMesureBand } from "../blocks/SurMesureBand";
import { Faq } from "../ui/Faq";
import { JsonLd } from "../ui/JsonLd";
import { Section, SectionHeader } from "../ui/Section";
import { softwareApplicationSchema } from "@/lib/schema";
import { HomeHero } from "./HomeHero";
import { Audiences, BuiltByAgencies, FeatureDeepDives, HowItWorks, Problem, ProofBar } from "./HomeSections";

/** The homepage story in 13 sections: scattered tools, one console, proof, then a plan. */
export async function HomePage({ audience }: { audience: Audience | null }) {
  const { home } = await dict();
  return (
    <>
      <HomeHero audience={audience} />
      <ProofBar />
      <Problem />
      <HowItWorks />
      <FeatureDeepDives />
      <Audiences audience={audience} />
      <SovereigntyBand />
      <IntegrationsGrid />
      <BuiltByAgencies />
      <PricingTeaser />
      <SurMesureBand />
      <Section aria-labelledby="faq-title">
        <SectionHeader id="faq-title" title={home.faq.title} align="center" />
        <Faq items={home.faq.items} className="mx-auto mt-12 max-w-2xl" />
      </Section>
      <CtaBand title={home.final.title} sub={home.final.sub} section="home_final" />
      <JsonLd data={softwareApplicationSchema()} />
    </>
  );
}
