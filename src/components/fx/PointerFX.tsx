"use client";

import { useEffect } from "react";

/**
 * One pointer listener for the whole site. Writes the pointer position into
 * --mx / --my on the hovered [data-spotlight] element, and tilt angles into
 * --rx / --ry on [data-tilt] (globals.css draws both). Fine pointers only;
 * no tilt under reduced motion.
 */
export function PointerFX() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const untilt = () => {
      if (!tilted) return;
      tilted.style.removeProperty("--rx");
      tilted.style.removeProperty("--ry");
      tilted = null;
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      const spot = target?.closest<HTMLElement>("[data-spotlight]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(1)}px`);
        spot.style.setProperty("--my", `${(e.clientY - r.top).toFixed(1)}px`);
      }

      const tilt = reduce ? null : target?.closest<HTMLElement>("[data-tilt]");
      if (tilted && tilted !== tilt) untilt();
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
        tilted = tilt;
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) untilt();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
