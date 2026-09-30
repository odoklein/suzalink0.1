import { dict, resolveTexts } from "@/content";
import type { Cta } from "@/content/types";
import { LogoMark } from "../layout/Logo";
import { CtaLink } from "../ui/CtaLink";
import { H2, Lead } from "../ui/Section";

/** Closing band: a band of sky, the logo tile, and the line motif running through to the CTA. */
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
        <div className="thread-draw relative isolate overflow-hidden rounded-[28px] bg-white px-6 pb-24 pt-20 text-center shadow-[var(--shadow-card)] ring-1 ring-line md:px-16 md:pb-32 md:pt-24">
          <div aria-hidden className="sky-clouds pointer-events-none absolute inset-x-0 top-0 -z-10 h-[72%]" />
          {/* The line runs along the foot of the card, under the buttons, never through the copy */}
          <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full md:h-28" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              data-draw
              pathLength={1}
              d="M -10 70 C 160 40, 300 92, 470 66 S 780 22, 940 52 S 1120 84, 1210 30"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              opacity={0.55}
            />
          </svg>
          <div className="relative mx-auto max-w-3xl">
            <span aria-hidden className="mb-8 inline-flex size-14 items-center justify-center rounded-[16px] bg-white shadow-[var(--shadow-lift)] ring-1 ring-line">
              <LogoMark className="size-8" />
            </span>
            <H2>{title}</H2>
            {sub ? <Lead className="mt-5">{sub}</Lead> : null}
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <CtaLink cta={primary} label={label(primary)} section={section} size="lg" />
              {secondary ? <CtaLink cta={secondary} label={label(secondary)} section={section} size="lg" variant="secondary" /> : null}
            </div>
            {primary.kind === "trial" ? (
              <p className="mt-5 text-small text-muted">
                {resolveTexts(ui.microcopy.trial)
                  .map((m) => m.text)
                  .join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
