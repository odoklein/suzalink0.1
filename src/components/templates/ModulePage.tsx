import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { claimState, type ClaimId } from "@/config/claims";
import { getContent, resolveText } from "@/content";
import type { ModuleSlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { CtaBand } from "../blocks/CtaBand";
import { FeatureBlock } from "../blocks/FeatureBlock";
import { FeatureGrid } from "../blocks/FeatureGrid";
import { PageHero } from "../blocks/PageHero";
import { SovereigntyBand } from "../blocks/SovereigntyBand";
import { Badge } from "../ui/Badge";
import { Faq } from "../ui/Faq";
import { IconTile } from "../ui/Icon";
import { JsonLd } from "../ui/JsonLd";
import { Visual } from "../ui/Media";
import { H2, Section, SectionHeader } from "../ui/Section";

type Params = { params: Promise<{ locale: string }> };

const ADDON_CLAIM: Record<"voip" | "sourcing" | "mailboxes", ClaimId | null> = {
  voip: "voip-addon",
  sourcing: "lead-credits",
  mailboxes: null,
};

/** One template for the seven module pages; copy lives in content/<locale>/modules.ts. */
export function modulePage(slug: ModuleSlug) {
  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    const m = getContent(locale).modules[slug];
    return pageMetadata(locale, m.path, m.meta);
  }

  async function Page({ params }: Params) {
    const locale = (await params).locale as Locale;
    setRequestLocale(locale);
    const { modules, ui, pricing } = getContent(locale);
    const m = modules[slug];
    const secondary = m.hero.cta === "trial" ? ({ kind: "demo" } as const) : ({ kind: "trial" } as const);

    const addon = m.addon ? pricing.addons[m.addon] : null;
    const addonState = m.addon ? (ADDON_CLAIM[m.addon] ? claimState(ADDON_CLAIM[m.addon]!) : "live") : "hidden";
    const addonBody = addon ? resolveText(addon.body) : null;

    return (
      <>
        <PageHero
          eyebrow={m.hero.eyebrow}
          title={m.hero.title}
          sub={m.hero.sub}
          primary={{ kind: m.hero.cta }}
          secondary={secondary}
          media={m.hero.media}
          section={`module_${slug}`}
        />

        <Section tone="surface" aria-labelledby="highlights-title">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeader id="highlights-title" title={ui.module.highlights} />
            <Badge>{ui.module.included}</Badge>
          </div>
          <FeatureGrid items={m.highlights} className="mt-12" />
        </Section>

        <Section containerClassName="space-y-24 md:space-y-32">
          {m.sections.map((block, i) => (
            <FeatureBlock key={block.title} block={block} reverse={i % 2 === 1} headingLevel="h2" />
          ))}
        </Section>

        {addon && addonState !== "hidden" ? (
          <Section tone="surface" aria-labelledby="addon-title">
            <div className="grid items-center gap-10 rounded-[28px] bg-white p-8 ring-1 ring-line md:p-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="flex items-center gap-2 text-small font-medium text-muted">
                  {ui.module.addon}
                  {addonState === "soon" ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
                </p>
                <H2 id="addon-title" className="mt-3 text-[28px] leading-9 md:text-[36px] md:leading-[44px]">
                  {addon.name}
                </H2>
                {addonBody ? <p className="mt-4 max-w-xl text-muted">{addonBody.text}</p> : null}
                <Link href={{ pathname: "/tarifs", hash: "options" }} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                  {ui.module.addonLink}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
              <div className="rounded-[20px] bg-surface p-8 text-center ring-1 ring-line">
                <p className="num font-display text-[56px] font-normal leading-none tracking-[-0.02em] text-ink">
                  {addon.price}
                </p>
                <p className="mt-3 text-sm text-muted">HT {addon.unit}</p>
              </div>
            </div>
          </Section>
        ) : null}

        {m.soon?.length ? (
          <Section aria-labelledby="soon-title">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]">
              <div className="flex items-center gap-5">
                <div className="size-24 shrink-0 overflow-hidden rounded-[20px] bg-surface ring-1 ring-line">
                  <Visual id="V14" transparent showTag={false} className="size-full" />
                </div>
                <H2 id="soon-title" className="text-[28px] leading-9">
                  {ui.module.soon}
                </H2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {m.soon.map((s) => (
                  <li key={s.title} className="rounded-[16px] border border-dashed border-line-strong p-5">
                    <p className="flex items-center gap-2 font-semibold text-ink">
                      {s.title} <Badge tone="soon">{ui.badges.soon}</Badge>
                    </p>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        ) : null}

        {slug === "ia" ? <SovereigntyBand tone="surface" /> : null}

        <Section tone={slug === "ia" ? "white" : "surface"} aria-labelledby="module-faq-title">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <H2 id="module-faq-title">{ui.module.faq}</H2>
            <Faq items={m.faq} />
          </div>
        </Section>

        <Section aria-labelledby="related-title">
          <SectionHeader id="related-title" title={ui.module.related} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {m.related.map((r) => {
              const other = modules[r];
              return (
                <li key={r}>
                  <Link href={other.path} className="lift group flex h-full items-start gap-4 rounded-[20px] bg-white p-6 ring-1 ring-line">
                    <IconTile name={other.icon} />
                    <span>
                      <span className="flex items-center gap-1.5 font-display text-lg font-normal text-ink">
                        {other.name}
                        <ArrowRight aria-hidden className="size-4 text-accent transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-1 block text-sm text-muted">{other.navBlurb}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <CtaBand
          title={m.hero.title}
          sub={ui.module.included}
          primary={{ kind: m.hero.cta }}
          secondary={secondary}
          section={`module_${slug}_final`}
        />

        <JsonLd
          data={breadcrumbSchema(locale, [
            { name: ui.breadcrumbs.home, href: "/" },
            { name: ui.breadcrumbs.features, href: "/fonctionnalites" },
            { name: m.name, href: m.path },
          ])}
        />
      </>
    );
  }

  return { generateMetadata, Page };
}
