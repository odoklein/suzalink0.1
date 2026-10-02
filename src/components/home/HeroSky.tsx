import { cn } from "@/lib/cn";

/**
 * The hero sky at dawn: Suzalink blue light drifting with violet and peach,
 * a hairline grid fading out from the top, and a few twinkling sparkles.
 * Decorative, CSS only; the drift stops under reduced motion.
 */
export function HeroSky({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7ff_26%,#e9f0ff_58%,#dde8ff_100%)]" />
      {/* Aurora: four soft lights, each drifting on its own clock */}
      <div className="absolute -left-[10%] -top-[16%] h-[60%] w-[50%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(76_110_255/0.5),transparent)] blur-3xl" />
      <div className="absolute -right-[8%] -top-[8%] h-[54%] w-[46%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(150_110_255/0.42),transparent)] blur-3xl [animation-delay:-7s] [animation-duration:26s]" />
      <div className="absolute right-[2%] top-[22%] h-[34%] w-[30%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(255_160_130/0.42),transparent)] blur-3xl [animation-delay:-13s] [animation-duration:30s]" />
      <div className="absolute -left-[4%] top-[26%] h-[36%] w-[30%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(90_190_255/0.42),transparent)] blur-3xl [animation-delay:-4s] [animation-duration:24s]" />
      <div className="absolute left-[18%] top-[52%] h-[40%] w-[64%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(255_190_160/0.32),transparent)] blur-3xl [animation-delay:-18s] [animation-duration:34s]" />
      {/* Hairline grid, strongest under the headline */}
      <div className="bg-grid absolute inset-0 [--grid-color:rgb(51_85_255/0.075)] [--grid-size:64px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_20%,transparent_75%)]" />
      {/* Sparkles */}
      {[
        "left-[14%] top-[22%] size-3",
        "left-[24%] top-[46%] size-2 [animation-delay:-1.4s]",
        "right-[16%] top-[18%] size-2.5 [animation-delay:-2.2s]",
        "right-[24%] top-[40%] size-3.5 [animation-delay:-0.6s]",
        "left-[40%] top-[10%] size-2 [animation-delay:-3s]",
      ].map((pos) => (
        <svg key={pos} viewBox="0 0 24 24" className={cn("absolute animate-twinkle text-accent/70", pos)}>
          <path d="M12 0c.6 5.6 2.4 7.4 12 12-9.6 4.6-11.4 6.4-12 12-.6-5.6-2.4-7.4-12-12C9.6 7.4 11.4 5.6 12 0Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
