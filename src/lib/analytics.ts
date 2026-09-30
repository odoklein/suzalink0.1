/**
 * Event tracking. Components call `track()`; the provider (PostHog EU when
 * configured) is attached later by <Analytics />, and early events are queued.
 *
 * Events (PRD): cta_clicked, pricing_toggle, calculator_changed,
 * demo_form_submitted, demo_booked, expert_form_submitted, expert_booked.
 * signup_*, trial_activated, checkout_* and addon_added are fired by the app.
 */
export type EventProps = Record<string, string | number | boolean | null | undefined>;
type Sink = (event: string, props: EventProps) => void;

let sink: Sink | null = null;
const queue: Array<[string, EventProps]> = [];

export function track(event: string, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...props, path: window.location.pathname };
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, payload);
  if (sink) sink(event, payload);
  else if (queue.length < 50) queue.push([event, payload]);
}

export function attachSink(next: Sink) {
  sink = next;
  for (const [event, props] of queue.splice(0)) next(event, props);
}
