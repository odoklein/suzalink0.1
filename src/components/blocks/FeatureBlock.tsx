import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Hue } from "@/config/hues";
import type { DeepDive } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { MediaView } from "../ui/Media";
import { Eyebrow, twoTone } from "../ui/Section";
import { Bullets } from "./Bullets";
import { Stage } from "./Stage";

const headingClass =
  "font-display text-[34px] font-normal leading-[38px] tracking-[-0.018em] text-ink md:text-[46px] md:leading-[50px]";

function MoreLink({ link, className }: { link: DeepDive["link"]; className?: string }) {
  if (!link) return null;
  return (
    <Link href={link.href} className={cn("group inline-flex items-center gap-1.5 font-semibold text-accent", className)}>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover:bg-[length:100%_1.5px]">
        {link.label}
      </span>
      <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
    </Link>
  );
}

/**
 * Two layouts:
 * - `split` (default): text on one side, product media on its stage on the other; `reverse` flips the sides.
 * - `stacked`: headline left and copy right, then the product rising out of a wide stage,
 *   with the bullets in three columns below it.
 * `hue` tints the stage, the eyebrow and the bullets; `tone="night"` puts the product under a night sky.
 */
export function FeatureBlock({
  block,
  reverse,
  extra,
  headingLevel = "h3",
  layout = "split",
  hue = "accent",
  tone = "day",
  index,
}: {
  block: DeepDive;
  reverse?: boolean;
  /** Decorative media layered over the main one (a small visual, a second screenshot). */
  extra?: ReactNode;
  headingLevel?: "h2" | "h3";
  layout?: "split" | "stacked";
  hue?: Hue;
  tone?: "day" | "night";
  /** « 01 », « 02 »… when the blocks read as a sequence. */
  index?: string;
}) {
  const Heading = headingLevel;
  const eyebrow = block.eyebrow ? (
    <Eyebrow className="mb-5" hue={hue} index={index}>
      {block.eyebrow}
    </Eyebrow>
  ) : null;

  if (layout === "stacked") {
    return (
      <div>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20">
          <div data-reveal="blur">
            {eyebrow}
            <Heading className={headingClass}>{twoTone(block.title)}</Heading>
          </div>
          <div className="lg:pb-1.5" data-reveal style={vars({ "--i": 1 })}>
            <p className="text-muted">{block.body}</p>
            <MoreLink link={block.link} className="mt-5" />
          </div>
        </div>
        <div className="relative mt-10 md:mt-14" data-reveal="scale" data-reveal-tall>
          <Stage hue={hue} tone={tone} className="overflow-clip px-3 pt-4 sm:px-8 sm:pt-10 md:px-14 md:pt-14">
            <div className="max-h-[600px] overflow-hidden rounded-t-[18px] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
              <MediaView media={block.media} />
            </div>
          </Stage>
          {extra}
        </div>
        <Bullets items={block.bullets} columns hue={hue} className="mt-8 md:mt-10" />
      </div>
    );
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className={cn("max-w-xl", reverse && "lg:order-2")}>
        <div data-reveal="blur">
          {eyebrow}
          <Heading className={headingClass}>{twoTone(block.title)}</Heading>
        </div>
        <div data-reveal style={vars({ "--i": 1 })}>
          <p className="mt-5 text-muted">{block.body}</p>
        </div>
        <Bullets items={block.bullets} hue={hue} className="mt-7" />
        <MoreLink link={block.link} className="mt-8" />
      </div>
      <div className={cn("relative min-w-0", reverse && "lg:order-1")} data-reveal="scale">
        <Stage hue={hue} tone={tone} className="p-3 sm:p-6 md:p-8">
          <MediaView media={block.media} />
        </Stage>
        {extra}
      </div>
    </div>
  );
}
