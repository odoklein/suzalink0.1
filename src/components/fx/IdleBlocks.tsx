"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * One observer for the whole site: top-level blocks (children of <main>, the
 * footer) get data-idle while they are off screen, and globals.css pauses the
 * decorative loops inside them. Only what is on screen costs frames.
 */
export function IdleBlocks() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-idle", !entry.isIntersecting);
      },
      { rootMargin: "160px 0px" },
    );
    document.querySelectorAll("main > *, footer").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
