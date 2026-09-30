import { Check } from "lucide-react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LogoBar } from "@/components/blocks/LogoBar";
import { flowLabels } from "@/components/forms/flowLabels";
import { LeadFlow } from "@/components/forms/LeadFlow";
import { CtaLink } from "@/components/ui/CtaLink";
import { Eyebrow, H1, Lead } from "@/components/ui/Section";
import { calLinks } from "@/config/site";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/demo">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/demo", getContent(locale).demo.meta);
}

/** Direct booking page for ads and email links: short form, then a Cal.com slot. */
export default async function DemoPage({ params }: PageProps<"/[locale]/demo">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const d = getContent(locale);
  const { demo, home, ui } = d;

  return (
    <section data-hero className="bg-surface">
      <div className="container-site grid gap-12 py-12 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:pt-6">
          <Eyebrow className="mb-5">{demo.hero.eyebrow}</Eyebrow>
          <H1 className="text-[40px] leading-[48px] md:text-[52px] md:leading-[60px]">{demo.hero.title}</H1>
          <Lead className="mt-6">{demo.hero.sub}</Lead>
          <div className="mt-10">
            <p className="font-semibold text-ink">{demo.agenda.title}</p>
            <ul className="mt-4 space-y-3">
              {demo.agenda.items.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-12 border-t border-line pt-8">
            <p className="text-small text-muted">{home.proof.title}</p>
            <LogoBar names={home.proof.logos} className="mt-3" />
          </div>
          <p className="mt-10 text-sm text-muted">
            {demo.form.already}{" "}
            <CtaLink cta={{ kind: "trial" }} label={demo.form.trial} section="demo_page" variant="ghost" size="sm" className="-ml-2 text-accent" />
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line md:p-10">
          <h2 className="font-display text-2xl font-normal text-ink">{demo.form.title}</h2>
          <p className="mt-1 text-sm text-muted">{ui.cal.timezone}</p>
          <div className="mt-8">
            <LeadFlow kind="demo" labels={flowLabels(d, "demo")} calLink={calLinks.demo} />
          </div>
        </div>
      </div>
    </section>
  );
}
