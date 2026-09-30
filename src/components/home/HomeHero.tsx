import type { Audience } from "@/config/audiences";
import { dict, resolveTexts } from "@/content";
import { CtaLink } from "../ui/CtaLink";
import { KeyChip } from "../ui/KeyChip";
import { ScreenshotFrame, Visual } from "../ui/Media";
import { Eyebrow } from "../ui/Section";

/**
 * Headline on top, the calling workspace (S1) floating over the V1 background
 * below it, and the key chip showing an outcome logged in one keystroke.
 */
export async function HomeHero({ audience }: { audience: Audience | null }) {
  const { home, ui } = await dict();
  const h = home.hero;
  const sub = audience ? h.subByAudience[audience] : h.sub;
  const [first, second] = h.title;
  const words = second.split(" ");
  const last = words.pop();

  return (
    <section data-hero className="relative overflow-hidden bg-white">
      <div className="container-site pt-12 text-center md:pt-20">
        <Eyebrow className="mb-6 justify-center">{h.eyebrow}</Eyebrow>
        <h1 className="mx-auto max-w-4xl font-display text-h1m font-normal text-ink md:text-h1">
          <span className="block">{first}</span>
          <span className="block">
            {words.join(" ")}{" "}
            <span className="relative inline-block whitespace-nowrap">
              {last}
              <svg aria-hidden className="absolute -bottom-2 left-0 h-3 w-full overflow-visible" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path
                  d="M2 8 C 40 2, 80 2, 110 6 S 170 11, 198 3"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  className="[stroke-dasharray:1] motion-safe:animate-[thread-draw_280ms_ease-out_200ms_both] motion-safe:[stroke-dashoffset:1]"
                />
              </svg>
            </span>
          </span>
        </h1>
        <p className="mx-auto mt-7 max-w-2xl text-bodym text-muted md:text-body">{sub}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <CtaLink cta={{ kind: "trial" }} label={ui.cta.trial} section="home_hero" size="lg" />
          <CtaLink cta={{ kind: "demo" }} label={ui.cta.demo} section="home_hero" size="lg" variant="secondary" />
        </div>
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-small text-muted">
          {resolveTexts(ui.microcopy.trial).map((m, i) => (
            <span key={m.text} className="inline-flex items-center gap-3">
              {i > 0 ? <span aria-hidden className="size-1 rounded-full bg-line-strong" /> : null}
              {m.text}
            </span>
          ))}
        </p>
      </div>

      <div className="container-site pb-20 pt-14 md:pt-20 lg:pb-28">
        <div className="relative mx-auto max-w-[1080px]">
          {/* Sky light behind the product: V1 is multiplied over it, so its white objects pick up the blue */}
          <div aria-hidden className="sky-glow pointer-events-none absolute -inset-x-10 bottom-0 top-6 md:-inset-x-36 md:top-10" />
          <Visual
            id="V1"
            fill
            priority
            showTag={false}
            className="absolute -inset-x-3 -top-6 bottom-12 rounded-[32px] mix-blend-multiply md:-inset-x-14 md:-top-10 md:bottom-20"
          />
          <div className="relative px-2 pt-4 sm:px-8 md:px-14 md:pt-10">
            <ScreenshotFrame id="S1" priority sizes="(min-width: 1080px) 960px, 100vw" />
            <KeyChip
              keyLabel={h.chip.key}
              label={h.chip.label}
              sub={h.chip.sub}
              className="absolute -bottom-8 left-4 sm:left-10 md:-left-2 md:bottom-16"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
