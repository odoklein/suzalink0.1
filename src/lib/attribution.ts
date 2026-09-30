/**
 * First-visit attribution: UTM parameters, landing page and referrer, kept for
 * the session and passed into signup, the demo form and the lead record.
 */
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_audience?: string;
  landing: string;
  referrer?: string;
  first_seen: string;
  visited_pricing?: boolean;
  used_calculator?: boolean;
};

const KEY = "sz_attrib";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_audience"] as const;

function read(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function write(value: Attribution) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // Storage blocked: attribution is best effort.
  }
}

export function captureAttribution(): Attribution {
  const existing = read();
  if (existing) return existing;
  const params = new URLSearchParams(location.search);
  const value: Attribution = {
    landing: location.pathname,
    first_seen: new Date().toISOString(),
  };
  for (const key of UTM_KEYS) {
    const v = params.get(key);
    if (v) value[key] = v.slice(0, 120);
  }
  if (document.referrer && !document.referrer.startsWith(location.origin)) value.referrer = document.referrer.slice(0, 300);
  write(value);
  return value;
}

export function getAttribution(): Attribution | null {
  return typeof window === "undefined" ? null : read();
}

export function markAttribution(patch: Partial<Pick<Attribution, "visited_pricing" | "used_calculator">>) {
  const current = read();
  if (current) write({ ...current, ...patch });
}

/** Parameters appended to signup links. */
export function attributionParams(a: Attribution | null): Record<string, string> {
  if (!a) return {};
  const out: Record<string, string> = { landing: a.landing };
  for (const key of UTM_KEYS) if (a[key]) out[key] = a[key]!;
  return out;
}
