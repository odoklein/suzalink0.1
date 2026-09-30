import { dict, resolveText, visibleItems } from "@/content";
import type { FeatureCard } from "@/content/types";
import { cn } from "@/lib/cn";
import { Badge } from "../ui/Badge";
import { IconTile } from "../ui/Icon";

export async function FeatureGrid({ items, columns = 3, className }: { items: FeatureCard[]; columns?: 2 | 3 | 4; className?: string }) {
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
      {cards.map((card) => (
        <li key={card.title} className="rounded-[20px] bg-white p-6 ring-1 ring-line">
          <div className="flex items-start justify-between gap-3">
            {card.icon ? <IconTile name={card.icon} /> : null}
            {card.soon ? <Badge tone="soon">{ui.badges.soon}</Badge> : null}
          </div>
          <h3 className="mt-5 font-display text-lg font-normal text-ink">{card.title}</h3>
          <p className="mt-2 text-[15px] leading-6 text-muted">{card.bodyText}</p>
        </li>
      ))}
    </ul>
  );
}
