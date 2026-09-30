"use client";

import { useEffect, useRef } from "react";
import { integrationsKeys } from "@/config/site";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Cloudflare Turnstile, only when a site key is configured. Renders nothing otherwise. */
export function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = integrationsKeys.turnstileSiteKey;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let widget: string | null = null;
    const mount = () => {
      if (!window.turnstile || !ref.current || widget) return;
      widget = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        language: "fr",
        appearance: "interaction-only",
        callback: onToken,
      });
    };
    if (window.turnstile) mount();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SCRIPT;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", mount);
    }
    return () => {
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [siteKey, onToken]);

  return siteKey ? <div ref={ref} className="min-h-0" /> : null;
}
