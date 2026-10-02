import { dict } from "@/content";
import { CtaLink } from "../ui/CtaLink";
import { Visual } from "../ui/Media";
import { Eyebrow, H2 } from "../ui/Section";
import { Stage } from "./Stage";

/** « Pas le temps de prospecter ? » under a night sky: the done-for-you offer stands apart from the plans. */
export async function SurMesureBand({ tone = "surface" }: { tone?: "white" | "surface" }) {
  const { home, ui } = await dict();
  return (
    <section className={tone === "surface" ? "section-y bg-surface" : "section-y bg-bg"}>
      <div className="container-site">
        <Stage tone="night" hue="violet" className="grid items-center overflow-clip lg:grid-cols-[1.05fr_1fr]">
          <div className="relative p-8 md:p-14">
            <div data-reveal="fade">
              <Eyebrow className="mb-5" hue="violet">
                {ui.header.surMesure}
              </Eyebrow>
            </div>
            <div data-reveal="blur">
              <H2 dark className="text-[30px] leading-[38px] md:text-[40px] md:leading-[48px]">
                {home.surMesure.title}
              </H2>
            </div>
            <p className="mt-5 max-w-lg text-bodym text-white/70 md:text-body">{home.surMesure.body}</p>
            <div className="mt-9">
              <CtaLink cta={{ kind: "expert" }} label={ui.cta.expert} section="home_sur_mesure" size="lg" />
            </div>
          </div>
          <div className="relative p-6 pt-0 md:p-10 lg:pl-0">
            <div aria-hidden className="absolute inset-10 rounded-full bg-[radial-gradient(closest-side,rgb(122_92_255/0.45),transparent)] blur-3xl" />
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] ring-1 ring-white/15" data-reveal="scale">
              <Visual id="V10" showTag={false} />
            </div>
          </div>
        </Stage>
      </div>
    </section>
  );
}
