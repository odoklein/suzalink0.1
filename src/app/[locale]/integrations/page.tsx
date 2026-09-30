import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { IntegrationTile } from "@/components/blocks/IntegrationTile";
import { PageHero } from "@/components/blocks/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { getContent, visibleItems } from "@/content";
import type { IntegrationCategory } from "@/content/fr/integrations";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/integrations">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/integrations", getContent(locale).integrationsPage.meta);
}

export default async function IntegrationsPage({ params }: PageProps<"/[locale]/integrations">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { integrationsPage: p, integrations, integrationCategories, ui } = getContent(locale);
  const items = visibleItems(integrations);
  const categories = (Object.keys(integrationCategories) as IntegrationCategory[]).filter((c) => items.some((i) => i.category === c));

  return (
    <>
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} sub={p.hero.sub} primary={{ kind: "trial" }} secondary={{ kind: "demo" }} section="integrations" />

      <Section tone="surface" containerClassName="space-y-14">
        {categories.map((cat) => (
          <div key={cat} className="grid gap-6 lg:grid-cols-[220px_1fr]">
            <h2 className="font-display text-xl font-normal text-ink">{integrationCategories[cat]}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((i) => i.category === cat)
                .map((i) => (
                  <li key={i.id}>
                    <IntegrationTile name={i.name} line={i.line} soon={i.soon} soonLabel={ui.badges.soon} className="h-full" />
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <p className="text-sm text-muted">{p.logoNote}</p>
      </Section>

      <CtaBand title={p.missing.title} sub={p.missing.body} primary={{ kind: "demo" }} secondary={{ kind: "trial" }} section="integrations_final" />

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: ui.breadcrumbs.home, href: "/" },
          { name: ui.header.integrations, href: "/integrations" },
        ])}
      />
    </>
  );
}
