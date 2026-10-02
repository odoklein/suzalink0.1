import { hueVar, type Hue } from "@/config/hues";
import { dict, resolveText, visibleItems } from "@/content";
import type { FeatureCard } from "@/content/types";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { Badge } from "../ui/Badge";
import { IconTile } from "../ui/Icon";

export async function FeatureGrid({
  items,
  columns = 3,
  className,
  hue = "accent",
}: {
  items: FeatureCard[];
  columns?: 2 | 3 | 4;
  className?: string;
  hue?: Hue;
}) {
  const { ui } = await dict();
  const cards = visibleItems(items).flatMap((card) => {
    const body = resolveText(card.body);
    return body ? [{ ...card, bodyText: body.text, soon: card.soon || body.soon }] : [];
  });

  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        className,
      )}
    >
      {cards.map((card, i) => (
        <li key={card.title} data-reveal style={vars({ "--i": i % columns })}>
          <div
            data-spotlight
            style={hueVar(hue)}
            className="group h-full rounded-[22px] bg-white p-6 shadow-[0_1px_2px_rgb(11_18_32/0.04)] ring-1 ring-line transition-[translate,box-shadow] duration-500 ease-out-quint hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-start justify-between gap-3">
              {card.icon ? <IconTile name={card.icon} hue={hue} className="transition-transform duration-500 ease-spring group-hover:-rotate-6 group-hover:scale-110" /> : null}
              {card.soon ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
            </div>
            <h3 className="mt-5 font-display text-[19px] font-normal leading-6 text-ink">{card.title}</h3>
            <p className="mt-2 text-[15px] leading-6 text-muted">{card.bodyText}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
