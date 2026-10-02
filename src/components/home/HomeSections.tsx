import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Audience } from "@/config/audiences";
import { FEATURES } from "@/config/claims";
import { HUE, hueVar, type Hue } from "@/config/hues";
import { site } from "@/config/site";
import { PEOPLE, personSlug, VISUALS } from "@/config/visuals";
import { dict, resolveText, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { FeatureBlock } from "../blocks/FeatureBlock";
import { LogoBar } from "../blocks/LogoBar";
import { StatCounter } from "../blocks/StatCounter";
import { Badge } from "../ui/Badge";
import { CornerMarks } from "../ui/CornerMarks";
import { ScreenshotFrame, Visual } from "../ui/Media";
import { H2, Lead, Section, SectionHeader, twoTone } from "../ui/Section";
import { UntangleScene } from "./UntangleScene";

export async function ProofBar() {
  const { home } = await dict();
  const stats = visibleItems(home.proof.stats);
  return (
    <section aria-label={home.proof.title} className="relative border-y border-line bg-white">
      <CornerMarks />
      <div className="container-site grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-center md:py-12">
        <div>
          <p className="flex items-center gap-2 text-small font-medium text-muted">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
              <span className="relative size-2 rounded-full bg-mint" />
            </span>
            {home.proof.title}
          </p>
          <LogoBar names={home.proof.logos} className="mt-4" />
        </div>
        <dl className="grid grid-cols-2 gap-6 md:justify-self-end md:gap-0 md:divide-x md:divide-line">
          {stats.map((s) => {
            const value = (
              <StatCounter
                value={s.value}
                suffix={s.format === "percent" ? `${String.fromCharCode(0xa0)}%` : ""}
                className="text-dawn font-display text-[40px] font-normal leading-none tracking-[-0.02em] md:text-[44px]"
              />
            );
            return (
              <div key={s.label} className="md:px-10 md:first:pl-0 md:last:pr-0">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  {s.link === "status" ? (
                    <a href={site.statusUrl} className="rounded hover:opacity-80">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                  <span className="mt-2 block text-small text-muted lg:whitespace-nowrap">{s.label}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export async function Problem() {
  const { home } = await dict();
  const p = home.problem;
  return (
    <Section tone="surface" aria-labelledby="problem-title" className="overflow-clip">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <div data-reveal="blur">
            <H2 id="problem-title">{p.title}</H2>
          </div>
          <div data-reveal style={vars({ "--i": 1 })}>
            <Lead className="mt-6">{p.body}</Lead>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {p.tools.map((tool, i) => (
              <li
                key={tool}
                data-strike
                style={vars({ "--i": i })}
                className="rounded-full bg-white px-3.5 py-1.5 text-sm text-muted shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line"
              >
                <s className="no-underline">{tool}</s>
              </li>
            ))}
          </ul>
          {FEATURES.stackCalculator ? (
            <p className="mt-8 font-semibold text-accent">
              {p.stackLink} <ArrowRight aria-hidden className="inline size-4" />
            </p>
          ) : null}
        </div>
        <UntangleScene tools={p.tools} label={VISUALS.V2.alt} />
      </div>
    </Section>
  );
}

/** The four steps, each in its module's hue: lists (sun), calls (coral), meetings (mint), results (blue). */
const STEP_HUES: Hue[] = ["sun", "coral", "mint", "accent"];

export async function HowItWorks() {
  const { home } = await dict();
  const steps = home.how.steps.flatMap((s) => {
    const body = resolveText(s.body);
    return body ? [{ ...s, bodyText: body.text }] : [];
  });
  return (
    <Section aria-labelledby="how-title">
      <SectionHeader id="how-title" title={home.how.title} align="center" />
      <ol className="how relative mt-16 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
        {/* The Suzalink line joining the four steps; each step lights up in its own hue as it arrives */}
        <svg aria-hidden className="absolute left-[12.5%] top-[60px] hidden h-6 w-3/4 overflow-visible md:block" viewBox="0 0 300 24" preserveAspectRatio="none">
          <defs>
            <linearGradient id="how-grad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#1f93ff" />
              <stop offset="0.5" stopColor="#3355ff" />
              <stop offset="1" stopColor="#7a5cff" />
            </linearGradient>
          </defs>
          <path d="M0 12 C 40 2, 60 22, 100 12 S 160 2, 200 12 S 260 22, 300 12" fill="none" stroke="#e8ebf0" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <path
            className="how-line"
            pathLength={1}
            d="M0 12 C 40 2, 60 22, 100 12 S 160 2, 200 12 S 260 22, 300 12"
            fill="none"
            stroke="url(#how-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span aria-hidden className="absolute bottom-8 left-[55px] top-8 w-[2px] rounded-full bg-[#e8ebf0] md:hidden">
          <span className="how-bar absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,#1f93ff,#3355ff,#7a5cff)]" />
        </span>
        {steps.map((step, i) => {
          const hue = STEP_HUES[i % STEP_HUES.length];
          return (
            <li key={step.title} className="how-step relative flex gap-5 md:flex-col md:items-center md:text-center" style={{ ...vars({ "--i": i }), ...hueVar(hue) }}>
              <div className="relative shrink-0">
                <div aria-hidden className="how-glow absolute -inset-4 rounded-[40px] bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--hue)_32%,transparent),transparent)] blur-lg" />
                <div className="how-tile relative size-28 overflow-hidden rounded-[26px] bg-white shadow-[0_1px_2px_rgb(11_18_32/0.05),0_18px_36px_-18px_color-mix(in_srgb,var(--hue)_55%,transparent)] ring-1 ring-line md:size-32">
                  <Visual id={step.visual} transparent showTag={false} className="size-full" />
                </div>
                <span className={cn("num absolute -right-2.5 -top-2.5 inline-flex size-8 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-[0_6px_14px_-6px_var(--hue)] ring-4 ring-white", HUE[hue].bg)}>
                  {i + 1}
                </span>
              </div>
              <div className="how-text pt-2 md:pt-7">
                <h3 className="font-display text-[22px] font-normal leading-7 text-ink">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[17rem] text-[15px] leading-6 text-muted">{step.bodyText}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Calls (coral), emails (azure), AI under a night sky (violet), then results (blue). */
const DIVES: { hue: Hue; tone: "day" | "night"; visual: "V4" | "V5" | "V6" | "V7" }[] = [
  { hue: "coral", tone: "day", visual: "V4" },
  { hue: "azure", tone: "day", visual: "V5" },
  { hue: "violet", tone: "night", visual: "V6" },
  { hue: "accent", tone: "day", visual: "V7" },
];

export async function FeatureDeepDives() {
  const { home } = await dict();
  return (
    <Section tone="surface" containerClassName="space-y-28 md:space-y-40">
      {home.features.map((block, i) => {
        // Calls, emails and AI stack wide; the last block goes side by side to break the rhythm.
        const stacked = i < 3;
        const look = DIVES[i % DIVES.length];
        return (
          <FeatureBlock
            key={block.title}
            block={block}
            layout={stacked ? "stacked" : "split"}
            reverse={!stacked}
            headingLevel="h2"
            hue={look.hue}
            tone={look.tone}
            index={String(i + 1).padStart(2, "0")}
            extra={
              <>
                {i === 3 ? (
                  <div className="absolute -bottom-12 -right-5 hidden w-[52%] sm:block" data-reveal="right">
                    <ScreenshotFrame id="S6" sizes="360px" chrome={false} className="shadow-[var(--shadow-float)]" />
                  </div>
                ) : null}
                <div aria-hidden className={cn("absolute hidden md:block", stacked ? "-right-5 -top-12" : "-left-8 -top-10")}>
                  <Visual
                    id={look.visual}
                    showTag={false}
                    className="size-32 animate-float rounded-[26px] shadow-[var(--shadow-float)] ring-1 ring-white/70 [animation-duration:8s]"
                  />
                </div>
              </>
            }
          />
        );
      })}
    </Section>
  );
}

const AUDIENCE_HUE: Record<Audience, Hue> = { solo: "sun", equipes: "azure", agences: "violet" };

export async function Audiences({ audience }: { audience: Audience | null }) {
  const { home, ui } = await dict();
  const a = home.audiences;
  const cards = [...a.cards].sort((x, y) => (x.audience === audience ? -1 : y.audience === audience ? 1 : 0));
  return (
    <Section aria-labelledby="audiences-title">
      <SectionHeader id="audiences-title" title={a.title} sub={a.sub} />
      <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3">
        {cards.map((card, i) => {
          const hue = AUDIENCE_HUE[card.audience];
          const h = HUE[hue];
          return (
            <li key={card.audience} data-reveal style={vars({ "--i": i })}>
              <Link
                href={card.href}
                data-spotlight
                data-tilt
                style={hueVar(hue)}
                className="group flex h-full flex-col rounded-[24px] bg-white shadow-[var(--shadow-card)] ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-float)]"
                data-cta="audience"
                data-cta-section="home_audiences"
                data-cta-label={card.title}
                data-cta-plan={card.audience}
              >
                <div className="relative overflow-hidden rounded-t-[24px] border-b border-line">
                  <Visual id={card.visual} showTag={false} className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]" />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--hue)_22%,transparent),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <span className={cn("self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", h.soft, h.ink, h.ring)}>{card.plan}</span>
                  <h3 className="mt-4 font-display text-[22px] font-normal leading-7 text-ink">{twoTone(card.title)}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-6 text-muted">{card.body}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    {ui.cta.learnMore}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export async function BuiltByAgencies() {
  const { home } = await dict();
  const b = home.built;
  // Split on plain spaces only: the no-break spaces of French typography stay inside their word.
  const words = b.quote.split(" ");
  return (
    <Section tone="surface" aria-labelledby="built-title" className="overflow-clip">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.12),transparent)] blur-2xl" />
      <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div data-reveal="blur" className="lg:sticky lg:top-32 lg:self-start">
          <H2 id="built-title">{b.title}</H2>
        </div>
        <div>
          <blockquote className="read-reveal relative">
            <svg aria-hidden viewBox="0 0 48 36" className="h-9 w-12">
              <defs>
                <linearGradient id="quote-mark" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#3355ff" />
                  <stop offset="1" stopColor="#ff7a52" />
                </linearGradient>
              </defs>
              <path
                d="M0 36V22C0 9.6 6.2 2.2 18.6 0l1.8 4.6C13.6 6.6 10.2 10.8 10 17h9v19H0Zm27.6 0V22C27.6 9.6 33.8 2.2 46.2 0L48 4.6C41.2 6.6 37.8 10.8 37.6 17h9v19h-19Z"
                fill="url(#quote-mark)"
              />
            </svg>
            <p
              className="mt-6 font-display text-[24px] font-normal leading-[34px] tracking-[-0.012em] text-ink md:text-[31px] md:leading-[43px]"
              style={vars({ "--n": words.length })}
            >
              {words.map((word, i) => (
                <span key={`${word}-${i}`}>
                  <span data-w style={vars({ "--w": i })}>
                    {word}
                  </span>{" "}
                </span>
              ))}
            </p>
          </blockquote>
          <ul className="mt-12 grid gap-3 sm:grid-cols-3">
            {b.people.map((person, i) => (
              <li
                key={person.name}
                data-reveal
                style={vars({ "--i": i })}
                className="flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-[var(--shadow-card)] ring-1 ring-line sm:flex-col sm:items-start sm:p-4"
              >
                <PersonPhoto name={person.name} />
                <div>
                  <p className="font-semibold text-ink">{person.name}</p>
                  <p className="text-sm text-muted">{person.role}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/a-propos" className="group mt-10 inline-flex items-center gap-1.5 font-semibold text-accent">
            {b.link}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/**
 * A real portrait when one is set in `PEOPLE` (src/config/visuals.ts), else the
 * person's initials. Portraits live in public/people/, same light grey background.
 */
export function PersonPhoto({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const src = PEOPLE[personSlug(name)];
  const box = size === "lg" ? "size-28" : "size-16";
  if (src) {
    return (
      <span className={cn("relative inline-block shrink-0 overflow-hidden rounded-[16px] bg-[#eceef2] ring-1 ring-line", box)}>
        {/* The name is printed beside the portrait, so the image itself stays decorative. */}
        <Image src={src} alt="" fill sizes={size === "lg" ? "112px" : "64px"} className="object-cover" />
      </span>
    );
  }
  const initials = name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3);
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[16px] bg-[#eceef2] font-sans font-bold text-ink/50 ring-1 ring-line",
        box,
        size === "lg" ? "text-2xl" : "text-lg",
      )}
    >
      {initials}
    </span>
  );
}
