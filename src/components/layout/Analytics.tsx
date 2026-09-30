"use client";

import { useEffect } from "react";
import { integrationsKeys } from "@/config/site";
import { attachSink, track } from "@/lib/analytics";
import { attributionParams, captureAttribution, getAttribution, markAttribution } from "@/lib/attribution";
import { readBilling } from "@/lib/billing-pref";
import { CONSENT_EVENT, readConsent, type Consent } from "@/lib/consent";
import { isSignupUrl } from "@/lib/links";

type PostHog = typeof import("posthog-js").default;

/**
 * - Stores first-visit attribution and adds it (plus the billing choice) to signup links.
 * - Sends `cta_clicked` for every element carrying data-cta.
 * - Loads PostHog (EU) in memory-only mode, and persists only after consent.
 * - Loads the LinkedIn Insight tag only after marketing consent.
 */
export function Analytics() {
  useEffect(() => {
    captureAttribution();
    if (location.pathname.startsWith("/tarifs")) markAttribution({ visited_pricing: true });

    const decorate = (anchor: HTMLAnchorElement) => {
      if (!isSignupUrl(anchor.href)) return;
      const url = new URL(anchor.href);
      const billing = readBilling();
      if (billing) url.searchParams.set("billing", billing);
      for (const [k, v] of Object.entries(attributionParams(getAttribution()))) url.searchParams.set(k, v);
      anchor.href = url.toString();
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-cta], a[href]");
      if (!el) return;
      if (el instanceof HTMLAnchorElement) decorate(el);
      if (el.dataset.cta) {
        track("cta_clicked", {
          section: el.dataset.ctaSection,
          label: el.dataset.ctaLabel,
          plan: el.dataset.ctaPlan,
          kind: el.dataset.cta,
        });
      }
    };

    // pointerdown catches middle-clicks and "open in new tab" before the URL is read.
    const onPointer = (e: PointerEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (a) decorate(a);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);

  useEffect(() => {
    let posthog: PostHog | null = null;
    let cancelled = false;

    const applyConsent = (consent: Consent | null) => {
      if (posthog) posthog.set_config({ persistence: consent?.analytics ? "localStorage+cookie" : "memory" });
      if (consent?.marketing) loadLinkedIn();
    };

    const onConsent = (e: Event) => applyConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, onConsent);

    if (integrationsKeys.posthogKey) {
      const start = () =>
        import("posthog-js").then(({ default: ph }) => {
          if (cancelled) return;
          ph.init(integrationsKeys.posthogKey, {
            api_host: integrationsKeys.posthogHost,
            persistence: readConsent()?.analytics ? "localStorage+cookie" : "memory",
            autocapture: false,
            capture_pageview: "history_change",
            disable_session_recording: true,
            person_profiles: "identified_only",
          });
          posthog = ph;
          attachSink((event, props) => ph.capture(event, props, { transport: "sendBeacon" }));
        });
      if ("requestIdleCallback" in window) requestIdleCallback(() => void start(), { timeout: 3000 });
      else setTimeout(() => void start(), 1500);
    }

    applyConsent(readConsent());

    return () => {
      cancelled = true;
      window.removeEventListener(CONSENT_EVENT, onConsent);
    };
  }, []);

  return null;
}

function loadLinkedIn() {
  const id = integrationsKeys.linkedinPartnerId;
  if (!id || document.getElementById("li-insight")) return;
  const w = window as unknown as { _linkedin_partner_id?: string; _linkedin_data_partner_ids?: string[] };
  w._linkedin_partner_id = id;
  w._linkedin_data_partner_ids = [...(w._linkedin_data_partner_ids ?? []), id];
  const s = document.createElement("script");
  s.id = "li-insight";
  s.async = true;
  s.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  document.head.appendChild(s);
}
