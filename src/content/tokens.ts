import {
  ANNUAL_DISCOUNT,
  CREDIT_RULES,
  MAILBOX_ADDON,
  PLANS,
  READ_ONLY_DAYS_AFTER_TRIAL,
  SOURCING_PACKS,
  TRIAL_DAYS,
  VAT_RATE,
  VOIP_ADDON,
  type PlanId,
} from "@/config/pricing.config";
import { euros, formatInt, planMonthlyDisplay } from "@/lib/pricing/format";

/**
 * Copy never types a price or a quota. It writes {{equipe.extraSeat}} and the
 * value is read from the pricing config when the content loads.
 */
function planTokens(id: PlanId): Record<string, string> {
  const p = PLANS[id];
  return {
    [`${id}.name`]: p.name,
    [`${id}.monthly`]: euros(p.price.monthly),
    [`${id}.annual`]: euros(p.price.annual),
    [`${id}.annualMonthly`]: euros(planMonthlyDisplay(id, "annual")),
    [`${id}.seats`]: formatInt(p.seatsIncluded),
    [`${id}.max`]: formatInt(p.maxUsers),
    [`${id}.extraSeat`]: p.extraSeat ? euros(p.extraSeat.monthly) : "",
    [`${id}.contacts`]: formatInt(p.contacts),
    [`${id}.mailboxes`]: formatInt(p.mailboxesPerUser),
    [`${id}.ai`]: formatInt(p.aiCreditsPerMonth),
    [`${id}.credits`]: formatInt(p.leadCreditsPerMonth),
    [`${id}.workspaces`]: p.clientWorkspaces === "unlimited" ? "illimités" : formatInt(p.clientWorkspaces),
    [`${id}.audio`]: `${formatInt(p.audioHours)} h`,
    [`${id}.s3`]: `${p.s3StorageGb} Go`,
  };
}

const tokens: Record<string, string> = {
  ...planTokens("solo"),
  ...planTokens("equipe"),
  ...planTokens("agence"),
  "voip.price": euros(VOIP_ADDON.pricePerUser),
  "voip.minutes": formatInt(VOIP_ADDON.fairUse.outboundMinutesPerUserPerMonth),
  "mailbox.single": euros(MAILBOX_ADDON.single.price),
  "mailbox.pack": euros(MAILBOX_ADDON.pack.price),
  "mailbox.packSize": formatInt(MAILBOX_ADDON.pack.size),
  "credits.perRecord": formatInt(CREDIT_RULES.creditsPerRecord),
  "credits.perPhone": formatInt(CREDIT_RULES.creditsPerPhoneFound),
  ...Object.fromEntries(SOURCING_PACKS.map((p) => [`credits.${p.id}`, euros(p.price)])),
  ...Object.fromEntries(SOURCING_PACKS.map((p) => [`credits.${p.id}.count`, formatInt(p.credits)])),
  "trial.days": String(TRIAL_DAYS),
  "trial.readOnlyDays": String(READ_ONLY_DAYS_AFTER_TRIAL),
  vat: `${Math.round(VAT_RATE * 100)} %`,
  "annual.discount": `−${Math.round(ANNUAL_DISCOUNT * 100)} %`,
};

export function fillTokens(input: string): string {
  return input.replace(/\{\{([\w.]+)\}\}/g, (match, key: string) => {
    const value = tokens[key];
    if (value === undefined) throw new Error(`Unknown content token ${match}`);
    return value;
  });
}

export function fillTokensDeep<T>(value: T): T {
  if (typeof value === "string") return fillTokens(value) as T;
  if (Array.isArray(value)) return value.map(fillTokensDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillTokensDeep(v)])) as T;
  }
  return value;
}
