"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import type { z } from "zod";
import { demoLeadSchema, expertLeadSchema } from "@/lib/lead-schemas";
import { scoreLead, type LeadResult } from "@/lib/leads";

/*
 * Demo and Sur-mesure leads. Each one is validated, rate limited, checked by
 * Cloudflare Turnstile when configured, scored, then pushed to the leads API
 * (Suzalink's own workspace, PRD dependency #14) with its UTM fields.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best effort per server instance. Use a shared store (e.g. Upstash) if abuse appears.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured (local dev, previews)
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function pushLead(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.LEADS_API_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") console.info("[leads] LEADS_API_URL not set, lead not forwarded:", payload.type, payload.id);
    else console.error("[leads] LEADS_API_URL is not configured in production");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.LEADS_API_TOKEN ? { Authorization: `Bearer ${process.env.LEADS_API_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) console.error("[leads] leads API answered", res.status);
  } catch (err) {
    // The booking step still runs: Cal.com webhooks also reach the leads API.
    console.error("[leads] leads API unreachable", err);
  }
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fields[key] ??= issue.message === "email" || issue.message === "phone" ? issue.message : "required";
  }
  return fields;
}

async function guard(token: string | undefined): Promise<LeadResult | null> {
  const ip = await clientIp();
  if (rateLimited(ip)) return { ok: false, error: "rate_limited" };
  if (!(await verifyTurnstile(token, ip))) return { ok: false, error: "captcha" };
  return null;
}

export async function submitDemoLead(input: unknown): Promise<LeadResult> {
  const parsed = demoLeadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  const blocked = await guard(parsed.data.turnstileToken);
  if (blocked) return blocked;

  const { turnstileToken: _token, attribution, ...lead } = parsed.data;
  const { score, hot } = scoreLead({
    teamSize: lead.teamSize,
    email: lead.email,
    phone: lead.phone,
    visitedPricing: attribution?.visited_pricing,
    usedCalculator: attribution?.used_calculator,
  });
  const id = randomUUID();
  await pushLead({
    id,
    type: "demo",
    status: "awaiting_demo",
    // Plan suggested from team size; the demo confirms it.
    plan: lead.teamSize === "1" ? "solo" : lead.teamSize === "11+" ? "agence" : "equipe",
    ...lead,
    score,
    hot,
    attribution: attribution ?? null,
    createdAt: new Date().toISOString(),
  });
  return { ok: true, leadId: id };
}

export async function submitExpertLead(input: unknown): Promise<LeadResult> {
  const parsed = expertLeadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation", fields: fieldErrors(parsed.error) };
  const blocked = await guard(parsed.data.turnstileToken);
  if (blocked) return blocked;

  const { turnstileToken: _token, attribution, ...lead } = parsed.data;
  const { score, hot } = scoreLead({
    email: lead.email,
    phone: lead.phone,
    visitedPricing: attribution?.visited_pricing,
    usedCalculator: attribution?.used_calculator,
    surMesure: true,
  });
  const id = randomUUID();
  await pushLead({
    id,
    type: "sur_mesure",
    plan: "sur-mesure",
    ...lead,
    score,
    hot,
    attribution: attribution ?? null,
    createdAt: new Date().toISOString(),
  });
  return { ok: true, leadId: id };
}
