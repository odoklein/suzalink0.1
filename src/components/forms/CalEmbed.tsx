"use client";

import { useEffect, useId, useRef } from "react";

type CalApi = ((...args: unknown[]) => void) & { ns: Record<string, (...args: unknown[]) => void>; loaded?: boolean; q?: unknown[] };

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const ORIGIN = process.env.NEXT_PUBLIC_CAL_ORIGIN ?? "https://app.cal.com";

/** Cal.com's official loader snippet, only run once the slot step is shown. */
function loadCal() {
  if (window.Cal) return;
  (function (C: Window & typeof globalThis, A: string, L: string) {
    const p = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
    const d = C.document;
    const cal = function (...ar: unknown[]) {
      const self = C.Cal as CalApi & { q: unknown[] };
      if (!self.loaded) {
        self.ns = {};
        self.q = self.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        self.loaded = true;
      }
      if (ar[0] === L) {
        const api = function (...args: unknown[]) {
          p(api as unknown as { q: unknown[] }, args);
        } as unknown as ((...a: unknown[]) => void) & { q: unknown[] };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          self.ns[namespace] = self.ns[namespace] || api;
          p(self.ns[namespace] as unknown as { q: unknown[] }, ar);
          p(self, ["initNamespace", namespace]);
        } else p(self, ar);
        return;
      }
      p(self, ar);
    } as unknown as CalApi;
    C.Cal = cal;
  })(window, `${ORIGIN}/embed/embed.js`, "init");
}

/**
 * Inline Cal.com slot picker (30 min, Paris time is set on the event type).
 * Prefills the visitor's name and email and carries the lead id as metadata,
 * so the booking webhook can attach to the lead created by the form.
 */
export function CalEmbed({
  calLink,
  name,
  email,
  leadId,
  onBooked,
  loadingLabel,
}: {
  calLink: string;
  name: string;
  email: string;
  leadId: string;
  onBooked: () => void;
  loadingLabel: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const booked = useRef(onBooked);
  useEffect(() => {
    booked.current = onBooked;
  }, [onBooked]);

  useEffect(() => {
    loadCal();
    const ns = `sz${id}`;
    const Cal = window.Cal!;
    Cal("init", ns, { origin: ORIGIN });
    Cal.ns[ns]("inline", {
      elementOrSelector: `#cal-${id}`,
      calLink,
      config: { layout: "month_view", name, email, "metadata[leadId]": leadId },
    });
    Cal.ns[ns]("ui", { hideEventTypeDetails: false, layout: "month_view" });
    Cal.ns[ns]("on", { action: "bookingSuccessful", callback: () => booked.current() });
  }, [id, calLink, name, email, leadId]);

  return (
    <div id={`cal-${id}`} className="min-h-[640px] w-full overflow-auto rounded-[16px] bg-white ring-1 ring-line">
      <p className="p-6 text-sm text-muted">{loadingLabel}</p>
    </div>
  );
}
