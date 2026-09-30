"use client";

import { useEffect, useRef, useState } from "react";

const fmt = new Intl.NumberFormat("fr-FR");

/**
 * Counts up once when scrolled into view. The final value is in the HTML, so
 * crawlers, no-JS visitors and reduced-motion users always see the real figure.
 */
export function StatCounter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) return; // already on screen: no flash back to 0

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 300;
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    // Off screen: reset so the count-up is visible when it arrives.
    frame = requestAnimationFrame(() => setDisplay(0));
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      <span className="num">{fmt.format(display)}</span>
      {suffix}
    </span>
  );
}
