import { ArrowRight } from "lucide-react";
import { HUE, type Hue } from "@/config/hues";
import { PLAN_ORDER, PLANS, type PlanId } from "@/config/pricing.config";
import { dict } from "@/content";
import type { Cta } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { euros } from "@/lib/pricing/format";
import { vars } from "@/lib/style";
import { Badge } from "../ui/Badge";
import { CtaLink } from "../ui/CtaLink";
import { Section, SectionHeader } from "../ui/Section";

/** Each plan wears its persona's hue (solo, teams, agencies). */
export const PLAN_HUE: Record<PlanId, Hue> = { solo: "sun", equipe: "azure", agence: "violet" };

export async function PricingTeaser({ tone = "white" }: { tone?: "white" | "surface" }) {
  const { home, pricing, ui } = await dict();

  return (
    <Section tone={tone} aria-labelledby="pricing-teaser-title">
      <SectionHeader id="pricing-teaser-title" title={home.pricing.title} sub={home.pricing.sub} align="center" />
      <ul className="mx-auto mt-14 grid max-w-5xl gap-5 md:mt-16 md:grid-cols-3">
        {PLAN_ORDER.map((id, i) => {
          const plan = PLANS[id];
          const h = HUE[PLAN_HUE[id]];
          const cta: Cta = plan.start === "trial" ? { kind: "trial" } : { kind: "signup", plan: id };
          const users =
            plan.seatsIncluded === 1
              ? pricing.card.usersIncluded.one
              : pricing.card.usersIncluded.other.replace("{n}", String(plan.seatsIncluded));
          return (
            <li key={id} data-reveal style={vars({ "--i": i })} className="relative">
              {plan.recommended ? (
                <div aria-hidden className="absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgb(51_85_255/0.22),rgb(122_92_255/0.08)_60%,transparent)] blur-2xl" />
              ) : null}
              <div className={cn("h-full rounded-[24px]", plan.recommended && "ring-spin [--ring-width:2px]")}>
                <div
                  data-spotlight
                  className={cn(
                    "relative flex h-full flex-col rounded-[24px] bg-white p-7 transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1",
                    plan.recommended ? "shadow-[var(--shadow-float)]" : "shadow-[var(--shadow-card)] ring-1 ring-line hover:shadow-[var(--shadow-lift)]",
                  )}
                >
                  {plan.recommended ? (
                    <Badge tone="accent" className="absolute -top-3 left-7 shadow-[0_8px_18px_-8px_rgb(51_85_255/0.8)]">
                      {ui.badges.recommended}
                    </Badge>
                  ) : null}
                  <p className="flex items-center gap-2.5 font-display text-[22px] font-normal text-ink">
                    <span aria-hidden className={cn("size-2.5 rounded-full shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_15%,transparent)]", h.bg, h.text)} />
                    {plan.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{pricing.plans[id].for}</p>
                  <p className="mt-7 flex items-baseline gap-1.5">
                    <span className="num font-display text-[52px] font-normal leading-none tracking-[-0.025em] text-ink">{euros(plan.price.monthly)}</span>
                    <span className="text-sm text-muted">{pricing.card.perMonth}</span>
                  </p>
                  <p className={cn("mt-3 inline-flex self-start rounded-full px-2.5 py-0.5 text-sm font-medium", h.soft, h.ink)}>{users}</p>
                  <div className="mt-8 flex-1" />
                  <CtaLink
                    cta={cta}
                    label={plan.start === "trial" ? ui.cta.trialShort : ui.cta.demo}
                    section="home_pricing"
                    variant={plan.recommended ? "primary" : "secondary"}
                    className="w-full"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-12 text-center">
        <Link href="/tarifs" className="group inline-flex items-center gap-1.5 font-semibold text-accent">
          {ui.cta.comparePlans}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
        </Link>
      </p>
    </Section>
  );
}
