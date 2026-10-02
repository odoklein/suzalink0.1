import { Quote } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/blocks/CtaBand";
import { LogoBar } from "@/components/blocks/LogoBar";
import { PersonPhoto } from "@/components/home/HomeSections";
import { Eyebrow, H1, H2, Section } from "@/components/ui/Section";
import { PageJsonLd } from "@/components/ui/PageJsonLd";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/a-propos">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/a-propos", getContent(locale).about.meta);
}

export default async function AboutPage({ params }: PageProps<"/[locale]/a-propos">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { about: a, home, ui } = getContent(locale);

  return (
    <>
      <section data-hero className="border-b border-line bg-white">
        <div className="container-site grid gap-12 py-12 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-5">{a.hero.eyebrow}</Eyebrow>
            <H1>{a.hero.title}</H1>
          </div>
          <div className="lg:pt-16">
            <Quote aria-hidden className="size-8 text-accent" strokeWidth={1.5} />
            <div className="mt-4 space-y-4 font-display text-[22px] font-normal leading-8 tracking-[-0.01em] text-ink md:text-[24px] md:leading-9">
              {a.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-10 border-t border-line pt-6">
              <p className="num font-display text-[44px] font-normal leading-none tracking-[-0.02em] text-ink">{a.stat.value}</p>
              <p className="mt-2 text-muted">{a.stat.label}</p>
            </div>
          </div>
        </div>
      </section>

      <Section tone="surface" aria-labelledby="people-title">
        <H2 id="people-title">{a.peopleTitle}</H2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {a.people.map((p) => (
            <li key={p.name} className="rounded-[20px] bg-white p-7 ring-1 ring-line">
              <PersonPhoto name={p.name} size="lg" />
              <p className="mt-6 font-display text-xl font-normal text-ink">{p.name}</p>
              <p className="mt-1 text-muted">{p.role}</p>
              <p className="mt-4 inline-flex rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-line">{p.org}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="values-title">
        <H2 id="values-title">{a.values.title}</H2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {a.values.items.map((v, i) => (
            <li key={v.title} className="border-t-2 border-accent pt-6">
              <p className="num text-small font-semibold text-accent">0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl font-normal text-ink">{v.title}</h3>
              <p className="mt-2 text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section className="border-y border-line bg-white">
        <div className="container-site flex flex-col items-start gap-4 py-10 md:flex-row md:items-center md:justify-between">
          <p className="text-small font-medium text-muted">{a.users.title}</p>
          <LogoBar names={home.proof.logos} />
        </div>
      </section>

      <CtaBand title={home.final.title} sub={home.final.sub} primary={{ kind: "demo" }} secondary={{ kind: "trial" }} section="about_final" />
    <PageJsonLd locale={locale} pathname="/a-propos" meta={a.meta} homeLabel={ui.breadcrumbs.home} type="AboutPage" />
    </>
  );
}
