import { ArrowRight } from "lucide-react";
import { dict, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeader } from "../ui/Section";
import { IntegrationTile } from "./IntegrationTile";

/** Homepage grid of 12 integrations. */
export async function IntegrationsGrid({ tone = "white" }: { tone?: "white" | "surface" }) {
  const { home, integrations, ui } = await dict();
  const items = visibleItems(integrations.filter((i) => i.home));

  return (
    <Section tone={tone} aria-labelledby="integrations-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader id="integrations-title" title={home.integrations.title} sub={home.integrations.sub} />
        <Link href="/integrations" className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-accent hover:underline">
          {home.integrations.link}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item.id}>
            <IntegrationTile name={item.name} soon={item.soon} soonLabel={ui.badges.soon} compact className="h-full" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
