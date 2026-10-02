"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Whether an element is on screen now (`inView`) and whether it ever was (`seen`). */
export function useInView<T extends Element>({ rootMargin = "0px", threshold = 0 }: { rootMargin?: string; threshold?: number } = {}) {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ inView: false, seen: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setState((s) => ({ inView: entry.isIntersecting, seen: s.seen || entry.isIntersecting })),
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return { ref, ...state };
}

/**
 * Marks a block with data-inview (live) and data-seen (sticky). globals.css
 * pauses animations inside while it is off screen and plays the one-shot
 * entrances ([data-draw-on-view], [data-grow-on-view]…) the first time it shows.
 */
export function InView({
  className,
  children,
  rootMargin = "0px 0px -10% 0px",
}: {
  className?: string;
  children: ReactNode;
  rootMargin?: string;
}) {
  const { ref, inView, seen } = useInView<HTMLDivElement>({ rootMargin });
  return (
    <div ref={ref} className={className} data-inview={inView} data-seen={seen}>
      {children}
    </div>
  );
}
