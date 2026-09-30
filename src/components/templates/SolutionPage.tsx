import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PLANS } from "@/config/pricing.config";
import { getContent, resolveText } from "@/content";
import type { Cta, SolutionSlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { euros } from "@/lib/pricing/format";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { Bullets } from "../blocks/Bullets";
import { CtaBand } from "../blocks/CtaBand";
import { PageHero } from "../blocks/PageHero";
import { Faq } from "../ui/Faq";
import { CtaLink } from "../ui/CtaLink";
import { IconTile } from "../ui/Icon";
import { JsonLd } from "../ui/JsonLd";
import { Visual } from "../ui/Media";
import { H2, Section, SectionHeader } from "../ui/Section";

type Params = { params: Promise<{ locale: string }> };

/** One template for the three persona pages; copy lives in content/<locale>/solutions.ts. */
export function solutionPage(slug: SolutionSlug) {
  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    const s = getContent(locale).solutions[slug];
    return pageMetadata(locale, s.path, s.meta);
  }

  async function Page({ params }: Params) {
    const locale = (await params).locale as Locale;
    setRequestLocale(locale);
    const { solutions, modules, ui, pricing } = getContent(locale);
    const s = solutions[slug];
    const plan = PLANS[s.plan];
    const primary: Cta = s.hero.cta === "trial" ? { kind: "trial" } : { kind: "demo" };
    const secondary: Cta = s.hero.cta === "trial" ? { kind: "demo" } : { kind: "trial" };
    const planCta: Cta = plan.start === "trial" ? { kind: "trial" } : { kind: "signup", plan: s.plan };

    return (
      <>
        <PageHero
          eyebrow={s.hero.eyebrow}
          title={s.hero.title}
          sub={s.hero.sub}
          primary={primary}
          secondary={secondary}
          section={`solution_${slug}`}
          aside={<Visual id={s.visual} priority className="rounded-[28px] ring-1 ring-line" />}
        />

        <Section tone="surface" aria-labelledby="pains-title">
          <SectionHeader id="pains-title" title={ui.solution.pains} />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {s.pains.map((p, i) => (
              <li key={p.title} className="rounded-[20px] bg-white p-7 ring-1 ring-line">
                <span className="num inline-flex size-8 items-center justify-center rounded-full bg-surface text-sm font-semibold text-muted ring-1 ring-line">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl font-normal text-ink">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section aria-labelledby="day-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <SectionHeader id="day-title" title={s.day.title} sub={s.day.sub} />
            <ol className="thread-draw relative space-y-8">
              <svg aria-hidden className="absolute bottom-4 left-[7px] top-4 w-0.5" viewBox="0 0 2 100" preserveAspectRatio="none">
                <path data-draw pathLength={1} d="M1 0 V100" stroke="var(--color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
              </svg>
              {s.day.steps.map((step) => {
                const body = resolveText(step.body);
                return (
                  <li key={step.title} className="relative grid grid-cols-[16px_1fr] gap-5">
                    <span aria-hidden className="relative mt-1.5 size-4 rounded-full border-[3px] border-accent bg-white" />
                    <div>
                      <p className="num text-small font-semibold text-accent">{step.time}</p>
                      <h3 className="mt-1 font-display text-xl font-normal text-ink">{step.title}</h3>
                      {body ? <p className="mt-1 text-muted">{body.text}</p> : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </Section>

        <Section tone="surface" aria-labelledby="features-title">
          <SectionHeader id="features-title" title={ui.solution.features} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.features.map((f) => {
              const m = modules[f.module];
              const body = resolveText(f.body);
              return (
                <li key={f.title}>
                  <Link href={m.path} className="lift group flex h-full flex-col rounded-[20px] bg-white p-6 ring-1 ring-line">
                    <IconTile name={m.icon} />
                    <h3 className="mt-5 font-display text-lg font-normal text-ink">{f.title}</h3>
                    {body ? <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{body.text}</p> : null}
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      {m.name}
                      <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section aria-labelledby="plan-title">
          <div className="grid items-center gap-10 rounded-[28px] bg-accent-tint p-8 ring-1 ring-accent/20 md:p-14 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-small font-medium text-accent">{ui.solution.plan}</p>
              <H2 id="plan-title" className="mt-3 text-[28px] leading-9 md:text-[36px] md:leading-[44px]">
                {s.plan_pitch.title}
              </H2>
              <p className="mt-4 max-w-xl text-muted">{s.plan_pitch.body}</p>
              <Bullets items={s.plan_pitch.bullets} className="mt-7" />
            </div>
            <div className="rounded-[20px] bg-white p-8 ring-1 ring-line">
              <p className="font-display text-xl font-normal text-ink">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">{pricing.plans[s.plan].for}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="num font-display text-[48px] font-normal leading-none tracking-[-0.02em] text-ink">{euros(plan.price.monthly)}</span>
                <span className="text-sm text-muted">{pricing.card.perMonth}</span>
              </p>
              <p className="mt-3 text-sm text-muted">{pricing.plans[s.plan].start}</p>
              <CtaLink
                cta={planCta}
                label={plan.start === "trial" ? ui.cta.trial : ui.cta.demo}
                section={`solution_${slug}_plan`}
                size="lg"
                className="mt-7 w-full"
              />
              <Link href="/tarifs" className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                {ui.solution.seePricing}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        </Section>

        <Section tone="surface" aria-labelledby="solution-faq-title">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <H2 id="solution-faq-title">{ui.solution.faq}</H2>
            <Faq items={s.faq} />
          </div>
        </Section>

        <CtaBand
          title={s.hero.cta === "trial" ? ui.solution.finalTrial : ui.solution.finalDemo}
          sub={s.hero.cta === "trial" ? ui.solution.finalSubTrial : ui.solution.finalSub}
          primary={primary}
          secondary={secondary}
          section={`solution_${slug}_final`}
        />

        <JsonLd
          data={breadcrumbSchema(locale, [
            { name: ui.breadcrumbs.home, href: "/" },
            { name: s.name, href: s.path },
          ])}
        />
      </>
    );
  }

  return { generateMetadata, Page };
}
