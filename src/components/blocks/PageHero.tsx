import type { ReactNode } from "react";
import { dict, resolveTexts } from "@/content";
import type { Cta, Media } from "@/content/types";
import { cn } from "@/lib/cn";
import { CtaLink } from "../ui/CtaLink";
import { MediaView } from "../ui/Media";
import { Eyebrow, H1, Lead } from "../ui/Section";

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
  children?: ReactNode;
}) {
  const { ui } = await dict();
  const label = (cta: Cta) =>
    cta.kind === "trial" ? ui.cta.trial : cta.kind === "demo" || cta.kind === "signup" ? ui.cta.demo : ui.cta.expert;
  const side = media || aside;
  const trialMicrocopy = primary?.kind === "trial" && microcopy;

  return (
    <section data-hero className="relative overflow-hidden border-b border-line bg-white">
      <div
        className={cn(
          "container-site grid gap-12 pb-16 pt-12 md:pb-24 md:pt-20",
          side && !centered ? "items-center lg:grid-cols-[1fr_1.05fr] lg:gap-16" : "",
          centered && "text-center",
        )}
      >
        <div className={cn(centered ? "mx-auto max-w-3xl" : "max-w-2xl")}>
          <Eyebrow className={cn("mb-5", centered && "justify-center")}>{eyebrow}</Eyebrow>
          <H1>{title}</H1>
          {sub ? <Lead className="mt-6">{sub}</Lead> : null}
          {primary || secondary ? (
            <div className={cn("mt-9 flex flex-wrap gap-3", centered && "justify-center")}>
              {primary ? <CtaLink cta={primary} label={label(primary)} section={`${section}_hero`} size="lg" /> : null}
              {secondary ? <CtaLink cta={secondary} label={label(secondary)} section={`${section}_hero`} size="lg" variant="secondary" /> : null}
            </div>
          ) : null}
          {trialMicrocopy ? (
            <p className={cn("mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small text-muted", centered && "justify-center")}>
              {resolveTexts(ui.microcopy.trial).map((m, i) => (
                <span key={m.text} className="inline-flex items-center gap-3">
                  {i > 0 ? <span aria-hidden className="size-1 rounded-full bg-line-strong" /> : null}
                  {m.text}
                </span>
              ))}
            </p>
          ) : null}
          {children}
        </div>
        {media ? <MediaView media={media} priority /> : aside}
      </div>
    </section>
  );
}
