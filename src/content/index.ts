import "server-only";
import { getLocale } from "next-intl/server";
import { claimState, type ClaimState } from "@/config/claims";
import type { Locale } from "@/i18n/routing";
import { typoDeep } from "@/lib/typo";
import fr, { type Dictionary } from "./fr";
import { fillTokensDeep } from "./tokens";
import type { Text } from "./types";

export { MODULE_ORDER } from "./fr/modules";
export { SOLUTION_ORDER } from "./fr/solutions";

/** Prices and quotas are filled from the pricing config, then French typography is applied. */
const dictionaries: Record<Locale, Dictionary> = {
  fr: typoDeep(fillTokensDeep(fr)),
};

export function getContent(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** The dictionary for the current request's locale (server components). */
export async function dict(): Promise<Dictionary> {
  return getContent((await getLocale()) as Locale);
}

export type ResolvedText = { text: string; soon: boolean };

/**
 * Resolves copy that may depend on a claim. Returns null when the item must
 * not be shown. A « soon » claim with a fallback shows the fallback instead.
 */
export function resolveText(value: Text): ResolvedText | null {
  if (typeof value === "string") return { text: value, soon: false };
  const state: ClaimState = claimState(value.claim);
  if (state === "live") return { text: value.text, soon: false };
  if (value.fallback) return { text: value.fallback, soon: false };
  return state === "soon" ? { text: value.text, soon: true } : null;
}

export function resolveTexts(values: Text[]): ResolvedText[] {
  return values.map(resolveText).filter((v): v is ResolvedText => v !== null);
}

/** For items carrying an optional `claim` (FAQ entries, cards, logos). */
export function visibleItems<T extends { claim?: Parameters<typeof claimState>[0]; soon?: boolean }>(
  items: T[],
): (T & { soon: boolean })[] {
  return items.flatMap((item) => {
    const alreadySoon = item.soon === true;
    if (!item.claim) return [{ ...item, soon: alreadySoon }];
    const state = claimState(item.claim);
    if (state === "hidden") return [];
    return [{ ...item, soon: alreadySoon || state === "soon" }];
  });
}
