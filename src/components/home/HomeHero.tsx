import { Check } from "lucide-react";
import type { Audience } from "@/config/audiences";
import { SCREENSHOTS } from "@/config/visuals";
import { dict, resolveTexts } from "@/content";
import { InView } from "../fx/InView";
import { CtaLink } from "../ui/CtaLink";
import { FitBox } from "../ui/FitBox";
import { KeyChip } from "../ui/KeyChip";
import { ScrollReveal } from "../ui/ScrollReveal";
import { Eyebrow } from "../ui/Section";
import { DASHBOARD_H, DASHBOARD_W, DashboardMock } from "./DashboardMock";
import { BookedCard, NextActionCard } from "./HeroCards";
import { HeroSky } from "./HeroSky";

/** Words rising one after the other; `from` continues the count across lines. */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  return text.split(" ").map((word, i) => (
    <span key={`${word}-${i}`}>
      {i > 0 ? " " : null}
      <span className="inline-block animate-rise" style={{ animationDelay: `${(from + i) * 70}ms` }}>
        {word}
      </span>
    </span>
  ));
}

/**
 * Headline under a dawn sky, the manager dashboard standing up on scroll, and
 * product moments floating around it: an outcome keyed in, a confirmed RDV,
 * the AI's next action.
 */
export async function HomeHero({ audience }: { audience: Audience | null }) {
  const { home, ui } = await dict();
  const h = home.hero;
  const sub = audience ? h.subByAudience[audience] : h.sub;
  const [first, second] = h.title;
  const words = second.split(" ");
  const last = words.pop() ?? "";
  const firstCount = first.split(" ").length;

  return (
    // Pulled up under the transparent header so the sky starts at the top edge.
    <section data-hero className="relative isolate -mt-[68px] overflow-hidden pt-[68px]">
      <HeroSky />
      <div className="container-site pt-12 text-center md:pt-20">
        <div className="animate-rise">
          <Eyebrow className="mb-7 justify-center">{h.eyebrow}</Eyebrow>
        </div>
        <h1 className="mx-auto max-w-4xl font-display text-h1m font-normal text-ink md:text-h1">
          <span className="block">
            <Words text={first} />
          </span>
          <span className="block">
            <Words text={words.join(" ")} from={firstCount} />{" "}
            <span className="relative inline-block animate-rise whitespace-nowrap" style={{ animationDelay: `${(firstCount + words.length) * 70}ms` }}>
              <span className="text-dawn -mb-[0.12em] inline-block pb-[0.12em]">{last}</span>
              <svg aria-hidden className="absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="hero-squiggle" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#3355ff" />
                    <stop offset="0.55" stopColor="#7a5cff" />
                    <stop offset="1" stopColor="#ff7a52" />
                  </linearGradient>
                </defs>
                <path
                  d="M2 8 C 40 2, 80 2, 110 6 S 170 11, 198 3"
                  fill="none"
                  stroke="url(#hero-squiggle)"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  className="[stroke-dasharray:1] motion-safe:animate-[thread-draw_900ms_var(--ease-out-expo)_650ms_both] motion-safe:[stroke-dashoffset:1]"
                />
              </svg>
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl animate-rise text-bodym text-muted [animation-delay:420ms] md:text-body">{sub}</p>

        {/* High-conversion value prop badges */}
        <div className="mx-auto mt-7 flex animate-rise flex-wrap items-center justify-center gap-2.5 [animation-delay:470ms]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint-soft px-3.5 py-1 text-xs font-semibold text-mint-ink shadow-xs">
            <span className="size-1.5 rounded-full bg-mint" />
            Lignes Allo &amp; OnOff connectées
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/5 px-3.5 py-1 text-xs font-semibold text-accent shadow-xs">
            <span className="size-1.5 rounded-full bg-accent" />
            Fiches de RDV Mistral AI (10s)
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-ink-soft shadow-xs">
            <span className="size-1.5 rounded-full bg-slate-400" />
            PostgreSQL &amp; Call Vault S3 Dédiés
          </span>
        </div>

        <div className="mt-8 flex animate-rise flex-wrap justify-center gap-3.5 [animation-delay:520ms]">
          <CtaLink cta={{ kind: "trial" }} label={ui.cta.trial} section="home_hero" size="lg" className="shadow-md shadow-accent/20" />
          <CtaLink cta={{ kind: "demo" }} label={ui.cta.demo} section="home_hero" size="lg" variant="secondary" />
        </div>
        <ul className="mt-6 flex animate-fade-in flex-wrap items-center justify-center gap-x-5 gap-y-2 text-small text-ink-soft [animation-delay:700ms]">
          {resolveTexts(ui.microcopy.trial).map((m) => (
            <li key={m.text} className="inline-flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-mint-soft text-mint-ink">
                <Check aria-hidden className="size-2.5" strokeWidth={3.5} />
              </span>
              {m.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="container-site pb-20 pt-14 md:pt-20 lg:pb-28">
        <div className="relative mx-auto max-w-[1120px] animate-fade-in [animation-delay:500ms] [animation-duration:1.2s]">
          <div className="relative px-2 sm:px-6 md:px-10">
            <ScrollReveal
              overlay={
                <>
                  <KeyChip
                    keyLabel={h.chip.key}
                    label={h.chip.label}
                    sub={h.chip.sub}
                    className="reveal-float absolute -bottom-8 left-4 [--fx:-40px] sm:left-10 md:-left-2 md:bottom-16"
                  />
                  <BookedCard className="absolute -right-4 top-10 hidden lg:block xl:-right-14" />
                  <NextActionCard className="absolute -right-2 bottom-24 hidden lg:block xl:-right-20" />
                </>
              }
            >
              <InView>
                <FitBox designWidth={DASHBOARD_W} designHeight={DASHBOARD_H}>
                  <DashboardMock />
                </FitBox>
              </InView>
              <span className="sr-only">{SCREENSHOTS.S4.alt}</span>
            </ScrollReveal>
          </div>
        </div>
      </div>
      {/* The horizon: the sky warms where the product stands. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-[linear-gradient(to_bottom,transparent,rgb(255_255_255/0.85))]" />
    </section>
  );
}
