import { cn } from "@/lib/cn";

/**
 * A drifting band of clouds: two identical tiles side by side, sliding left
 * forever (`animate-drift`). Decorative; still under reduced motion.
 */
export function Clouds({ className, duration = 90, reverse }: { className?: string; duration?: number; reverse?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-x-0 h-40 overflow-hidden", className)}>
      <div
        className="flex h-full w-[200%] animate-drift"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : undefined }}
      >
        <div className="cloud-band h-full w-1/2" />
        <div className="cloud-band h-full w-1/2" />
      </div>
    </div>
  );
}
