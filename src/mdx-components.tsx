import type { MDXComponents } from "mdx/types";
import { Children, isValidElement, cloneElement, type ReactElement, type ReactNode } from "react";
import { FairUseTerms } from "@/components/blocks/FairUseTerms";
import { Subprocessors } from "@/components/blocks/Subprocessors";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { typo } from "@/lib/typo";

/** Applies French typography to the text inside MDX elements (legal pages, later resources). */
function typeset(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") return typo(child);
    if (isValidElement<{ children?: ReactNode }>(child) && child.props.children) {
      return cloneElement(child as ReactElement<{ children?: ReactNode }>, undefined, typeset(child.props.children));
    }
    return child;
  });
}

const components: MDXComponents = {
  h2: ({ children }) => <h2 className="mt-14 scroll-mt-24 font-display text-2xl font-normal text-ink first:mt-0">{typeset(children)}</h2>,
  h3: ({ children }) => <h3 className="mt-8 font-display text-lg font-normal text-ink">{typeset(children)}</h3>,
  p: ({ children }) => <p className="mt-4 text-ink-soft">{typeset(children)}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft marker:text-accent">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-soft marker:text-muted">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{typeset(children)}</li>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{typeset(children)}</strong>,
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link href={href as StaticPathname} className="font-medium text-accent underline underline-offset-2">
        {typeset(children)}
      </Link>
    ) : (
      <a href={href} className="font-medium text-accent underline underline-offset-2" rel="noopener">
        {typeset(children)}
      </a>
    ),
  FairUseTerms,
  Subprocessors,
};

export function useMDXComponents(overrides: MDXComponents = {}): MDXComponents {
  return { ...components, ...overrides };
}
