"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CtaLink } from "../ui/CtaLink";

/**
 * Mobile only: both CTAs pinned to the bottom once the page hero ([data-hero])
 * has scrolled out of view. Hidden while the consent banner is open.
 */
export function MobileCtaBar({ trial, demo, label }: { trial: string; demo: string; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return;
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <div
      role="region"
      aria-label={label}
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-200 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <CtaLink cta={{ kind: "demo" }} label={demo} section="mobile_bar" variant="secondary" className="flex-1" />
        <CtaLink cta={{ kind: "trial" }} label={trial} section="mobile_bar" className="flex-1" />
      </div>
    </div>
  );
}
