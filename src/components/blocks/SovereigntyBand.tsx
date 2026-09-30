import { ArrowRight } from "lucide-react";
import { isLive, isShown } from "@/config/claims";
import { dict, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { IconTile } from "../ui/Icon";
import { Section, SectionHeader } from "../ui/Section";
import { EuropeMap } from "../visuals/EuropeMap";

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
          <ul className="mt-10 space-y-6">
            {facts.map((fact) => (
              <li key={fact.title} className="flex gap-4">
                <IconTile name={fact.icon} />
                <div>
                  <p className="font-display text-lg font-normal text-ink">{fact.title}</p>
                  <p className="mt-1 text-muted">{fact.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/securite" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-accent hover:underline">
            {s.link}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <div className="thread-draw rounded-[28px] bg-white p-4 ring-1 ring-line md:p-8">
          <EuropeMap labels={s.map} className="w-full" />
        </div>
      </div>
    </Section>
  );
}
