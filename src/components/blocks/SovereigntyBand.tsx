import { ArrowRight } from "lucide-react";
import { isLive, isShown } from "@/config/claims";
import type { Hue } from "@/config/hues";
import { dict, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { vars } from "@/lib/style";
import { IconTile } from "../ui/Icon";
import { Section, SectionHeader } from "../ui/Section";
import { EuropeMap } from "../visuals/EuropeMap";
import { Stage } from "./Stage";

const FACT_HUE: Record<"sparkles" | "server" | "shield", Hue> = { sparkles: "violet", server: "mint", shield: "azure" };

/** « Une IA française. Vos données hébergées en France. » Hidden until the hosting claim is verified. */
export async function SovereigntyBand({ tone = "surface" }: { tone?: "white" | "surface" }) {
  if (!isShown("hosting-fr")) return null;
  const { home } = await dict();
  const s = home.sovereignty;
  const facts = visibleItems(s.facts);
  const title = isLive("ai-mistral") ? s.title : s.title.split(". ").slice(1).join(". ");

  return (
    <Section tone={tone} aria-labelledby="sovereignty-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader id="sovereignty-title" title={title} />
          <ul className="mt-10 space-y-3">
            {facts.map((fact, i) => (
              <li
                key={fact.title}
                data-reveal
                style={vars({ "--i": i })}
                className="flex gap-4 rounded-[20px] p-3 transition-colors duration-300 hover:bg-white hover:shadow-[var(--shadow-card)]"
              >
                <IconTile name={fact.icon} hue={FACT_HUE[fact.icon]} />
                <div>
                  <p className="font-display text-lg font-normal text-ink">{fact.title}</p>
                  <p className="mt-1 text-muted">{fact.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/securite" className="group mt-8 inline-flex items-center gap-1.5 font-semibold text-accent">
            {s.link}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
          </Link>
        </div>
        <div data-reveal="scale">
          <Stage hue="azure" className="thread-draw p-4 md:p-8">
            <EuropeMap labels={s.map} className="w-full" />
          </Stage>
        </div>
      </div>
    </Section>
  );
}
