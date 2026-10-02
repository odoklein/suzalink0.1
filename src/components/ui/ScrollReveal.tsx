"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-linked "stand-up" reveal: the product starts tilted back and slightly
 * smaller, then straightens as the page scrolls (reversible, no timer).
 * Progress `--p` (0 → 1) is written to the stage; all the visuals live in CSS
 * (`.reveal-*` in globals.css). Without JS or with reduced motion, `--p` stays at
 * its CSS default of 1, i.e. the final flat state.
 */
export function ScrollReveal({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let top = 0;
    let range = 1;
    let frame = 0;

    const measure = () => {
      const vh = window.innerHeight;
      top = el.getBoundingClientRect().top + window.scrollY;
      // Done when the stage top reaches ~18% from the top of the viewport.
      range = Math.max(top - vh * 0.18, 240);
    };
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / range));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Images and fonts above the stage can shift it after mount.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stage} className="reveal-stage">
      <div className="reveal-shadow" aria-hidden />
      <div className="reveal-card">{children}</div>
      {overlay ? <div className="reveal-overlay">{overlay}</div> : null}
    </div>
  );
}
