import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

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
    <section id={id} className={cn("section-y", tone === "surface" ? "bg-surface" : "bg-bg", className)} {...rest}>
      <div className={cn("container-site", containerClassName)}>{children}</div>
    </section>
  );
}

/** Eyebrow label: a small pill led by a stroke of the Suzalink line. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex", className)}>
      <span className="inline-flex items-center gap-2 rounded-full bg-white/85 py-1 pl-2.5 pr-3 text-[13px] font-medium leading-5 text-ink-soft shadow-[0_1px_2px_rgb(11_18_32/0.05)] ring-1 ring-line backdrop-blur">
        <svg aria-hidden viewBox="0 0 16 8" className="h-2 w-4 shrink-0 text-accent">
          <path d="M1 6c2.5-5 5-5 7-2s4.5 3 7-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {children}
      </span>
    </p>
  );
}

/**
 * A headline made of two sentences reads as two lines: the claim in ink, the
 * payoff in a quieter blue-grey. Anything else renders as given.
 */
export function twoTone(children: ReactNode): ReactNode {
  if (typeof children !== "string") return children;
  const parts = children.split(/(?<=[.!?…])\s+(?=\S)/u);
  if (parts.length !== 2) return children;
  return (
    <>
      <span className="block">{parts[0]}</span>
      <span className="block text-ink-quiet">{parts[1]}</span>
    </>
  );
}

export function H1({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h1 id={id} className={cn("font-display text-h1m font-normal text-ink md:text-h1", className)}>
      {twoTone(children)}
    </h1>
  );
}

export function H2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={cn("font-display text-h2m font-normal text-ink md:text-h2", className)}>
      {twoTone(children)}
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
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  id?: string;
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={cn("max-w-3xl", center && "relative isolate mx-auto text-center", className)}>
      {/* Centred headlines sit in a soft patch of sky */}
      {center ? <div aria-hidden className="sky-haze pointer-events-none absolute -inset-x-28 -inset-y-14 -z-10" /> : null}
      {eyebrow ? <Eyebrow className={cn("mb-5", center && "justify-center")}>{eyebrow}</Eyebrow> : null}
      <H2 id={id}>{title}</H2>
      {sub ? <Lead className={cn("mt-5", center && "mx-auto max-w-2xl")}>{sub}</Lead> : null}
    </div>
  );
}
