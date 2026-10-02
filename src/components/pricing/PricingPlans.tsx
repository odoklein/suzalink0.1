"use client";

import { Check } from "lucide-react";
import { HUE, hueVar, type Hue } from "@/config/hues";
import { PLAN_ORDER, PLANS, type Billing, type PlanId } from "@/config/pricing.config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { euros, formatInt, planMonthlyDisplay } from "@/lib/pricing/format";
import { vars } from "@/lib/style";
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

/** Each plan wears its persona's hue (same as the homepage teaser). */
const PLAN_HUE: Record<PlanId, Hue> = { solo: "sun", equipe: "azure", agence: "violet" };

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

      <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLAN_ORDER.map((id, i) => (
          <PlanCard key={id} id={id} index={i} billing={billing} labels={labels} />
        ))}
        <li data-reveal style={vars({ "--i": 3 })} className="relative isolate flex flex-col overflow-clip rounded-[24px] bg-night p-7 text-white shadow-[var(--shadow-float)]">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#1d2a72_0%,#0b1230_55%,#060a1a_100%)]" />
            <div className="stars absolute inset-0 opacity-70" />
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.5),transparent)] blur-2xl" />
          </div>
          <p className="flex items-center gap-2.5 font-display text-[22px] font-normal">
            <span aria-hidden className="size-2.5 rounded-full bg-white shadow-[0_0_12px_#a99bff]" />
            {labels.surMesure.name}
          </p>
          <p className="mt-1 min-h-10 text-sm text-white/65">{labels.surMesure.for}</p>
          <p className="mt-6 font-display text-[42px] font-normal leading-none tracking-[-0.02em]">{labels.surMesure.price}</p>
          <p className="mt-3 text-sm text-white/65">{labels.surMesure.priceSub}</p>
          <ul className="mt-7 space-y-2.5 text-[15px] text-white/85">
            {labels.surMesure.bullets.map((b) => (
              <li key={b} className="flex gap-2.5">
                <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-white/15">
                  <Check aria-hidden className="size-2.5" strokeWidth={3.5} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          <p className="mt-7 text-sm text-white/65">{labels.surMesure.start}</p>
          <CtaLink cta={{ kind: "expert" }} label={labels.cta.expert} section="pricing_cards" variant="inverse" className="mt-4 w-full" />
        </li>
      </ul>
    </div>
  );
}

function PlanCard({ id, index, billing, labels }: { id: PlanId; index: number; billing: Billing; labels: PricingPlansLabels }) {
  const plan = PLANS[id];
  const copy = labels.plans[id];
  const c = labels.card;
  const hue = PLAN_HUE[id];
  const h = HUE[hue];
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
    <li data-reveal style={vars({ "--i": index })} className="relative">
      {plan.recommended ? (
        <div aria-hidden className="absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgb(51_85_255/0.22),rgb(122_92_255/0.08)_60%,transparent)] blur-2xl" />
      ) : null}
      <div className={cn("h-full rounded-[24px]", plan.recommended && "ring-spin [--ring-width:2px]")}>
        <div
          data-spotlight
          style={hueVar(hue)}
          className={cn(
            "relative flex h-full flex-col rounded-[24px] bg-white p-7 transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1",
            plan.recommended ? "shadow-[var(--shadow-float)]" : "shadow-[var(--shadow-card)] ring-1 ring-line hover:shadow-[var(--shadow-lift)]",
          )}
        >
          {plan.recommended ? (
            <Badge tone="accent" className="absolute -top-3 left-7 shadow-[0_8px_18px_-8px_rgb(51_85_255/0.8)]">
              {labels.recommended}
            </Badge>
          ) : null}
          <p className="flex items-center gap-2.5 font-display text-[22px] font-normal text-ink">
            <span aria-hidden className={cn("size-2.5 rounded-full shadow-[0_0_0_4px_color-mix(in_srgb,currentColor_15%,transparent)]", h.bg, h.text)} />
            {plan.name}
          </p>
          <p className="mt-1 min-h-10 text-sm text-muted">{copy.for}</p>

          <p className="mt-6 flex items-baseline gap-1.5" aria-live="polite">
            <span key={`${id}-${billing}`} className="num font-display text-[52px] font-normal leading-none tracking-[-0.025em] text-ink motion-safe:animate-[rise_600ms_var(--ease-out-expo)_both]">
              {euros(perMonth)}
            </span>
            <span className="text-sm text-muted">{c.perMonth}</span>
          </p>
          <p className="mt-3 min-h-5 text-sm text-muted">
            {billing === "annual" ? c.billedAnnually.replace("{amount}", euros(plan.price.annual)) : c.billedMonthly}
          </p>

          <dl className="mt-6 space-y-2.5 border-t border-line pt-6 text-[15px]">
            <div className="pb-1">
              <dt className={cn("inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold", h.soft, h.ink)}>{users}</dt>
              <dd className="mt-2 text-sm text-muted">
                {`${c.extraSeat}${String.fromCharCode(0xa0)}: `}<span className="text-ink-soft">{extraSeat}</span>
              </dd>
            </div>
            {limits.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 text-muted">
                <dt className="flex items-center gap-2">
                  <Check aria-hidden className={cn("size-3.5 shrink-0", h.text)} strokeWidth={3} />
                  {label}
                </dt>
                <dd className="num text-right font-semibold text-ink-soft">{value}</dd>
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
        </div>
      </div>
    </li>
  );
}
