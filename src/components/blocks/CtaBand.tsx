import { Check } from "lucide-react";
import { dict, resolveTexts } from "@/content";
import type { Cta } from "@/content/types";
import { CtaLink } from "../ui/CtaLink";
import { H2, Lead } from "../ui/Section";
import { Clouds } from "../visuals/Clouds";
import { Mascot } from "../visuals/Mascot";

/**
 * Closing band: a sunrise (the next meeting starts here), clouds drifting
 * across, the mascot waving, and the line motif running under the CTAs.
 */
export async function CtaBand({
  title,
  sub,
  primary = { kind: "trial" },
  secondary = { kind: "demo" },
  section,
}: {
  title: string;
  sub?: string;
  primary?: Cta;
  secondary?: Cta | null;
  section: string;
}) {
  const { ui } = await dict();
  const label = (cta: Cta) => (cta.kind === "trial" ? ui.cta.trial : cta.kind === "expert" ? ui.cta.expert : ui.cta.demo);

  return (
    <section className="section-y bg-surface">
      <div className="container-site">
        <div className="thread-draw relative isolate overflow-clip rounded-[36px] px-6 pb-28 pt-20 text-center shadow-[var(--shadow-float)] ring-1 ring-white/70 md:px-16 md:pb-36 md:pt-24">
          <div aria-hidden className="absolute inset-0 -z-10">
            {/* Sky at sunrise: blue overhead, warming to peach and gold at the horizon */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#6aa4ff_0%,#94c1ff_26%,#d3e4ff_52%,#ffe1d3_78%,#ffd59e_100%)]" />
            <div className="absolute left-1/2 top-[70%] size-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_222_160/0.95),rgb(255_168_130/0.45)_45%,transparent)] blur-2xl" />
            <div className="absolute -left-[10%] -top-[30%] h-[70%] w-[50%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.28),transparent)] blur-3xl" />
            <Clouds className="top-[6%] opacity-90" duration={110} />
            <Clouds className="top-[40%] h-52 scale-125 opacity-60" duration={150} reverse />
            <div className="bg-grid absolute inset-0 [--grid-color:rgb(255_255_255/0.2)] [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
          </div>
          {/* The line runs along the foot of the card, under the buttons, never through the copy */}
          <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full md:h-28" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              data-draw
              pathLength={1}
              d="M -10 70 C 160 40, 300 92, 470 66 S 780 22, 940 52 S 1120 84, 1210 30"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              vectorEffect="non-scaling-stroke"
              opacity={0.7}
            />
          </svg>
          <div className="relative mx-auto max-w-3xl">
            <Mascot className="mb-6 w-28 md:w-36" />
            <div data-reveal="blur">
              <H2>{title}</H2>
            </div>
            {sub ? <Lead className="mt-5 text-ink-soft">{sub}</Lead> : null}
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CtaLink cta={primary} label={label(primary)} section={section} size="lg" />
              {secondary ? <CtaLink cta={secondary} label={label(secondary)} section={section} size="lg" variant="secondary" /> : null}
            </div>
            {primary.kind === "trial" ? (
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-small font-medium text-ink-soft">
                {resolveTexts(ui.microcopy.trial).map((m) => (
                  <li key={m.text} className="inline-flex items-center gap-1.5">
                    <span className="grid size-4 place-items-center rounded-full bg-white/80 text-mint-ink">
                      <Check aria-hidden className="size-2.5" strokeWidth={3.5} />
                    </span>
                    {m.text}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
