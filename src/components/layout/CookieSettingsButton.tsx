"use client";

import type { ReactNode } from "react";
import { openConsentSettings } from "@/lib/consent";

export function CookieSettingsButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {children}
    </button>
  );
}
