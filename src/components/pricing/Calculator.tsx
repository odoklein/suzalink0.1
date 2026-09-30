"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ClaimState } from "@/config/claims";
import { CALCULATOR_LIMITS, MAILBOX_ADDON, PLANS, SOURCING_PACKS, type SourcingPackId } from "@/config/pricing.config";
import { track } from "@/lib/analytics";
import { markAttribution } from "@/lib/attribution";
import { cn } from "@/lib/cn";
import { calculate, type LineItem } from "@/lib/pricing/calculate";
import { eurosExact, formatInt } from "@/lib/pricing/format";
import { Badge } from "../ui/Badge";
import { CtaLink } from "../ui/CtaLink";
import { BillingToggle } from "./BillingToggle";
import { useBilling } from "./useBilling";

export type CalculatorLabels = {
  title: string;
  sub: string;
  users: string;
  usersUnit: { one: string; other: string };
  multiClient: string;
  multiClientHint: string;
  voip: string;
  voipUnit: string;
  sourcing: string;
  sourcingNone: string;
  sourcingOption: string;
  mailboxes: string;
  billing: string;
  recommended: string;
  lines: Record<LineItem["id"], string>;
  perMonth: string;
  perYear: string;
  monthlyTotal: string;
  annualTotal: string;
  averagePerMonth: string;
  firstInvoice: string;
  vat: string;
  annualNote: string;
  soon: string;
  toggle: { monthly: string; annual: string; discount: string; group: string };
  cta: { trial: string; demo: string };
  soonBadge: string;
};

/**
 * « Estimez votre budget ». Uses the same calculate() as checkout must, so the
 * total here matches the Stripe total to the cent (before VAT).
 */
export function Calculator({
  labels,
  voipState,
  creditsState,
}: {
  labels: CalculatorLabels;
  voipState: ClaimState;
  creditsState: ClaimState;
}) {
  const [billing, setBilling] = useBilling();
  const [users, setUsers] = useState(3);
  const [multiClient, setMultiClient] = useState(false);
  const [voipUsers, setVoipUsers] = useState(0);
  const [sourcingPack, setSourcingPack] = useState<SourcingPackId>("none");
  const [extraMailboxes, setExtraMailboxes] = useState(0);
  const voipLive = voipState === "live";
  const creditsLive = creditsState === "live";

  const quote = useMemo(
    () =>
      calculate({
        users,
        voipUsers: voipLive ? voipUsers : 0,
        sourcingPack: creditsLive ? sourcingPack : "none",
        extraMailboxes,
        billing,
        multiClient,
      }),
    [users, voipUsers, sourcingPack, extraMailboxes, billing, multiClient, voipLive, creditsLive],
  );

  // Report changes once the visitor pauses, not on every slider step.
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) return;
    const t = setTimeout(() => {
      markAttribution({ used_calculator: true });
      track("calculator_changed", {
        users: quote.users,
        voip_users: voipUsers,
        sourcing_pack: sourcingPack,
        extra_mailboxes: extraMailboxes,
        billing,
        recommended_plan: quote.plan,
        monthly_total_cents: quote.monthlyTotal,
        annual_total_cents: quote.annualTotal,
      });
    }, 600);
    return () => clearTimeout(t);
  }, [quote, voipUsers, sourcingPack, extraMailboxes, billing]);

  const touch = <T,>(set: (v: T) => void) => (v: T) => {
    touched.current = true;
    set(v);
  };

  const plan = PLANS[quote.plan];
  const lineLabel = (l: LineItem) =>
    l.id === "plan"
      ? labels.lines.plan.replace("{name}", plan.name)
      : labels.lines[l.id].replace("{size}", String(MAILBOX_ADDON.pack.size));
  const unit = (l: LineItem) => (l.interval === "year" ? labels.perYear : labels.perMonth);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="space-y-8 rounded-[20px] bg-white p-6 ring-1 ring-line md:p-8">
        <Slider
          label={labels.users}
          value={users}
          min={CALCULATOR_LIMITS.users.min}
          max={CALCULATOR_LIMITS.users.max}
          onChange={touch((v: number) => {
            setUsers(v);
            setVoipUsers((current) => Math.min(current, v));
          })}
          display={`${users} ${users === 1 ? labels.usersUnit.one : labels.usersUnit.other}`}
        />

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={multiClient}
            onChange={(e) => touch(setMultiClient)(e.target.checked)}
            className="mt-1 size-4 accent-[var(--color-accent)]"
          />
          <span>
            <span className="block font-medium text-ink">{labels.multiClient}</span>
            <span className="block text-sm text-muted">{labels.multiClientHint}</span>
          </span>
        </label>

        <div className={cn(!voipLive && "opacity-60")}>
          <Slider
            label={labels.voip}
            value={voipLive ? voipUsers : 0}
            min={0}
            max={users}
            disabled={!voipLive}
            onChange={touch(setVoipUsers)}
            display={`${voipLive ? voipUsers : 0} ${labels.voipUnit}`}
            badge={voipLive ? undefined : labels.soonBadge}
          />
        </div>

        <fieldset className={cn(!creditsLive && "opacity-60")} disabled={!creditsLive}>
          <legend className="flex items-center gap-2 font-medium text-ink">
            {labels.sourcing}
            {creditsLive ? null : <Badge tone="soon">{labels.soonBadge}</Badge>}
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(["none", ...SOURCING_PACKS.map((p) => p.id)] as SourcingPackId[]).map((id) => {
              const pack = SOURCING_PACKS.find((p) => p.id === id);
              const active = (creditsLive ? sourcingPack : "none") === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => touch(setSourcingPack)(id)}
                  className={cn(
                    "h-11 rounded-[12px] px-3 text-sm font-medium ring-1 ring-inset transition-colors",
                    active ? "bg-accent-tint text-accent ring-accent" : "bg-white text-ink-soft ring-line hover:ring-line-strong",
                  )}
                >
                  {pack ? labels.sourcingOption.replace("{count}", formatInt(pack.credits)) : labels.sourcingNone}
                </button>
              );
            })}
          </div>
        </fieldset>

        <Slider
          label={labels.mailboxes}
          value={extraMailboxes}
          min={CALCULATOR_LIMITS.mailboxes.min}
          max={CALCULATOR_LIMITS.mailboxes.max}
          onChange={touch(setExtraMailboxes)}
          display={String(extraMailboxes)}
        />

        <div>
          <p className="font-medium text-ink">{labels.billing}</p>
          <BillingToggle value={billing} onChange={touch(setBilling)} labels={labels.toggle} className="mt-3" />
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[20px] bg-ink p-6 text-white md:p-8" aria-live="polite">
          <p className="text-sm text-white/60">{labels.recommended}</p>
          <p className="mt-1 font-display text-[28px] font-normal leading-9">{plan.name}</p>

          <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-[15px]">
            {quote.lines.map((l) => (
              <li key={l.id} className="flex items-baseline justify-between gap-4">
                <span className="text-white/80">
                  {lineLabel(l)}
                  {l.quantity > 1 ? <span className="text-white/50"> × {l.quantity}</span> : null}
                </span>
                <span className="num shrink-0 font-medium">
                  {eurosExact(l.amount)}
                  <span className="text-white/50">{unit(l)}</span>
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-4 border-t border-white/10 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-white/80">{labels.monthlyTotal}</dt>
              <dd className="text-right">
                <span className="num font-display text-[32px] font-normal leading-none">{eurosExact(quote.monthlyTotal)}</span>
                {billing === "annual" ? <span className="block text-xs text-white/50">{labels.averagePerMonth}</span> : null}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-white/80">{labels.annualTotal}</dt>
              <dd className="num text-right text-lg font-semibold">{eurosExact(quote.annualTotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <dt className="text-white/60">{labels.firstInvoice}</dt>
              <dd className="num text-right text-white/80">{eurosExact(quote.firstInvoice)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-5 text-white/50">
            {labels.vat}
            {billing === "annual" && quote.monthlyRecurring > 0 ? ` ${labels.annualNote}` : ""}
          </p>

          <CtaLink
            cta={plan.start === "trial" ? { kind: "trial" } : { kind: "signup", plan: quote.plan }}
            label={plan.start === "trial" ? labels.cta.trial : labels.cta.demo}
            section="pricing_calculator"
            billing={billing}
            variant="inverse"
            size="lg"
            className="mt-6 w-full"
          />
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  display,
  disabled,
  badge,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  display: string;
  disabled?: boolean;
  badge?: string;
}) {
  const id = useId();
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="flex items-center gap-2 font-medium text-ink">
          {label}
          {badge ? <Badge tone="soon">{badge}</Badge> : null}
        </label>
        <span className="num text-sm font-semibold text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-[var(--color-accent)] disabled:cursor-not-allowed [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_white,0_1px_4px_rgb(11_18_32/0.3)]"
        style={{ background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-line) ${pct}%)` }}
      />
    </div>
  );
}
