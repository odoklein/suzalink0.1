import Image from "next/image";
import { MASCOT } from "@/config/visuals";
import { cn } from "@/lib/cn";

/**
 * The Suzalink mascot, bobbing gently over a soft shadow drawn in CSS (the
 * shadow narrows as it rises). Decorative. Width comes from `className`;
 * motion stops under prefers-reduced-motion.
 */
export function Mascot({ pose = "wave", className, priority }: { pose?: keyof typeof MASCOT; className?: string; priority?: boolean }) {
  const m = MASCOT[pose];
  return (
    <span aria-hidden className={cn("relative inline-flex flex-col items-center", className)}>
      <Image
        src={m.src}
        alt=""
        width={m.width}
        height={m.height}
        sizes="(min-width: 768px) 144px, 112px"
        priority={priority}
        className="relative z-10 h-auto w-full motion-safe:animate-bob"
      />
      <span className="-mt-1.5 h-3 w-3/5 rounded-[50%] bg-ink/20 blur-[5px] motion-safe:animate-bob-shadow" />
    </span>
  );
}
