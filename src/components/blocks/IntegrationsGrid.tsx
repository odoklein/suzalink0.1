import { ArrowRight } from "lucide-react";
import { dict, visibleItems } from "@/content";
import { Link } from "@/i18n/navigation";
import { vars } from "@/lib/style";
import { LogoMark } from "../layout/Logo";
import { Section, SectionHeader } from "../ui/Section";
import { CATEGORY_HUE, IntegrationTile } from "./IntegrationTile";
import { Stage } from "./Stage";

/** Where each tool sits on the orbit around the hub, in % of the stage (desktop). */
function orbit(i: number, n: number) {
  const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
  return { x: 50 + 40 * Math.cos(angle), y: 50 + 37 * Math.sin(angle) };
}

/**
 * Homepage integrations: one list of tiles. On desktop they orbit the Suzalink
 * hub, each wired to it by a line that carries a pulse inwards; below lg they
 * fall back to a plain grid.
 */
export async function IntegrationsGrid({ tone = "white" }: { tone?: "white" | "surface" }) {
  const { home, integrations, ui } = await dict();
  const items = visibleItems(integrations.filter((i) => i.home));
  const places = items.map((_, i) => orbit(i, items.length));

  return (
    <Section tone={tone} aria-labelledby="integrations-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader id="integrations-title" title={home.integrations.title} sub={home.integrations.sub} />
        <Link href="/integrations" className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-accent">
          {home.integrations.link}
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="mt-12 md:mt-14" data-reveal="scale" data-reveal-tall>
        <Stage hue="azure" className="lg:aspect-[2.2/1]">
          {/* Wires and pulses, desktop only. The viewBox matches the stage (2.2:1) so pulses keep their length. */}
          <svg aria-hidden viewBox="0 0 220 100" className="absolute inset-0 hidden size-full lg:block">
            {places.map((p, i) => {
              const d = `M ${(p.x * 2.2).toFixed(2)} ${p.y.toFixed(2)} L 110 50`;
              return (
                <g key={d} fill="none" strokeLinecap="round">
                  <path d={d} stroke="rgb(51 85 255 / 0.2)" strokeWidth={0.22} strokeDasharray="0.6 1" />
                  <path
                    d={d}
                    pathLength={1}
                    stroke="var(--color-accent)"
                    strokeWidth={0.5}
                    strokeDasharray="0.14 1.2"
                    className="motion-only animate-comet"
                    style={{ animationDelay: `${(i * 0.53).toFixed(2)}s`, animationDuration: "3.2s" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* The hub */}
          <div aria-hidden className="absolute left-1/2 top-1/2 hidden size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent/15 [animation-duration:3.2s]" />
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent/10 [animation-delay:1.6s] [animation-duration:3.2s]" />
            <span className="absolute inset-3 rounded-full bg-[conic-gradient(from_200deg,#3355ff,#7a5cff,#1f93ff,#3355ff)] opacity-25 blur-md" />
            <span className="relative grid size-28 place-items-center rounded-full bg-white shadow-[var(--shadow-glow)] ring-1 ring-accent/15">
              <LogoMark className="h-12" />
            </span>
          </div>

          <ul className="relative grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:p-6 lg:static lg:block lg:p-0">
            {items.map((item, i) => (
              <li
                key={item.id}
                style={vars({ "--x": `${places[i].x.toFixed(2)}%`, "--y": `${places[i].y.toFixed(2)}%` })}
                className="lg:absolute lg:left-(--x) lg:top-(--y) lg:w-[172px] lg:-translate-x-1/2 lg:-translate-y-1/2"
              >
                <IntegrationTile name={item.name} soon={item.soon} soonLabel={ui.badges.soon} hue={CATEGORY_HUE[item.category]} compact className="h-full" />
              </li>
            ))}
          </ul>
        </Stage>
      </div>
    </Section>
  );
}
