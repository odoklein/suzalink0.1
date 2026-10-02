import { Lock } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { InView } from "../fx/InView";
import { hasMock, MOCK_PATH, ProductMock } from "../mocks/ProductMock";
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

/**
 * A product screenshot in a light window frame. Until the real capture lands,
 * the coded mock for that screen plays inside it. Callouts go in `children`, drawn in code.
 */
export function ScreenshotFrame({
  id,
  priority,
  sizes = "(min-width: 1024px) 640px, 100vw",
  className,
  chrome = true,
  children,
}: {
  id: ScreenshotId;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** The title bar with the traffic lights and address. */
  chrome?: boolean;
  children?: ReactNode;
}) {
  const shot = SCREENSHOTS[id];
  return (
    <figure className={cn("relative overflow-hidden rounded-[18px] bg-white shadow-[var(--shadow-window)] ring-1 ring-ink/[0.08]", className)}>
      {chrome ? (
        <div className="flex h-9 items-center gap-1.5 border-b border-line bg-[#fbfbfd] px-3.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.12)]" />
          <span className="size-2.5 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.12)]" />
          <span className="size-2.5 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgb(0_0_0/0.12)]" />
          <span className="mx-auto hidden h-5 max-w-[60%] items-center gap-1.5 truncate rounded-md bg-white px-3 font-mono text-[10.5px] text-muted ring-1 ring-line sm:inline-flex">
            <Lock className="size-2.5 shrink-0 text-mint" strokeWidth={2.5} />
            {MOCK_PATH[id]}
          </span>
          <span className="w-[42px]" />
        </div>
      ) : null}
      <div className="relative">
        {shot.src ? (
          <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} className="block h-auto w-full" />
        ) : hasMock(id) ? (
          <InView>
            <ProductMock id={id} />
            <span className="sr-only">{shot.alt}</span>
          </InView>
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
