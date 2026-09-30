import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/blocks/PageHero";
import { flowLabels } from "@/components/forms/flowLabels";
import { LeadFlow } from "@/components/forms/LeadFlow";
import { Faq } from "@/components/ui/Faq";
import { IconTile } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { Visual } from "@/components/ui/Media";
import { H2, Lead, Section, SectionHeader } from "@/components/ui/Section";
import { calLinks } from "@/config/site";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/sur-mesure">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/sur-mesure", getContent(locale).surMesure.meta);
}

export default async function SurMesurePage({ params }: PageProps<"/[locale]/sur-mesure">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const d = getContent(locale);
  const { surMesure: s, ui } = d;

  return (
    <>
      <PageHero
        eyebrow={s.hero.eyebrow}
        title={s.hero.title}
        sub={s.hero.sub}
        primary={{ kind: "expert" }}
        section="sur_mesure"
        aside={<Visual id="V10" priority className="rounded-[28px] ring-1 ring-line" />}
      />

      <Section tone="surface" aria-labelledby="steps-title">
        <SectionHeader id="steps-title" title={s.steps.title} />
        <ol className="thread-draw relative mt-12 grid gap-4 md:grid-cols-4">
          <svg aria-hidden className="absolute left-[12.5%] top-[46px] hidden h-1 w-3/4 md:block" viewBox="0 0 100 2" preserveAspectRatio="none">
            <path data-draw pathLength={1} d="M0 1 H100" stroke="var(--color-accent)" strokeWidth={2} vectorEffect="non-scaling-stroke" fill="none" />
          </svg>
          {s.steps.items.map((step, i) => (
            <li key={step.title} className="relative rounded-[20px] bg-white p-6 ring-1 ring-line">
              <span className="num relative inline-flex size-10 items-center justify-center rounded-full bg-accent font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-normal text-ink">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="included-title">
        <SectionHeader id="included-title" title={s.included.title} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.included.items.map((item) => (
            <li key={item.title} className="rounded-[20px] bg-white p-6 ring-1 ring-line">
              <IconTile name={item.icon} />
              <h3 className="mt-5 font-display text-lg font-normal text-ink">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <section id="contact" className="section-y scroll-mt-20 bg-surface" aria-labelledby="contact-title">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <H2 id="contact-title">{s.form.title}</H2>
            <Lead className="mt-5">{s.form.sub}</Lead>
            <p className="mt-6 text-sm text-muted">{ui.cal.timezone}</p>
          </div>
          <div className="rounded-[24px] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line md:p-10">
            <LeadFlow kind="expert" labels={flowLabels(d, "expert")} calLink={calLinks.expert} />
          </div>
        </div>
      </section>

      <Section aria-labelledby="sm-faq-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <H2 id="sm-faq-title">{ui.module.faq}</H2>
          <Faq items={s.faq} />
        </div>
      </Section>

      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: ui.breadcrumbs.home, href: "/" },
          { name: ui.header.surMesure, href: "/sur-mesure" },
        ])}
      />
    </>
  );
}
