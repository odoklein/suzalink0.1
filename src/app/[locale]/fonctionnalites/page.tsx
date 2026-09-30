import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { IntegrationsGrid } from "@/components/blocks/IntegrationsGrid";
import { PageHero } from "@/components/blocks/PageHero";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { ScreenshotFrame } from "@/components/ui/Media";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getContent, MODULE_ORDER } from "@/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/fonctionnalites">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/fonctionnalites", getContent(locale).featuresOverview.meta);
}

export default async function FeaturesPage({ params }: PageProps<"/[locale]/fonctionnalites">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { featuresOverview: f, modules, ui, home } = getContent(locale);

  return (
    <>
      <PageHero
        eyebrow={f.hero.eyebrow}
        title={f.hero.title}
        sub={f.hero.sub}
        primary={{ kind: "trial" }}
        secondary={{ kind: "demo" }}
        section="features"
        media={{ screenshot: "S1" }}
      />

      <Section tone="surface" aria-labelledby="modules-title">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader id="modules-title" title={ui.breadcrumbs.features} />
          <Badge>{f.included}</Badge>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {MODULE_ORDER.map((slug, i) => {
            const m = modules[slug];
            const wide = i === 0;
            return (
              <li key={slug} className={wide ? "md:col-span-2" : undefined}>
                <Link
                  href={m.path}
                  className={`lift group grid h-full gap-6 overflow-hidden rounded-[20px] bg-white p-7 ring-1 ring-line ${wide ? "md:grid-cols-[1fr_1.3fr] md:items-center" : ""}`}
                >
                  <div>
                    <IconTile name={m.icon} />
                    <h2 className="mt-5 font-display text-2xl font-normal text-ink">{m.name}</h2>
                    <p className="mt-2 text-muted">{m.hero.sub}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-semibold text-accent">
                      {ui.cta.learnMore}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  {wide && "screenshot" in m.hero.media ? <ScreenshotFrame id={m.hero.media.screenshot} sizes="600px" /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section aria-labelledby="chain-title">
        <SectionHeader id="chain-title" title={f.chain.title} sub={f.chain.sub} align="center" />
        <ol className="thread-draw relative mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3 md:flex-nowrap md:justify-between">
          <svg aria-hidden className="absolute inset-x-8 top-1/2 hidden h-1 -translate-y-1/2 md:block" viewBox="0 0 100 2" preserveAspectRatio="none">
            <path data-draw pathLength={1} d="M0 1 H100" stroke="var(--color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
          </svg>
          {f.chain.steps.map((step, i) => (
            <li
              key={step}
              className="relative rounded-full bg-white px-5 py-2.5 font-medium text-ink shadow-[var(--shadow-card)] ring-1 ring-line"
            >
              <span className="num mr-2 text-accent">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <IntegrationsGrid tone="surface" />
      <CtaBand title={home.final.title} sub={home.final.sub} section="features_final" />

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: ui.breadcrumbs.home, href: "/" },
          { name: ui.breadcrumbs.features, href: "/fonctionnalites" },
        ])}
      />
    </>
  );
}
