import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link, type Href } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-[background-color,box-shadow,color,scale,filter] duration-300 ease-out-quint active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "btn-shine bg-[linear-gradient(180deg,#5571ff_0%,#2f4ff5_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),inset_0_-2px_6px_rgb(20_30_140/0.25),0_1px_2px_rgb(11_18_32/0.16),0_10px_24px_-10px_rgb(51_85_255/0.75)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.3),inset_0_-2px_6px_rgb(20_30_140/0.25),0_1px_2px_rgb(11_18_32/0.16),0_16px_32px_-12px_rgb(51_85_255/0.85)] hover:brightness-110",
  secondary: "bg-white text-ink shadow-[0_1px_2px_rgb(11_18_32/0.05)] ring-1 ring-inset ring-line-strong hover:bg-surface hover:ring-ink/25",
  ghost: "text-ink hover:bg-surface",
  inverse: "btn-shine bg-white text-ink shadow-[0_8px_24px_-10px_rgb(0_0_0/0.4)] hover:bg-white/90",
  dark: "btn-shine bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(11_18_32/0.2),0_8px_20px_-10px_rgb(11_18_32/0.6)] hover:bg-[#1a2238]",
};

/** Primary links end on a small chevron that nudges forward on hover. */
function withChevron(variant: ButtonVariant | undefined, children: ReactNode) {
  if ((variant ?? "primary") !== "primary") return children;
  return (
    <>
      {children}
      <ChevronRight aria-hidden className="-mr-1 size-4 opacity-80 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
    </>
  );
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5.5 text-[15px]",
  lg: "h-12 px-6.5 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode };

/** A button-styled link: internal routes use the localized Link, external URLs a plain anchor. */
export function ButtonLink({
  variant,
  size,
  className,
  children,
  href,
  external,
  ...rest
}: Common &
  ({ href: Href; external?: undefined } | { href?: undefined; external: string }) &
  Record<`data-${string}`, string | undefined>) {
  const cls = buttonClass(variant, size, className);
  const content = withChevron(variant, children);
  if (external !== undefined) {
    return (
      <a href={external} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
