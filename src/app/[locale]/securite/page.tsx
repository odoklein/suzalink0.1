import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { PageHero } from "@/components/blocks/PageHero";
import { Subprocessors } from "@/components/blocks/Subprocessors";
import { Badge } from "@/components/ui/Badge";
import { IconTile } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { H2, Lead, Section, SectionHeader } from "@/components/ui/Section";
import { EuropeMap } from "@/components/visuals/EuropeMap";
import { isLive, isShown } from "@/config/claims";
import { site } from "@/config/site";
import { getContent, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/securite">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/securite", getContent(locale).security.meta);
}

/** States only claims marked verified in src/config/claims.ts (in strict mode). */
export default async function SecurityPage({ params }: PageProps<"/[locale]/securite">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { security: s, home, ui } = getContent(locale);
  const controls = visibleItems(s.controls.items);

  return (
    <>
      <PageHero eyebrow={s.hero.eyebrow} title={s.hero.title} sub={s.hero.sub} primary={{ kind: "demo" }} section="security" />

      {isShown("hosting-fr") ? (
        <Section tone="surface" aria-labelledby="hosting-title">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
            <div>
              <IconTile name="server" />
              <H2 id="hosting-title" className="mt-6">
                {s.hosting.title}
              </H2>
              <Lead className="mt-5">{s.hosting.body}</Lead>
              {isLive("ai-mistral") ? (
                <div className="mt-10 rounded-[20px] bg-white p-6 ring-1 ring-line">
                  <p className="font-display text-lg font-normal text-ink">{s.ai.title}</p>
                  <p className="mt-1 text-muted">{s.ai.body}</p>
                </div>
              ) : null}
            </div>
            <div className="thread-draw rounded-[28px] bg-white p-4 ring-1 ring-line md:p-8">
              <EuropeMap labels={home.sovereignty.map} className="w-full" />
            </div>
          </div>
        </Section>
      ) : null}

      <Section aria-labelledby="controls-title">
        <SectionHeader id="controls-title" title={s.controls.title} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((c) => (
            <li key={c.title} className="rounded-[20px] bg-white p-6 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <IconTile name={c.icon} />
                {c.soon ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
              </div>
              <h3 className="mt-5 font-display text-lg font-normal text-ink">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{c.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="surface" aria-labelledby="gdpr-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <H2 id="gdpr-title">{s.gdpr.title}</H2>
            <ul className="mt-8 space-y-4">
              {s.gdpr.items.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-5">
              <Link href="/dpa" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                {s.gdpr.dpa} <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/confidentialite" className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
                {s.gdpr.privacy} <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
          <Subprocessors />
        </div>
      </Section>

      {isShown("uptime-99") ? (
        <Section aria-labelledby="uptime-title">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-white p-8 ring-1 ring-line md:flex-row md:items-center md:p-12">
            <div>
              <H2 id="uptime-title" className="text-[28px] leading-9">
                {s.uptime.title}
              </H2>
              <p className="mt-3 text-muted">{s.uptime.body}</p>
            </div>
            <a href={site.statusUrl} className="inline-flex shrink-0 items-center gap-2 font-semibold text-accent hover:underline">
              <span aria-hidden className="size-2 rounded-full bg-success" />
              {s.uptime.link}
            </a>
          </div>
        </Section>
      ) : null}

      <CtaBand title={home.final.title} sub={home.final.sub} primary={{ kind: "demo" }} secondary={{ kind: "trial" }} section="security_final" />

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: ui.breadcrumbs.home, href: "/" },
          { name: s.hero.eyebrow, href: "/securite" },
        ])}
      />
    </>
  );
}
