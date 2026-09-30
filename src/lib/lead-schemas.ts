import "server-only";
import { z } from "zod";
import { TEAM_SIZES } from "./leads";

/** Server-side validation for the demo and Sur-mesure forms. */
const phone = z
  .string()
  .trim()
  .max(30)
  .regex(/^\+?[0-9 .()-]{8,}$/, "phone");

const attribution = z
  .object({
    utm_source: z.string().max(120),
    utm_medium: z.string().max(120),
    utm_campaign: z.string().max(120),
    utm_term: z.string().max(120),
    utm_content: z.string().max(120),
    utm_audience: z.string().max(120),
    landing: z.string().max(300),
    referrer: z.string().max(300),
    first_seen: z.string().max(40),
    visited_pricing: z.boolean(),
    used_calculator: z.boolean(),
  })
  .partial()
  .nullable()
  .optional();

const contact = {
  email: z.string().trim().toLowerCase().email("email").max(200),
  firstName: z.string().trim().min(1, "required").max(80),
  lastName: z.string().trim().min(1, "required").max(80),
  company: z.string().trim().min(1, "required").max(120),
  phone,
  attribution,
  turnstileToken: z.string().max(4096).optional(),
  sourcePage: z.string().max(120).optional(),
};

export const demoLeadSchema = z.object({
  ...contact,
  teamSize: z.enum(TEAM_SIZES, "required"),
  tools: z.string().trim().max(300).optional(),
});

export const expertLeadSchema = z.object({
  ...contact,
  meetingsPerMonth: z.string().trim().min(1, "required").max(40),
  sector: z.string().trim().min(1, "required").max(160),
  companySize: z.string().trim().min(1, "required").max(40),
  region: z.string().trim().min(1, "required").max(160),
  deadline: z.string().trim().min(1, "required").max(40),
});

export type DemoLeadInput = z.input<typeof demoLeadSchema>;
export type ExpertLeadInput = z.input<typeof expertLeadSchema>;

