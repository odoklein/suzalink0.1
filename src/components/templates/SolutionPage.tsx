import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HUE, hueVar, MODULE_HUE, SOLUTION_HUE } from "@/config/hues";
import { PLANS } from "@/config/pricing.config";
import { getContent, resolveText } from "@/content";
import type { Cta, SolutionSlug } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { euros } from "@/lib/pricing/format";
import { vars } from "@/lib/style";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { Bullets } from "../blocks/Bullets";
import { CtaBand } from "../blocks/CtaBand";
import { PageHero } from "../blocks/PageHero";
import { Stage } from "../blocks/Stage";
import { Faq } from "../ui/Faq";
import { CtaLink } from "../ui/CtaLink";
import { IconTile } from "../ui/Icon";
import { JsonLd } from "../ui/JsonLd";
import { Visual } from "../ui/Media";
import { H2, Section, SectionHeader } from "../ui/Section";

type Params = { params: Promise<{ locale: string }> };

/** One template for the three persona pages; copy lives in content/<locale>/solutions.ts. Each persona wears its hue. */
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
    const hue = SOLUTION_HUE[slug];
    const h = HUE[hue];
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
          hue={hue}
          aside={
            <Stage hue={hue} className="p-3 sm:p-5">
              <div className="overflow-hidden rounded-[22px] shadow-[var(--shadow-float)] ring-1 ring-white/70">
                <Visual id={s.visual} priority showTag={false} />
              </div>
            </Stage>
          }
        />

        <Section tone="surface" aria-labelledby="pains-title">
          <SectionHeader id="pains-title" title={ui.solution.pains} />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {s.pains.map((p, i) => (
              <li
                key={p.title}
                data-reveal
                style={{ ...vars({ "--i": i }), ...hueVar(hue) }}
                className="relative overflow-clip rounded-[24px] bg-white p-7 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line"
              >
                <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", h.bg)} style={{ opacity: 0.25 + i * 0.25 }} />
                <span className="num block bg-[linear-gradient(180deg,var(--hue),color-mix(in_srgb,var(--hue)_30%,white))] bg-clip-text font-display text-[56px] leading-none text-transparent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-[22px] font-normal leading-7 text-ink">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section aria-labelledby="day-title">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeader id="day-title" title={s.day.title} sub={s.day.sub} />
            </div>
            {/* The day as a thread: each step lights up as the line reaches it (.how in globals.css). */}
            <ol className="how relative space-y-4" style={hueVar(hue)}>
              <span aria-hidden className="absolute bottom-10 left-[27px] top-10 w-[2px] rounded-full bg-[#e8ebf0]">
                <span className="how-bar absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,#1f93ff,#3355ff,#7a5cff)]" />
              </span>
              {s.day.steps.map((step, i) => {
                const body = resolveText(step.body);
                return (
                  <li key={step.title} className="how-step relative grid grid-cols-[56px_1fr] gap-4" style={vars({ "--i": i })}>
                    <span aria-hidden className="relative mt-3 grid size-14 place-items-center">
                      <span className="how-glow absolute inset-0 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--hue)_35%,transparent),transparent)] blur-sm" />
                      <span className={cn("relative size-4 rounded-full border-[3px] bg-white", "border-[color:var(--hue)]")} />
                    </span>
                    <div className="how-text rounded-[20px] bg-white p-5 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line">
                      <p className={cn("num inline-flex rounded-full px-2.5 py-0.5 text-small font-semibold", h.soft, h.ink)}>{step.time}</p>
                      <h3 className="mt-2 font-display text-xl font-normal text-ink">{step.title}</h3>
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
            {s.features.map((f, i) => {
              const m = modules[f.module];
              const mHue = MODULE_HUE[f.module];
              const body = resolveText(f.body);
              return (
                <li key={f.title} data-reveal style={vars({ "--i": i % 4 })}>
                  <Link
                    href={m.path}
                    data-spotlight
                    style={hueVar(mHue)}
                    className="group flex h-full flex-col rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                  >
                    <IconTile name={m.icon} hue={mHue} className="transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110" />
                    <h3 className="mt-5 font-display text-lg font-normal text-ink">{f.title}</h3>
                    {body ? <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{body.text}</p> : null}
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                      {m.name}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section aria-labelledby="plan-title">
          <Stage hue={hue} className="grid items-center gap-10 p-8 md:p-14 lg:grid-cols-[1.3fr_1fr]">
            <div data-reveal>
              <p className={cn("inline-flex rounded-full px-3 py-1 text-small font-semibold", h.soft, h.ink)}>{ui.solution.plan}</p>
              <H2 id="plan-title" className="mt-4 text-[30px] leading-9 md:text-[40px] md:leading-[46px]">
                {s.plan_pitch.title}
              </H2>
              <p className="mt-4 max-w-xl text-muted">{s.plan_pitch.body}</p>
              <Bullets items={s.plan_pitch.bullets} hue={hue} className="mt-7" />
            </div>
            <div data-reveal="scale" className="ring-spin rounded-[24px] [--ring-width:2px]">
              <div className="rounded-[24px] bg-white p-8 shadow-[var(--shadow-float)]">
                <p className="flex items-center gap-2.5 font-display text-[22px] font-normal text-ink">
                  <span aria-hidden className={cn("size-2.5 rounded-full", h.bg)} />
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-muted">{pricing.plans[s.plan].for}</p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  <span className="num font-display text-[52px] font-normal leading-none tracking-[-0.025em] text-ink">{euros(plan.price.monthly)}</span>
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
                <Link href="/tarifs" className="group mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-accent">
                  {ui.solution.seePricing}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Stage>
        </Section>

        <Section tone="surface" aria-labelledby="solution-faq-title">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div data-reveal="blur" className="lg:sticky lg:top-32 lg:self-start">
              <H2 id="solution-faq-title">{ui.solution.faq}</H2>
            </div>
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
