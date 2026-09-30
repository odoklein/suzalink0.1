/**
 * French typography, applied in one place. Copy is written with ordinary
 * spaces ("Appel : 79 € ?") and this helper swaps in the right no-break spaces
 * so punctuation, units and quotes never wrap onto their own line.
 */
const NBSP = String.fromCharCode(0xa0); // espace insécable
const NNBSP = String.fromCharCode(0x202f); // espace fine insécable
const WJ = String.fromCharCode(0x2060); // word joiner: no line break, no glyph

export function typo(input: string): string {
  return (
    input
      // Typographic apostrophe: l'IA → l’IA
      .replace(/(\p{L})'(?=\p{L})/gu, "$1’")
      // Quotes: « texte »
      .replace(/«[ \u00A0\u202F]*/g, `«${NNBSP}`)
      .replace(/[ \u00A0\u202F]*»/g, `${NNBSP}»`)
      // Thin no-break space before ; ! ? and a full one before :
      .replace(/ ([;!?])/g, `${NNBSP}$1`)
      .replace(/ :/g, `${NBSP}:`)
      // Units after a number: 79 €, 99 %, 30 min, 48 h
      .replace(/(\d) (€|%|min\b|h\b|ms\b|Ko\b|Mo\b)/g, `$1${NBSP}$2`)
      // Thousands: 60 000, 1 000 000
      .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NNBSP}`)
      // Compound words never break at their hyphen (rendez-vous, Jean-François).
      // Only standalone words: a hyphen inside a URL or path is left alone.
      .replace(
        /(^|[\s«(“’])(\p{L}+(?:-\p{L}+)+)(?=$|[\s.,;:!?»)”…])/gu,
        (_, pre: string, word: string) => pre + word.replaceAll("-", `-${WJ}`),
      )
  );
}

const SKIP_KEYS = new Set(["href", "id", "slug", "path", "claim", "icon", "module"]);

/** A lowercase kebab-case value (`rendez-vous`, `upgrade-equipe`) is a key used for lookups, not copy. */
const IDENTIFIER = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

/** Applies `typo` to every string in a content tree (objects and arrays). */
export function typoDeep<T>(value: T): T {
  if (typeof value === "string") return (IDENTIFIER.test(value) ? value : typo(value)) as T;
  if (Array.isArray(value)) return value.map(typoDeep) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      // Links and identifiers are never typeset
      out[key] = SKIP_KEYS.has(key) ? v : typoDeep(v);
    }
    return out as T;
  }
  return value;
}
