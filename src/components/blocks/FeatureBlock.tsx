import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { DeepDive } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { MediaView } from "../ui/Media";
import { Eyebrow, twoTone } from "../ui/Section";
import { Bullets } from "./Bullets";

const headingClass =
  "font-display text-[32px] font-normal leading-[36px] tracking-[-0.016em] text-ink md:text-[42px] md:leading-[46px]";

function MoreLink({ link, className }: { link: DeepDive["link"]; className?: string }) {
  if (!link) return null;
  return (
    <Link href={link.href} className={cn("inline-flex items-center gap-1.5 font-semibold text-accent hover:gap-2.5 hover:underline", className)}>
      {link.label}
      <ArrowRight aria-hidden className="size-4 transition-transform" />
    </Link>
  );
}

/**
 * Two layouts:
 * - `split` (default): text on one side, product media on the other; `reverse` flips the sides.
 * - `stacked`: headline left and copy right, then the product wide underneath,
 *   fading out at the bottom, with the bullets in three columns below it.
 */
export function FeatureBlock({
  block,
  reverse,
  extra,
  headingLevel = "h3",
  layout = "split",
}: {
  block: DeepDive;
  reverse?: boolean;
  /** Decorative media layered over the main one (a small visual, a second screenshot). */
  extra?: ReactNode;
  headingLevel?: "h2" | "h3";
  layout?: "split" | "stacked";
}) {
  const Heading = headingLevel;

  if (layout === "stacked") {
    return (
      <div>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-20">
          <div>
            {block.eyebrow ? <Eyebrow className="mb-5">{block.eyebrow}</Eyebrow> : null}
            <Heading className={headingClass}>{twoTone(block.title)}</Heading>
          </div>
          <div className="lg:pb-1.5">
            <p className="text-muted">{block.body}</p>
            <MoreLink link={block.link} className="mt-5" />
          </div>
        </div>
        <div className="relative mt-10 md:mt-14">
          <div className="max-h-[520px] overflow-hidden px-1 pt-1 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
            <MediaView media={block.media} />
          </div>
          {extra}
        </div>
        <Bullets items={block.bullets} columns className="mt-6 md:mt-2" />
      </div>
    );
  }

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className={cn("max-w-xl", reverse && "lg:order-2")}>
        {block.eyebrow ? <Eyebrow className="mb-5">{block.eyebrow}</Eyebrow> : null}
        <Heading className={headingClass}>{twoTone(block.title)}</Heading>
        <p className="mt-5 text-muted">{block.body}</p>
        <Bullets items={block.bullets} className="mt-7" />
        <MoreLink link={block.link} className="mt-8" />
      </div>
      <div className={cn("relative", reverse && "lg:order-1")}>
        <MediaView media={block.media} />
        {extra}
      </div>
    </div>
  );
}
