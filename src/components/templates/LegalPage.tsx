import type { Metadata } from "next";
import type { ComponentType } from "react";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Eyebrow, H1 } from "../ui/Section";
import Cgv from "@/content/fr/legal/cgv.mdx";
import Confidentialite from "@/content/fr/legal/confidentialite.mdx";
import Cookies from "@/content/fr/legal/cookies.mdx";
import Dpa from "@/content/fr/legal/dpa.mdx";
import MentionsLegales from "@/content/fr/legal/mentions-legales.mdx";

export type LegalSlug = "mentions-legales" | "cgv" | "confidentialite" | "cookies" | "dpa";

/** Add the English MDX files here when /en ships. */
const DOCS: Record<Locale, Record<LegalSlug, ComponentType>> = {
  fr: { "mentions-legales": MentionsLegales, cgv: Cgv, confidentialite: Confidentialite, cookies: Cookies, dpa: Dpa },
};

/** Legal pages: long-form MDX in a readable column, with the draft notice until counsel signs off. */
export function legalPage(slug: LegalSlug, updated: string) {
  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    return pageMetadata(locale, `/${slug}`, getContent(locale).legalMeta[slug]);
  }

  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const locale = (await params).locale as Locale;
    setRequestLocale(locale);
    const { legalMeta, legalCommon } = getContent(locale);
    const Doc = DOCS[locale][slug];
    const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(updated));

    return (
      <article data-hero className="bg-white">
        <div className="container-site py-12 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Eyebrow className="mb-5">
              {legalCommon.updated} : {date}
            </Eyebrow>
            <H1 className="text-[36px] leading-[44px] md:text-[48px] md:leading-[56px]">{legalMeta[slug].title}</H1>
            <p className="mt-6 rounded-[12px] bg-surface px-4 py-3 text-sm font-medium text-ink-soft ring-1 ring-line">{legalCommon.draft}</p>
            <div className="mt-10">
              <Doc />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return { generateMetadata, Page };
}
