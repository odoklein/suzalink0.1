import { ArrowRight, Quote } from "lucide-react";
import type { Audience } from "@/config/audiences";
import { FEATURES } from "@/config/claims";
import { site } from "@/config/site";
import { dict, resolveText, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { FeatureBlock } from "../blocks/FeatureBlock";
import { LogoBar } from "../blocks/LogoBar";
import { StatCounter } from "../blocks/StatCounter";
import { Badge } from "../ui/Badge";
import { ScreenshotFrame, Visual } from "../ui/Media";
import { H2, Lead, Section, SectionHeader } from "../ui/Section";

export async function ProofBar() {
  const { home } = await dict();
  const stats = visibleItems(home.proof.stats);
  return (
    <section aria-label={home.proof.title} className="border-y border-line bg-white">
      <div className="container-site grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="text-small font-medium text-muted">{home.proof.title}</p>
          <LogoBar names={home.proof.logos} className="mt-4" />
        </div>
        <dl className="grid grid-cols-2 gap-6 md:justify-self-end">
          {stats.map((s) => {
            const value = (
              <StatCounter
                value={s.value}
                suffix={s.format === "percent" ? `${String.fromCharCode(0xa0)}%` : ""}
                className="font-display text-[36px] font-normal leading-none tracking-[-0.02em] text-ink"
              />
            );
            return (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  {s.link === "status" ? (
                    <a href={site.statusUrl} className="rounded hover:text-accent">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                  <span className="mt-2 block text-small text-muted">{s.label}</span>
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
    <Section tone="surface" aria-labelledby="problem-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <H2 id="problem-title">{p.title}</H2>
          <Lead className="mt-6">{p.body}</Lead>
          <ul className="mt-8 flex flex-wrap gap-2">
            {p.tools.map((tool) => (
              <li key={tool} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-muted line-through decoration-line-strong ring-1 ring-line">
                {tool}
              </li>
            ))}
          </ul>
          {FEATURES.stackCalculator ? (
            <p className="mt-8 font-semibold text-accent">
              {p.stackLink} <ArrowRight aria-hidden className="inline size-4" />
            </p>
          ) : null}
        </div>
        <Visual id="V2" className="rounded-[24px] ring-1 ring-line" />
      </div>
    </Section>
  );
}

export async function HowItWorks() {
  const { home } = await dict();
  const steps = home.how.steps.flatMap((s) => {
    const body = resolveText(s.body);
    return body ? [{ ...s, bodyText: body.text }] : [];
  });
  return (
    <Section aria-labelledby="how-title">
      <SectionHeader id="how-title" title={home.how.title} align="center" />
      <ol className="thread-draw relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        {/* The Suzalink line joining the four steps */}
        <svg aria-hidden className="absolute left-[12.5%] top-14 hidden h-6 w-3/4 md:block" viewBox="0 0 300 24" preserveAspectRatio="none">
          <path
            data-draw
            pathLength={1}
            d="M0 12 C 40 2, 60 22, 100 12 S 160 2, 200 12 S 260 22, 300 12"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg aria-hidden className="absolute bottom-8 left-14 top-8 w-4 md:hidden" viewBox="0 0 16 300" preserveAspectRatio="none">
          <path data-draw pathLength={1} d="M8 0 V300" fill="none" stroke="var(--color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
            <div className="relative shrink-0">
              <div className="size-28 overflow-hidden rounded-[24px] bg-white ring-1 ring-line">
                <Visual id={step.visual} transparent showTag={false} className="size-full" />
              </div>
              <span className="num absolute -right-2 -top-2 inline-flex size-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                {i + 1}
              </span>
            </div>
            <div className="pt-2 md:pt-6">
              <h3 className="font-display text-xl font-normal text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{step.bodyText}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export async function FeatureDeepDives() {
  const { home } = await dict();
  const accents = ["V4", "V5", "V6", "V7"] as const;
  return (
    <Section tone="surface" containerClassName="space-y-24 md:space-y-36">
      {home.features.map((block, i) => {
        // Calls, emails and AI stack wide; the last block goes side by side to break the rhythm.
        const stacked = i < 3;
        return (
          <FeatureBlock
            key={block.title}
            block={block}
            layout={stacked ? "stacked" : "split"}
            reverse={!stacked}
            headingLevel="h2"
            extra={
              <>
                {i === 3 ? (
                  <div className="absolute -bottom-10 -right-4 hidden w-[46%] sm:block">
                    <ScreenshotFrame id="S6" sizes="320px" />
                  </div>
                ) : null}
                <Visual
                  id={accents[i]}
                  showTag={false}
                  className={cn(
                    "absolute hidden size-32 rounded-[24px] shadow-[var(--shadow-lift)] ring-1 ring-line md:block",
                    stacked ? "-right-4 -top-10" : "-left-6 -top-8",
                  )}
                />
              </>
            }
          />
        );
      })}
    </Section>
  );
}

export async function Audiences({ audience }: { audience: Audience | null }) {
  const { home } = await dict();
  const a = home.audiences;
  const cards = [...a.cards].sort((x, y) => (x.audience === audience ? -1 : y.audience === audience ? 1 : 0));
  return (
    <Section aria-labelledby="audiences-title">
      <SectionHeader id="audiences-title" title={a.title} sub={a.sub} />
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.audience}>
            <Link
              href={card.href}
              className="lift group flex h-full flex-col overflow-hidden rounded-[20px] bg-white ring-1 ring-line"
              data-cta="audience"
              data-cta-section="home_audiences"
              data-cta-label={card.title}
              data-cta-plan={card.audience}
            >
              <Visual id={card.visual} showTag={false} className="border-b border-line" />
              <div className="flex flex-1 flex-col p-6">
                <Badge className="self-start">{card.plan}</Badge>
                <h3 className="mt-4 font-display text-xl font-normal leading-7 text-ink">{card.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-6 text-muted">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export async function BuiltByAgencies() {
  const { home } = await dict();
  const b = home.built;
  return (
    <Section tone="surface" aria-labelledby="built-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <H2 id="built-title">{b.title}</H2>
        <div>
          <blockquote className="relative">
            <Quote aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
            <p className="mt-4 font-display text-[22px] font-normal leading-8 tracking-[-0.01em] text-ink md:text-[26px] md:leading-9">
              {b.quote}
            </p>
          </blockquote>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {b.people.map((person) => (
              <li key={person.name} className="flex items-center gap-3 sm:flex-col sm:items-start">
                <PersonPhoto name={person.name} />
                <div>
                  <p className="font-semibold text-ink">{person.name}</p>
                  <p className="text-sm text-muted">{person.role}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/a-propos" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
            {b.link}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/** Real photos go in public/people/<slug>.jpg (same light grey background, matched light). */
export function PersonPhoto({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
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
        size === "lg" ? "size-28 text-2xl" : "size-16 text-lg",
      )}
    >
      {initials}
    </span>
  );
}
