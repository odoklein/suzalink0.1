import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { claimState, type ClaimId } from "@/config/claims";
import { HUE, hueVar, MODULE_HUE } from "@/config/hues";
import { getContent, resolveText } from "@/content";
import type { ModuleSlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { CtaBand } from "../blocks/CtaBand";
import { FeatureBlock } from "../blocks/FeatureBlock";
import { FeatureGrid } from "../blocks/FeatureGrid";
import { PageHero } from "../blocks/PageHero";
import { SovereigntyBand } from "../blocks/SovereigntyBand";
import { Stage } from "../blocks/Stage";
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

/** One template for the seven module pages; copy lives in content/<locale>/modules.ts. Each module wears its hue. */
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
    const hue = MODULE_HUE[slug];
    const h = HUE[hue];
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
          hue={hue}
        />

        <Section tone="surface" aria-labelledby="highlights-title">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeader id="highlights-title" title={ui.module.highlights} />
            <span className={cn("inline-flex items-center gap-1.5 self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold md:self-auto", h.soft, h.ink)}>
              <span aria-hidden className={cn("size-1.5 rounded-full", h.bg)} />
              {ui.module.included}
            </span>
          </div>
          <FeatureGrid items={m.highlights} className="mt-12" hue={hue} />
        </Section>

        <Section containerClassName="space-y-28 md:space-y-36">
          {m.sections.map((block, i) => (
            <FeatureBlock key={block.title} block={block} reverse={i % 2 === 1} headingLevel="h2" hue={hue} tone={slug === "ia" && i === 0 ? "night" : "day"} index={String(i + 1).padStart(2, "0")} />
          ))}
        </Section>

        {addon && addonState !== "hidden" ? (
          <Section tone="surface" aria-labelledby="addon-title">
            <Stage hue={hue} className="grid items-center gap-10 p-8 md:p-12 lg:grid-cols-[1.4fr_1fr]">
              <div data-reveal>
                <p className="flex items-center gap-2 text-small font-semibold uppercase tracking-[0.14em] text-muted">
                  {ui.module.addon}
                  {addonState === "soon" ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
                </p>
                <H2 id="addon-title" className="mt-3 text-[30px] leading-9 md:text-[40px] md:leading-[46px]">
                  {addon.name}
                </H2>
                {addonBody ? <p className="mt-4 max-w-xl text-muted">{addonBody.text}</p> : null}
                <Link href={{ pathname: "/tarifs", hash: "options" }} className="group mt-6 inline-flex items-center gap-1.5 font-semibold text-accent">
                  {ui.module.addonLink}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                </Link>
              </div>
              <div data-reveal="scale" className="ring-spin rounded-[24px]">
                <div className="rounded-[24px] bg-white p-8 text-center shadow-[var(--shadow-float)]">
                  <p className="num font-display text-[60px] font-normal leading-none tracking-[-0.025em] text-ink">{addon.price}</p>
                  <p className={cn("mx-auto mt-4 inline-flex rounded-full px-3 py-1 text-sm font-medium", h.soft, h.ink)}>HT {addon.unit}</p>
                </div>
              </div>
            </Stage>
          </Section>
        ) : null}

        {m.soon?.length ? (
          <Section aria-labelledby="soon-title">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr]">
              <div className="flex items-center gap-5" data-reveal>
                <div className="size-24 shrink-0 animate-float overflow-hidden rounded-[22px] bg-surface shadow-[var(--shadow-card)] ring-1 ring-line">
                  <Visual id="V14" transparent showTag={false} className="size-full" />
                </div>
                <H2 id="soon-title" className="text-[30px] leading-9">
                  {ui.module.soon}
                </H2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {m.soon.map((s, i) => (
                  <li
                    key={s.title}
                    data-reveal
                    style={vars({ "--i": i })}
                    className="relative overflow-clip rounded-[20px] border border-dashed border-line-strong bg-[linear-gradient(135deg,#ffffff,#f7f8fc)] p-5"
                  >
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
            <div data-reveal="blur" className="lg:sticky lg:top-32 lg:self-start">
              <H2 id="module-faq-title">{ui.module.faq}</H2>
            </div>
            <Faq items={m.faq} />
          </div>
        </Section>

        <Section aria-labelledby="related-title">
          <SectionHeader id="related-title" title={ui.module.related} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {m.related.map((r, i) => {
              const other = modules[r];
              const otherHue = MODULE_HUE[r];
              return (
                <li key={r} data-reveal style={vars({ "--i": i })}>
                  <Link
                    href={other.path}
                    data-spotlight
                    style={hueVar(otherHue)}
                    className="group flex h-full items-start gap-4 rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    <IconTile name={other.icon} hue={otherHue} className="transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110" />
                    <span>
                      <span className="flex items-center gap-1.5 font-display text-lg font-normal text-ink">
                        {other.name}
                        <ArrowRight aria-hidden className="size-4 text-accent transition-transform duration-300 ease-spring group-hover:translate-x-1" />
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
