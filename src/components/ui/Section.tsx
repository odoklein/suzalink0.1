import type { ReactNode } from "react";
import { HUE, type Hue } from "@/config/hues";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";

type Tone = "white" | "surface";

export function Section({
  id,
  tone = "white",
  className,
  containerClassName,
  children,
  ...rest
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
} & Record<`data-${string}`, string | boolean | undefined> & { "aria-labelledby"?: string }) {
  return (
    <section id={id} className={cn("section-y relative", tone === "surface" ? "bg-surface" : "bg-bg", className)} {...rest}>
      <div className={cn("container-site", containerClassName)}>{children}</div>
    </section>
  );
}

/**
 * Eyebrow label: a small pill led by a stroke of the Suzalink line, or by an
 * index (« 01 ») in sections that read as a sequence. `hue` tints the lead.
 */
export function Eyebrow({ children, className, hue = "accent", index }: { children: ReactNode; className?: string; hue?: Hue; index?: string }) {
  const h = HUE[hue];
  return (
    <p className={cn("flex", className)}>
      <span className="inline-flex items-center gap-2 rounded-full bg-white/85 py-1 pl-1.5 pr-3 text-[13px] font-medium leading-5 text-ink-soft shadow-[0_1px_2px_rgb(11_18_32/0.05),0_6px_16px_-8px_rgb(51_85_255/0.28)] ring-1 ring-line backdrop-blur">
        {index ? (
          <span className={cn("num inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold", h.soft, h.ink)}>{index}</span>
        ) : (
          <span className={cn("inline-flex size-5 items-center justify-center rounded-full", h.soft)}>
            <svg aria-hidden viewBox="0 0 16 8" className={cn("h-2 w-3 shrink-0", h.text)}>
              <path d="M1 6c2.5-5 5-5 7-2s4.5 3 7-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
        )}
        {children}
      </span>
    </p>
  );
}

/**
 * A headline made of two sentences reads as two lines: the claim in ink, the
 * payoff in a quieter slate that drifts into Suzalink blue. Anything else renders as given.
 */
export function twoTone(children: ReactNode, dark?: boolean): ReactNode {
  if (typeof children !== "string") return children;
  const parts = children.split(/(?<=[.!?…])\s+(?=\S)/u);
  if (parts.length !== 2) return children;
  return (
    <>
      <span className="block">{parts[0]}</span>
      {/* Padding keeps the descenders inside the clipped gradient. */}
      <span className={cn("-mb-[0.14em] inline-block pb-[0.14em]", dark ? "text-quiet-gradient-dark" : "text-quiet-gradient")}>{parts[1]}</span>
    </>
  );
}

/** `size="split"` for a hero that shares its row with media. */
export function H1({ children, className, id, size = "full" }: { children: ReactNode; className?: string; id?: string; size?: "full" | "split" }) {
  return (
    <h1
      id={id}
      className={cn(
        "font-display font-normal text-ink",
        size === "split" ? "text-h1m md:text-[3.25rem] md:leading-[3.5rem] md:tracking-[-0.022em] xl:text-[3.75rem] xl:leading-[4rem]" : "text-h1m md:text-h1",
        className,
      )}
    >
      {twoTone(children)}
    </h1>
  );
}

/** `dark` for headlines on a night stage. */
export function H2({ children, className, id, dark }: { children: ReactNode; className?: string; id?: string; dark?: boolean }) {
  return (
    <h2 id={id} className={cn("font-display text-h2m font-normal md:text-h2", dark ? "text-white" : "text-ink", className)}>
      {twoTone(children, dark)}
    </h2>
  );
}

export function H3({ children, className, as: Tag = "h3" }: { children: ReactNode; className?: string; as?: "h3" | "h4" }) {
  return <Tag className={cn("font-display text-h3 font-normal text-ink", className)}>{children}</Tag>;
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-bodym text-muted md:text-body", className)}>{children}</p>;
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "left",
  id,
  className,
  hue,
  index,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
  hue?: Hue;
  index?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "relative isolate mx-auto text-center", className)}>
      {/* Centred headlines sit in a soft patch of sky */}
      {center ? <div aria-hidden className="sky-haze pointer-events-none absolute -inset-x-28 -inset-y-14 -z-10" /> : null}
      {eyebrow ? (
        <div data-reveal="fade">
          <Eyebrow className={cn("mb-5", center && "justify-center")} hue={hue} index={index}>
            {eyebrow}
          </Eyebrow>
        </div>
      ) : null}
      <div data-reveal="blur">
        <H2 id={id}>{title}</H2>
      </div>
      {sub ? (
        <div data-reveal style={vars({ "--i": 1 })}>
          <Lead className={cn("mt-5", center && "mx-auto max-w-2xl")}>{sub}</Lead>
        </div>
      ) : null}
    </div>
  );
}
