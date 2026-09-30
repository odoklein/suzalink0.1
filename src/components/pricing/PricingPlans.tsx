"use client";

import { Check } from "lucide-react";
import { PLAN_ORDER, PLANS, type Billing, type PlanId } from "@/config/pricing.config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { euros, formatInt, planMonthlyDisplay } from "@/lib/pricing/format";
import { Badge } from "../ui/Badge";
import { CtaLink } from "../ui/CtaLink";
import { BillingToggle } from "./BillingToggle";
import { useBilling } from "./useBilling";

export type PlanCopy = { for: string; support: string; start: string; extraSeat: string; maxUsers: string };

export type PricingPlansLabels = {
  toggle: { monthly: string; annual: string; discount: string; group: string };
  plans: Record<PlanId, PlanCopy>;
  card: {
    perMonth: string;
    billedAnnually: string;
    billedMonthly: string;
    usersIncluded: { one: string; other: string };
    extraSeat: string;
    extraSeatAnnual: string;
    limits: { workspaces: string; contacts: string; mailboxes: string; ai: string };
    unlimited: string;
    support: string;
    start: string;
  };
  surMesure: { name: string; for: string; price: string; priceSub: string; bullets: string[]; start: string };
  cta: { trial: string; demo: string; expert: string };
  recommended: string;
};

export function PricingPlans({ labels }: { labels: PricingPlansLabels }) {
  const [billing, setBilling] = useBilling();

  const change = (next: Billing) => {
    setBilling(next);
    track("pricing_toggle", { billing: next });
  };

  return (
    <div>
      <div className="flex justify-center">
        <BillingToggle value={billing} onChange={change} labels={labels.toggle} />
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLAN_ORDER.map((id) => (
          <PlanCard key={id} id={id} billing={billing} labels={labels} />
        ))}
        <li className="flex flex-col rounded-[20px] border border-dashed border-line-strong p-7">
          <p className="font-display text-xl font-normal text-ink">{labels.surMesure.name}</p>
          <p className="mt-1 min-h-10 text-sm text-muted">{labels.surMesure.for}</p>
          <p className="mt-6 font-display text-[40px] font-normal leading-none tracking-[-0.02em] text-ink">{labels.surMesure.price}</p>
          <p className="mt-3 text-sm text-muted">{labels.surMesure.priceSub}</p>
          <ul className="mt-7 space-y-2.5 text-[15px] text-ink-soft">
            {labels.surMesure.bullets.map((b) => (
              <li key={b} className="flex gap-2.5">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                {b}
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          <p className="mt-7 text-sm text-muted">{labels.surMesure.start}</p>
          <CtaLink cta={{ kind: "expert" }} label={labels.cta.expert} section="pricing_cards" variant="secondary" className="mt-4 w-full" />
        </li>
      </ul>
    </div>
  );
}

function PlanCard({ id, billing, labels }: { id: PlanId; billing: Billing; labels: PricingPlansLabels }) {
  const plan = PLANS[id];
  const copy = labels.plans[id];
  const c = labels.card;
  const perMonth = planMonthlyDisplay(id, billing);
  const users = plan.seatsIncluded === 1 ? c.usersIncluded.one : c.usersIncluded.other.replace("{n}", String(plan.seatsIncluded));
  const extraSeat =
    plan.extraSeat && billing === "annual"
      ? c.extraSeatAnnual.replace("{amount}", euros(Math.round(plan.extraSeat.annual / 12 / 100) * 100))
      : copy.extraSeat;
  const limits = [
    [c.limits.workspaces, plan.clientWorkspaces === "unlimited" ? c.unlimited : formatInt(plan.clientWorkspaces)],
    [c.limits.contacts, formatInt(plan.contacts)],
    [c.limits.mailboxes, formatInt(plan.mailboxesPerUser)],
    [c.limits.ai, formatInt(plan.aiCreditsPerMonth)],
  ];

  return (
    <li
      className={cn(
        "relative flex flex-col rounded-[20px] p-7",
        plan.recommended ? "bg-accent-tint ring-2 ring-accent" : "bg-white ring-1 ring-line",
      )}
    >
      {plan.recommended ? (
        <Badge tone="accent" className="absolute -top-3 left-7">
          {labels.recommended}
        </Badge>
      ) : null}
      <p className="font-display text-xl font-normal text-ink">{plan.name}</p>
      <p className="mt-1 min-h-10 text-sm text-muted">{copy.for}</p>

      <p className="mt-6 flex items-baseline gap-1.5" aria-live="polite">
        <span key={`${id}-${billing}`} className="num motion-safe:animate-price font-display text-[48px] font-normal leading-none tracking-[-0.02em] text-ink">
          {euros(perMonth)}
        </span>
        <span className="text-sm text-muted">{c.perMonth}</span>
      </p>
      <p className="mt-3 min-h-5 text-sm text-muted">
        {billing === "annual" ? c.billedAnnually.replace("{amount}", euros(plan.price.annual)) : c.billedMonthly}
      </p>

      <dl className="mt-6 space-y-2 border-t border-line pt-6 text-[15px]">
        <div className="pb-1">
          <dt className="font-semibold text-ink">{users}</dt>
          <dd className="mt-0.5 text-sm text-muted">
            {`${c.extraSeat}${String.fromCharCode(0xa0)}: `}<span className="text-ink-soft">{extraSeat}</span>
          </dd>
        </div>
        {limits.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 text-muted">
            <dt>{label}</dt>
            <dd className="num text-right font-medium text-ink-soft">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
        <p>
          <span className="block font-semibold text-ink">{c.support}</span>
          <span className="text-muted">{copy.support}</span>
        </p>
        <p>
          <span className="block font-semibold text-ink">{c.start}</span>
          <span className="text-muted">{copy.start}</span>
        </p>
      </div>

      <div className="flex-1" />
      <CtaLink
        cta={plan.start === "trial" ? { kind: "trial" } : { kind: "signup", plan: id }}
        label={plan.start === "trial" ? labels.cta.trial : labels.cta.demo}
        section="pricing_cards"
        billing={billing}
        variant={plan.recommended ? "primary" : "secondary"}
        className="mt-7 w-full"
      />
    </li>
  );
}
