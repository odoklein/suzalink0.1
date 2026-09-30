import { ArrowRight } from "lucide-react";
import { PLAN_ORDER, PLANS } from "@/config/pricing.config";
import { dict } from "@/content";
import type { Cta } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { euros } from "@/lib/pricing/format";
import { Badge } from "../ui/Badge";
import { CtaLink } from "../ui/CtaLink";
import { Section, SectionHeader } from "../ui/Section";

export async function PricingTeaser({ tone = "white" }: { tone?: "white" | "surface" }) {
  const { home, pricing, ui } = await dict();

  return (
    <Section tone={tone} aria-labelledby="pricing-teaser-title">
      <SectionHeader id="pricing-teaser-title" title={home.pricing.title} sub={home.pricing.sub} align="center" />
      <ul className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
        {PLAN_ORDER.map((id) => {
          const plan = PLANS[id];
          const cta: Cta = plan.start === "trial" ? { kind: "trial" } : { kind: "signup", plan: id };
          const users =
            plan.seatsIncluded === 1
              ? pricing.card.usersIncluded.one
              : pricing.card.usersIncluded.other.replace("{n}", String(plan.seatsIncluded));
          return (
            <li
              key={id}
              className={cn(
                "lift relative flex flex-col rounded-[20px] bg-white p-7 ring-1",
                plan.recommended ? "ring-2 ring-accent" : "ring-line",
              )}
            >
              {plan.recommended ? <Badge tone="accent" className="absolute -top-3 left-7">{ui.badges.recommended}</Badge> : null}
              <p className="font-display text-xl font-normal text-ink">{plan.name}</p>
              <p className="mt-1 text-sm text-muted">{pricing.plans[id].for}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="num font-display text-[44px] font-normal leading-none tracking-[-0.02em] text-ink">{euros(plan.price.monthly)}</span>
                <span className="text-sm text-muted">{pricing.card.perMonth}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{users}</p>
              <div className="mt-7 flex-1" />
              <CtaLink
                cta={cta}
                label={plan.start === "trial" ? ui.cta.trialShort : ui.cta.demo}
                section="home_pricing"
                variant={plan.recommended ? "primary" : "secondary"}
                className="w-full"
              />
            </li>
          );
        })}
      </ul>
      <p className="mt-10 text-center">
        <Link href="/tarifs" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
          {ui.cta.comparePlans}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </p>
    </Section>
  );
}
