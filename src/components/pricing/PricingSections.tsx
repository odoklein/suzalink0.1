import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { claimState, isLive } from "@/config/claims";
import { PLAN_ORDER, PLANS, type PlanId } from "@/config/pricing.config";
import { dict, MODULE_ORDER, resolveText, resolveTexts } from "@/content";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { euros, formatInt, planMonthlyDisplay } from "@/lib/pricing/format";
import { Badge } from "../ui/Badge";
import { CtaLink } from "../ui/CtaLink";
import { Icon, IconTile } from "../ui/Icon";
import { H2, Lead, Section, SectionHeader, twoTone } from "../ui/Section";

export async function IncludedModules() {
  const { pricing, modules } = await dict();
  return (
    <Section aria-labelledby="included-title">
      <SectionHeader id="included-title" title={pricing.included.title} sub={pricing.included.sub} />
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULE_ORDER.map((slug) => {
          const m = modules[slug];
          return (
            <li key={slug}>
              <Link href={m.path} className="lift group flex h-full gap-4 rounded-[16px] bg-white p-5 ring-1 ring-line">
                <IconTile name={m.icon} />
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-semibold text-ink">
                    {m.name}
                    <ArrowRight aria-hidden className="size-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{m.navBlurb}</span>
                </span>
              </Link>
            </li>
          );
        })}
        {pricing.included.extra.map((e) => (
          <li key={e.title} className="flex gap-4 rounded-[16px] bg-white p-5 ring-1 ring-line">
            <IconTile name={e.title.startsWith("Opport") ? "target" : "plug"} />
            <span>
              <span className="block font-semibold text-ink">{e.title}</span>
              <span className="mt-0.5 block text-sm text-muted">{e.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export async function AddOns() {
  const { pricing, ui } = await dict();
  const a = pricing.addons;
  const cards = [
    { key: "voip", icon: "headset" as const, ...a.voip, claim: "voip-addon" as const },
    { key: "sourcing", icon: "target" as const, ...a.sourcing, claim: "lead-credits" as const },
    { key: "mailboxes", icon: "inbox" as const, ...a.mailboxes, claim: undefined },
  ];

  return (
    <Section tone="surface" id="options" aria-labelledby="addons-title">
      <SectionHeader id="addons-title" title={a.title} sub={a.sub} />
      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const state = card.claim ? claimState(card.claim) : "live";
          if (state === "hidden") return null;
          const body = resolveText(card.body);
          return (
            <li key={card.key} className="flex flex-col rounded-[20px] bg-white p-7 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <IconTile name={card.icon} />
                {state === "soon" ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
              </div>
              <p className="mt-5 font-display text-lg font-normal text-ink">{card.name}</p>
              <p className="mt-3 flex items-baseline gap-1.5">
                <span className="num font-display text-[32px] font-normal leading-none tracking-[-0.02em] text-ink">{card.price}</span>
                <span className="text-sm text-muted">HT {card.unit}</span>
              </p>
              {body ? <p className="mt-4 flex-1 text-[15px] leading-6 text-muted">{body.text}</p> : null}
              {"link" in card && card.link && state === "live" ? (
                <a href="#usage-raisonnable" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                  {card.link}
                  <ArrowRight aria-hidden className="size-4" />
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

type Col = PlanId | "sur-mesure";

export async function ComparisonTable() {
  const { pricing, ui } = await dict();
  const t = pricing.table;
  const cols: Col[] = [...PLAN_ORDER, "sur-mesure"];
  const name = (c: Col) => (c === "sur-mesure" ? pricing.surMesure.name : PLANS[c].name);
  const dash = "—";

  const rows: { label: string; value: (c: Col) => string }[] = [
    { label: t.rows.for, value: (c) => (c === "sur-mesure" ? pricing.surMesure.for : pricing.plans[c].for) },
    { label: t.rows.monthly, value: (c) => (c === "sur-mesure" ? pricing.surMesure.price : euros(PLANS[c].price.monthly)) },
    {
      label: t.rows.annual,
      value: (c) =>
        c === "sur-mesure"
          ? dash
          : `${t.perMonthEq.replace("{amount}", euros(planMonthlyDisplay(c, "annual")))} (${t.perYear.replace("{amount}", euros(PLANS[c].price.annual))})`,
    },
    { label: t.rows.users, value: (c) => (c === "sur-mesure" ? t.surMesureRuns : formatInt(PLANS[c].seatsIncluded)) },
    { label: t.rows.extraSeat, value: (c) => (c === "sur-mesure" ? dash : pricing.plans[c].extraSeat) },
    { label: t.rows.maxUsers, value: (c) => (c === "sur-mesure" ? dash : pricing.plans[c].maxUsers) },
    {
      label: t.rows.workspaces,
      value: (c) =>
        c === "sur-mesure" ? t.surMesurePortal : PLANS[c].clientWorkspaces === "unlimited" ? t.unlimited : formatInt(PLANS[c].clientWorkspaces as number),
    },
    { label: t.rows.guests, value: (c) => (c === "sur-mesure" ? t.included : t.guests) },
    { label: t.rows.contacts, value: (c) => (c === "sur-mesure" ? dash : formatInt(PLANS[c].contacts)) },
    { label: t.rows.mailboxes, value: (c) => (c === "sur-mesure" ? dash : `${formatInt(PLANS[c].mailboxesPerUser)} ${t.perUser}`) },
    { label: t.rows.ai, value: (c) => (c === "sur-mesure" ? dash : formatInt(PLANS[c].aiCreditsPerMonth)) },
    { label: t.rows.credits, value: (c) => (c === "sur-mesure" ? dash : formatInt(PLANS[c].leadCreditsPerMonth)) },
    { label: t.rows.support, value: (c) => (c === "sur-mesure" ? t.surMesureSupport : pricing.plans[c].support) },
    { label: t.rows.start, value: (c) => (c === "sur-mesure" ? pricing.surMesure.start : pricing.plans[c].start) },
  ];

  const cta = (c: Col) =>
    c === "sur-mesure" ? (
      <CtaLink cta={{ kind: "expert" }} label={ui.cta.expert} section="pricing_table" variant="secondary" size="sm" className="w-full" />
    ) : PLANS[c].start === "trial" ? (
      <CtaLink cta={{ kind: "trial" }} label={ui.cta.trialShort} section="pricing_table" variant="secondary" size="sm" className="w-full" />
    ) : (
      <CtaLink
        cta={{ kind: "signup", plan: c }}
        label={ui.cta.demo}
        section="pricing_table"
        variant={PLANS[c].recommended ? "primary" : "secondary"}
        size="sm"
        className="w-full"
      />
    );

  return (
    <Section id="comparatif" aria-labelledby="table-title">
      <H2 id="table-title">{t.title}</H2>

      {/* Desktop: one table, header sticks under the site header */}
      <table className="mt-12 hidden w-full border-separate border-spacing-0 text-left text-[15px] lg:table">
        <caption className="sr-only">{t.title}</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky top-[57px] z-10 w-[22%] border-b border-line bg-white py-4" />
            {cols.map((c) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "sticky top-[57px] z-10 border-b border-line bg-white px-4 py-4 align-bottom",
                  c !== "sur-mesure" && PLANS[c].recommended && "bg-accent-tint",
                )}
              >
                <span className="flex items-center gap-2 font-display text-lg font-normal text-ink">
                  {name(c)}
                  {c !== "sur-mesure" && PLANS[c].recommended ? <Badge tone="accent">{ui.badges.recommended}</Badge> : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="border-b border-line py-4 pr-4 align-top font-medium text-ink">
                {row.label}
              </th>
              {cols.map((c) => (
                <td
                  key={c}
                  className={cn(
                    "border-b border-line px-4 py-4 align-top text-ink-soft",
                    /^\d/.test(row.value(c)) && "num",
                    c !== "sur-mesure" && PLANS[c].recommended && "bg-accent-tint/60",
                  )}
                >
                  {row.value(c)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="py-5" />
            {cols.map((c) => (
              <td key={c} className={cn("px-4 py-5", c !== "sur-mesure" && PLANS[c].recommended && "bg-accent-tint/60")}>
                {cta(c)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Mobile: one accordion per plan */}
      <div className="mt-10 space-y-3 lg:hidden">
        {cols.map((c) => (
          <details key={c} className="group rounded-[16px] bg-white ring-1 ring-line" open={c !== "sur-mesure" && PLANS[c].recommended}>
            <summary className="flex cursor-pointer items-center justify-between gap-3 p-5">
              <span className="flex items-center gap-2 font-display text-lg font-normal text-ink">
                {name(c)}
                {c !== "sur-mesure" && PLANS[c].recommended ? <Badge tone="accent">{ui.badges.recommended}</Badge> : null}
              </span>
              <ChevronDown aria-hidden className="size-5 text-muted transition-transform group-open:rotate-180" />
            </summary>
            <dl className="border-t border-line px-5 pb-5">
              {rows.map((row) => (
                <div key={row.label} className="grid grid-cols-2 gap-4 border-b border-line py-3 text-sm last:border-0">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="num text-ink-soft">{row.value(c)}</dd>
                </div>
              ))}
            </dl>
            <div className="px-5 pb-5">{cta(c)}</div>
          </details>
        ))}
      </div>
    </Section>
  );
}

export async function FairUse() {
  if (!isLive("voip-addon")) return null;
  const { pricing } = await dict();
  return (
    <Section tone="surface" id="usage-raisonnable" aria-labelledby="fair-use-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <IconTile name="headset" />
          <H2 id="fair-use-title" className="mt-6 text-[28px] leading-9 md:text-[36px] md:leading-[44px]">
            {pricing.fairUse.title}
          </H2>
        </div>
        <ul className="space-y-4">
          {pricing.fairUse.items.map((item) => (
            <li key={item} className="flex gap-3 rounded-[16px] bg-white p-5 text-ink-soft ring-1 ring-line">
              <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export async function TrustStrip() {
  const { pricing } = await dict();
  const icons = ["server", "check", "lock", "users"] as const;
  return (
    <div className="border-y border-line bg-white">
      <ul className="container-site flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-6 text-small font-medium text-ink-soft">
        {resolveTexts(pricing.trust).map((item, i) => (
          <li key={item.text} className="inline-flex items-center gap-2">
            <Icon name={icons[i] ?? "check"} className="size-4 text-accent" />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function PricingHeader() {
  const { pricing } = await dict();
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="font-display text-h1m font-normal text-ink md:text-h1">{twoTone(pricing.header.title)}</h1>
      <Lead className="mt-6">{pricing.header.sub}</Lead>
    </div>
  );
}
