import type { ReactNode } from "react";
import type { Billing } from "@/config/pricing.config";
import type { Cta } from "@/content/types";
import { signupUrl } from "@/lib/links";
import { ButtonLink, type ButtonSize, type ButtonVariant } from "./Button";

type Props = {
  cta: Cta;
  label: string;
  /** Page section, sent with `cta_clicked` so drop-off can be read per section. */
  section: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  billing?: Billing;
  children?: ReactNode;
};

function planOf(cta: Cta): string {
  if (cta.kind === "trial") return "solo";
  if (cta.kind === "signup") return cta.plan;
  if (cta.kind === "expert") return "sur-mesure";
  return "";
}

export function CtaLink({ cta, label, section, variant = "primary", size = "md", className, billing, children }: Props) {
  const data = {
    "data-cta": cta.kind,
    "data-cta-section": section,
    "data-cta-label": label,
    "data-cta-plan": planOf(cta) || undefined,
  };
  const content = children ?? label;

  switch (cta.kind) {
    case "trial":
      return (
        <ButtonLink external={signupUrl("solo", billing)} variant={variant} size={size} className={className} {...data}>
          {content}
        </ButtonLink>
      );
    case "signup":
      return (
        <ButtonLink external={signupUrl(cta.plan, billing)} variant={variant} size={size} className={className} {...data}>
          {content}
        </ButtonLink>
      );
    case "demo":
      return (
        <ButtonLink href="/demo" variant={variant} size={size} className={className} {...data}>
          {content}
        </ButtonLink>
      );
    case "expert":
      return (
        <ButtonLink href={{ pathname: "/sur-mesure", hash: "contact" }} variant={variant} size={size} className={className} {...data}>
          {content}
        </ButtonLink>
      );
  }
}
