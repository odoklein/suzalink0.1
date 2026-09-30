import Image from "next/image";
import type { ReactNode } from "react";
import { SCREENSHOTS, VISUALS, type ScreenshotId, type VisualId } from "@/config/visuals";
import type { Media } from "@/content/types";
import { cn } from "@/lib/cn";
import { ScreenshotSkeleton } from "../visuals/ScreenshotSkeleton";
import { VisualArt } from "../visuals/VisualArt";

function PlaceholderTag({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-line backdrop-blur">
      <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/** A real product screenshot in a light window frame. Callouts go in `children`, drawn in code. */
export function ScreenshotFrame({
  id,
  priority,
  sizes = "(min-width: 1024px) 640px, 100vw",
  className,
  children,
}: {
  id: ScreenshotId;
  priority?: boolean;
  sizes?: string;
  className?: string;
  children?: ReactNode;
}) {
  const shot = SCREENSHOTS[id];
  return (
    <figure className={cn("relative overflow-hidden rounded-[16px] bg-white shadow-[var(--shadow-window)] ring-1 ring-line", className)}>
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-white px-3.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 h-4 w-40 max-w-[40%] rounded-md bg-surface" />
      </div>
      <div className="relative">
        {shot.src ? (
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} className="block h-auto w-full" />
        ) : (
          <>
            <ScreenshotSkeleton id={id} />
            <span className="sr-only">{shot.alt}</span>
            <PlaceholderTag>
              Capture à venir · {id} {shot.label}
            </PlaceholderTag>
          </>
        )}
        {children}
      </div>
    </figure>
  );
}

/** A generated visual from the prompt pack, or its placeholder art. */
export function Visual({
  id,
  priority,
  sizes = "(min-width: 1024px) 560px, 100vw",
  className,
  transparent,
  showTag = true,
  fill,
}: {
  id: VisualId;
  priority?: boolean;
  sizes?: string;
  className?: string;
  transparent?: boolean;
  showTag?: boolean;
  /** Fill the box given by `className` (cropped) instead of keeping the image's ratio. */
  fill?: boolean;
}) {
  const v = VISUALS[id];
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? "");
  return (
    <div
      className={cn("overflow-hidden", !positioned && "relative", className)}
      style={fill ? undefined : { aspectRatio: `${v.width} / ${v.height}` }}
    >
      {v.src ? (
        <Image src={v.src} alt={v.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <>
          <VisualArt id={id} width={v.width} height={v.height} transparent={transparent} />
          {v.alt ? <span className="sr-only">{v.alt}</span> : null}
          {showTag ? (
            <PlaceholderTag>
              Visuel à venir · {id} {v.label}
            </PlaceholderTag>
          ) : null}
        </>
      )}
    </div>
  );
}

export function MediaView({ media, className, priority }: { media: Media; className?: string; priority?: boolean }) {
  if ("screenshot" in media) return <ScreenshotFrame id={media.screenshot} className={className} priority={priority} />;
  return <Visual id={media.visual} className={cn("rounded-[20px]", className)} priority={priority} />;
}
