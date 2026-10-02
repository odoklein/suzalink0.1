import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { hueVar, type Hue } from "@/config/hues";
import { dict, resolveTexts } from "@/content";
import type { Cta, Media } from "@/content/types";
import { cn } from "@/lib/cn";
import { CtaLink } from "../ui/CtaLink";
import { MediaView } from "../ui/Media";
import { Eyebrow, H1, Lead } from "../ui/Section";
import { Stage } from "./Stage";

/** The sky behind an inner-page hero, tinted with the page's hue (--hue). */
export function PageSky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,color-mix(in_srgb,var(--hue)_7%,white)_58%,#ffffff_100%)]" />
      <div className="absolute -left-[12%] -top-[24%] h-[78%] w-[52%] animate-aurora rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--hue)_34%,transparent),transparent)] blur-3xl" />
      <div className="absolute -right-[10%] -top-[6%] h-[64%] w-[44%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.18),transparent)] blur-3xl [animation-delay:-8s] [animation-duration:28s]" />
      <div className="absolute right-[18%] top-[48%] h-[40%] w-[34%] animate-aurora rounded-full bg-[radial-gradient(closest-side,rgb(255_170_140/0.16),transparent)] blur-3xl [animation-delay:-14s] [animation-duration:32s]" />
      <div className="bg-grid absolute inset-0 [--grid-color:color-mix(in_srgb,var(--hue)_10%,transparent)] [--grid-size:60px] [mask-image:radial-gradient(ellipse_75%_65%_at_30%_0%,#000_20%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}

/** Inner-page hero. Marked data-hero so the mobile CTA bar appears once it scrolls away. */
export async function PageHero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  media,
  aside,
  section,
  centered,
  microcopy = true,
  hue = "accent",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
  media?: Media;
  aside?: ReactNode;
  section: string;
  centered?: boolean;
  microcopy?: boolean;
  /** Tints the sky, the eyebrow and the media stage. */
  hue?: Hue;
  children?: ReactNode;
}) {
  const { ui } = await dict();
  const label = (cta: Cta) =>
    cta.kind === "trial" ? ui.cta.trial : cta.kind === "demo" || cta.kind === "signup" ? ui.cta.demo : ui.cta.expert;
  const side = media || aside;
  const trialMicrocopy = primary?.kind === "trial" && microcopy;

  return (
    // Pulled up under the transparent header so the sky starts at the top edge.
    <section data-hero className="relative isolate -mt-[68px] overflow-clip pt-[68px]" style={hueVar(hue)}>
      <PageSky />
      <div
        className={cn(
          "container-site grid gap-12 pb-16 pt-12 md:pb-24 md:pt-20",
          side && !centered ? "items-center lg:grid-cols-[1fr_1.05fr] lg:gap-16" : "",
          centered && "text-center",
        )}
      >
        <div className={cn(centered ? "mx-auto max-w-3xl" : "max-w-2xl")}>
          <div className="animate-rise">
            <Eyebrow className={cn("mb-6", centered && "justify-center")} hue={hue}>
              {eyebrow}
            </Eyebrow>
          </div>
          <div className="animate-rise [animation-delay:90ms]">
            <H1 size={side && !centered ? "split" : "full"}>{title}</H1>
          </div>
          {sub ? (
            <div className="animate-rise [animation-delay:180ms]">
              <Lead className="mt-6">{sub}</Lead>
            </div>
          ) : null}
          {primary || secondary ? (
            <div className={cn("mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:260ms]", centered && "justify-center")}>
              {primary ? <CtaLink cta={primary} label={label(primary)} section={`${section}_hero`} size="lg" /> : null}
              {secondary ? <CtaLink cta={secondary} label={label(secondary)} section={`${section}_hero`} size="lg" variant="secondary" /> : null}
            </div>
          ) : null}
          {trialMicrocopy ? (
            <ul className={cn("mt-6 flex animate-fade-in flex-wrap items-center gap-x-5 gap-y-2 text-small text-ink-soft [animation-delay:420ms]", centered && "justify-center")}>
              {resolveTexts(ui.microcopy.trial).map((m) => (
                <li key={m.text} className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-mint-soft text-mint-ink">
                    <Check aria-hidden className="size-2.5" strokeWidth={3.5} />
                  </span>
                  {m.text}
                </li>
              ))}
            </ul>
          ) : null}
          {children}
        </div>
        {media ? (
          <div className="min-w-0 animate-rise [animation-delay:240ms] [animation-duration:1.2s]">
            <Stage hue={hue} className="p-3 sm:p-5">
              <MediaView media={media} priority />
            </Stage>
          </div>
        ) : aside ? (
          <div className="min-w-0 animate-rise [animation-delay:240ms] [animation-duration:1.2s]">{aside}</div>
        ) : null}
      </div>
    </section>
  );
}
