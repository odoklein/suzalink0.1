"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders a fixed-size (designWidth × designHeight) layout scaled to fit its
 * container width. The scaled layer is out of flow, so its design width never
 * widens a grid or flex column around it.
 */
export function FitBox({ designWidth, designHeight, children }: { designWidth: number; designHeight: number; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / designWidth);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  const s = scale ?? 0.5;
  return (
    <div
      ref={outer}
      className="relative w-full min-w-0 overflow-hidden"
      style={{ height: designHeight * s, visibility: scale === null ? "hidden" : "visible" }}
    >
      <div className="absolute left-0 top-0" style={{ width: designWidth, height: designHeight, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        {children}
      </div>
    </div>
  );
}
