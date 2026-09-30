import { dict } from "@/content";
import { CtaLink } from "../ui/CtaLink";
import { Visual } from "../ui/Media";
import { Eyebrow, H2, Lead } from "../ui/Section";

export async function SurMesureBand({ tone = "surface" }: { tone?: "white" | "surface" }) {
  const { home, ui } = await dict();
  return (
    <section className={tone === "surface" ? "section-y bg-surface" : "section-y bg-bg"}>
      <div className="container-site">
        <div className="grid items-center overflow-hidden rounded-[28px] bg-white ring-1 ring-line lg:grid-cols-2">
          <div className="p-8 md:p-14">
            <Eyebrow className="mb-4">{ui.header.surMesure}</Eyebrow>
            <H2 className="text-[28px] leading-9 md:text-[36px] md:leading-[44px]">{home.surMesure.title}</H2>
            <Lead className="mt-5">{home.surMesure.body}</Lead>
            <div className="mt-8">
              <CtaLink cta={{ kind: "expert" }} label={ui.cta.expert} section="home_sur_mesure" size="lg" />
            </div>
          </div>
          <Visual id="V10" className="h-full min-h-64" />
        </div>
      </div>
    </section>
  );
}
