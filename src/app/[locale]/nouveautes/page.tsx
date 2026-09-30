import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Visual } from "@/components/ui/Media";
import { H2, Section } from "@/components/ui/Section";
import { CLAIMS, claimState, type ClaimId } from "@/config/claims";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/nouveautes">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/nouveautes", getContent(locale).changelog.meta);
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** Changelog plus every « Bientôt » item: the PRD list and any claim currently shown as soon. */
export default async function ChangelogPage({ params }: PageProps<"/[locale]/nouveautes">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { changelog: c, ui, home } = getContent(locale);

  const claimSoon = (Object.keys(CLAIMS) as ClaimId[])
    .filter((id) => claimState(id) === "soon" && c.claimSoon[id])
    .map((id) => c.claimSoon[id]);
  const soon = [...c.soon, ...claimSoon];

  return (
    <>
      <PageHero eyebrow={c.hero.eyebrow} title={c.hero.title} sub={c.hero.sub} primary={{ kind: "trial" }} section="changelog" />

      <Section aria-labelledby="releases-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <H2 id="releases-title">{c.releasesTitle}</H2>
          {c.releases.length ? (
            <ol className="space-y-10 border-l border-line pl-8">
              {c.releases.map((r) => (
                <li key={r.date + r.title} className="relative">
                  <span aria-hidden className="absolute -left-[37px] top-1.5 size-3 rounded-full border-2 border-accent bg-white" />
                  <time dateTime={r.date} className="text-small font-medium text-muted">
                    {dateFmt.format(new Date(r.date))}
                  </time>
                  <h3 className="mt-1 font-display text-xl font-normal text-ink">{r.title}</h3>
                  <p className="mt-2 text-muted">{r.body}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-[20px] bg-surface p-8 text-muted ring-1 ring-line">{c.releasesEmpty}</p>
          )}
        </div>
      </Section>

      <Section tone="surface" aria-labelledby="soon-title">
        <div className="flex items-center gap-5">
          <div className="size-20 shrink-0 overflow-hidden rounded-[20px] bg-white ring-1 ring-line">
            <Visual id="V14" transparent showTag={false} className="size-full" />
          </div>
          <H2 id="soon-title">{c.soonTitle}</H2>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {soon.map((s) => (
            <li key={s.title} className="rounded-[20px] border border-dashed border-line-strong bg-white p-6">
              <Badge tone="soon">{ui.badges.soon}</Badge>
              <h3 className="mt-4 font-display text-lg font-normal text-ink">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={home.final.title} sub={home.final.sub} section="changelog_final" />
    </>
  );
}
