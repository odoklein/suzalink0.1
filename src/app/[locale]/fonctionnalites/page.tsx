import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { IntegrationsGrid } from "@/components/blocks/IntegrationsGrid";
import { PageHero } from "@/components/blocks/PageHero";
import { Stage } from "@/components/blocks/Stage";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { ScreenshotFrame } from "@/components/ui/Media";
import { Section, SectionHeader } from "@/components/ui/Section";
import { HUE, hueVar, MODULE_HUE, type Hue } from "@/config/hues";
import { getContent, MODULE_ORDER } from "@/content";
import type { ModuleSlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/fonctionnalites">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/fonctionnalites", getContent(locale).featuresOverview.meta);
}

/** Bento layout: calls and team pilotage wide with their product shot, AI under a night sky. */
const WIDE: Partial<Record<ModuleSlug, "S1" | "S4">> = { appels: "S1", pilotage: "S4" };
const CHAIN_HUES: Hue[] = ["sun", "coral", "azure", "mint", "accent"];

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
        hue="coral"
      />

      <Section tone="surface" aria-labelledby="modules-title">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader id="modules-title" title={ui.breadcrumbs.features} />
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent-tint px-3 py-1 text-xs font-semibold text-accent-ink md:self-auto">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {f.included}
          </span>
        </div>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULE_ORDER.map((slug, i) => {
            const m = modules[slug];
            const hue = MODULE_HUE[slug];
            const h = HUE[hue];
            const shot = WIDE[slug];
            const night = slug === "ia";
            return (
              <li key={slug} data-reveal style={vars({ "--i": i % 3 })} className={cn(shot && "md:col-span-2")}>
                <Link
                  href={m.path}
                  data-spotlight
                  style={hueVar(hue)}
                  className={cn(
                    "group relative isolate flex h-full flex-col overflow-clip rounded-[28px] shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
                    night ? "bg-night text-white ring-white/10" : "bg-white ring-line",
                    shot && "lg:grid lg:grid-cols-[1fr_1.25fr]",
                  )}
                >
                  {/* Art: the module's icon in a halo of its hue, or its product shot for the wide cards */}
                  {shot ? null : (
                    <div aria-hidden className="relative h-44 overflow-clip">
                      {night ? (
                        <>
                          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,#1d2a72,#0b1230_60%,#060a1a)]" />
                          <div className="stars absolute inset-0 opacity-80" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--hue)_14%,white),white)]" />
                      )}
                      <div className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--hue)_18%,transparent)]" />
                      <div className="absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--hue)_28%,transparent)] transition-transform duration-700 ease-out-expo group-hover:scale-110" />
                      <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--hue)_40%,transparent),transparent)] blur-md" />
                      <span
                        className={cn(
                          "absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[24px] shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_18px_36px_-14px_var(--hue)] ring-1 ring-inset transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110",
                          night ? "bg-white/10 text-white ring-white/20 backdrop-blur" : cn(h.soft, h.text, h.ring),
                        )}
                      >
                        <Icon name={m.icon} className="size-9" />
                      </span>
                    </div>
                  )}
                  <div className={cn("relative flex flex-1 flex-col p-7", shot && "lg:justify-center lg:p-10")}>
                    {shot ? (
                      <span className={cn("mb-5 grid size-11 place-items-center rounded-[14px] ring-1 ring-inset", h.soft, h.text, h.ring)}>
                        <Icon name={m.icon} className="size-5" />
                      </span>
                    ) : null}
                    <h2 className={cn("font-display text-[26px] font-normal leading-8", night ? "text-white" : "text-ink")}>{m.name}</h2>
                    <p className={cn("mt-2 flex-1", night ? "text-white/70" : "text-muted")}>{m.hero.sub}</p>
                    <span className={cn("mt-6 inline-flex items-center gap-1.5 font-semibold", night ? "text-white" : "text-accent")}>
                      {ui.cta.learnMore}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                    </span>
                  </div>
                  {shot ? (
                    <Stage hue={hue} className="m-3 mt-0 overflow-clip rounded-[22px] pl-6 pt-6 lg:m-3 lg:ml-0">
                      <div className="-mb-10 -mr-10 transition-transform duration-700 ease-out-expo group-hover:-translate-x-2 group-hover:-translate-y-2">
                        <ScreenshotFrame id={shot} sizes="600px" />
                      </div>
                    </Stage>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section aria-labelledby="chain-title">
        <SectionHeader id="chain-title" title={f.chain.title} sub={f.chain.sub} align="center" />
        <ol className="how relative mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-3 md:flex-nowrap md:justify-between">
          <span aria-hidden className="absolute inset-x-10 top-1/2 hidden h-[2px] -translate-y-1/2 rounded-full bg-[#e8ebf0] md:block">
            <span className="how-bar-x absolute inset-0 rounded-full bg-[linear-gradient(90deg,#1f93ff,#3355ff,#7a5cff)]" />
          </span>
          {f.chain.steps.map((step, i) => {
            const hue = CHAIN_HUES[i % CHAIN_HUES.length];
            const h = HUE[hue];
            return (
              <li
                key={step}
                className="how-step relative inline-flex items-center gap-2.5 rounded-full bg-white py-2 pl-2 pr-5 font-medium text-ink shadow-[var(--shadow-card)] ring-1 ring-line"
                style={{ ...vars({ "--i": i }), ...hueVar(hue) }}
              >
                <span className={cn("num grid size-7 place-items-center rounded-full text-sm font-bold text-white", h.bg)}>{i + 1}</span>
                <span className="how-text">{step}</span>
              </li>
            );
          })}
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
