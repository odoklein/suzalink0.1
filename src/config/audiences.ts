/** Values accepted in `utm_audience` and the plan each one maps to. */
export const AUDIENCES = ["solo", "equipes", "agences"] as const;
export type Audience = (typeof AUDIENCES)[number];

export function isAudience(value: string | null | undefined): value is Audience {
  return AUDIENCES.includes(value as Audience);
}
