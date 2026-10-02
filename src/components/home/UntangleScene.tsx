import { CalendarDays, Check, ContactRound, FileSpreadsheet, Mail, Phone, type LucideIcon } from "lucide-react";
import { HUE, type Hue } from "@/config/hues";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { Logo } from "../layout/Logo";

/*
 * The « éparpillée » scene: the five tools of a scattered stack untangle into
 * one Suzalink console as the stage scrolls through the viewport (CSS scroll
 * timeline, see `.untangle-*` in globals.css). Positions are in cqw.
 */

const LOOK: { icon: LucideIcon; hue: Hue; sub: string }[] = [
  { icon: ContactRound, hue: "sun", sub: "Contacts" },
  { icon: Phone, hue: "coral", sub: "Numéroteur" },
  { icon: Mail, hue: "azure", sub: "Campagnes" },
  { icon: CalendarDays, hue: "mint", sub: "Semaine 41" },
  { icon: FileSpreadsheet, hue: "violet", sub: "Reporting.xlsx" },
];

/** Scattered start (x0, y0, r0) and tidy end (y1; x1 is shared). */
const PLACES = [
  { x0: 3, y0: 4, r0: -8 },
  { x0: 38, y0: 15, r0: 6 },
  { x0: 6, y0: 40, r0: 4 },
  { x0: 40, y0: 55, r0: -7 },
  { x0: 9, y0: 77, r0: 9 },
];

const TANGLE = [
  "M32 10 C 92 30, 8 52, 69 61",
  "M67 21 C 0 26, 62 72, 35 46",
  "M35 46 C 82 50, 0 92, 39 83",
  "M32 10 C 52 -6, 84 40, 67 21",
  "M69 61 C 40 102, 96 76, 39 83",
  "M67 21 C 100 60, 18 62, 39 83",
];

export function UntangleScene({ tools, label }: { tools: string[]; label: string }) {
  return (
    <div role="img" aria-label={label} className="untangle relative aspect-[1/0.94] w-full overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-card)] ring-1 ring-line">
      <div aria-hidden className="bg-grid absolute inset-0 [--grid-color:rgb(11_18_32/0.045)] [--grid-size:5cqw]" />

      {/* The tangle and the « five tabs » pill fade out first */}
      <svg aria-hidden viewBox="0 0 100 94" preserveAspectRatio="none" className="untangle-mess absolute inset-0 size-full">
        {TANGLE.map((d, i) => (
          <path key={d} d={d} fill="none" stroke="#b6bfcc" strokeWidth={0.45} strokeDasharray={i % 2 ? "1.4 1.2" : undefined} strokeLinecap="round" />
        ))}
      </svg>
      <span aria-hidden className="untangle-mess absolute right-[4cqw] top-[4cqw] rounded-full bg-coral-soft px-[2.2cqw] py-[0.8cqw] text-[2.6cqw] font-semibold text-coral-ink ring-1 ring-coral/20">
        5 onglets · 5 abonnements
      </span>

      {/* The console they end up in */}
      <div aria-hidden className="untangle-frame absolute left-[15cqw] top-[4.5cqw] h-[86cqw] w-[70cqw] rounded-[4cqw] bg-[linear-gradient(180deg,#f7f9ff,#eef3ff)] shadow-[0_30px_60px_-30px_rgb(51_85_255/0.45)] ring-1 ring-accent/15">
        <div className="flex h-[10cqw] items-center gap-[1.6cqw] border-b border-accent/10 px-[4cqw]">
          <Logo className="h-[4.4cqw]" />
          <span className="ml-auto rounded-full bg-mint-soft px-[1.8cqw] py-[0.5cqw] text-[2.3cqw] font-semibold text-mint-ink">1 console</span>
        </div>
      </div>

      <svg aria-hidden viewBox="0 0 100 94" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <path
          className="untangle-thread"
          pathLength={1}
          d="M27 21 C 31 28, 23 33, 27 39 S 31 49, 27 54 S 23 64, 27 69 S 31 78, 27 84"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={0.7}
          strokeLinecap="round"
        />
      </svg>

      {tools.map((tool, i) => {
        const look = LOOK[i % LOOK.length];
        const place = PLACES[i % PLACES.length];
        const h = HUE[look.hue];
        const Icon = look.icon;
        return (
          <div
            key={tool}
            aria-hidden
            className="untangle-card absolute left-0 top-0 flex h-[12cqw] w-[58cqw] items-center gap-[2.4cqw] rounded-[3cqw] bg-white px-[2.2cqw] shadow-[0_2px_4px_rgb(11_18_32/0.05),0_14px_28px_-14px_rgb(11_18_32/0.28)] ring-1 ring-ink/[0.07]"
            style={vars({ "--x0": `${place.x0}cqw`, "--y0": `${place.y0}cqw`, "--r0": `${place.r0}deg`, "--x1": "21cqw", "--y1": `${17 + i * 14.6}cqw` })}
          >
            <span className={cn("grid size-[7.5cqw] shrink-0 place-items-center rounded-[2cqw]", h.soft, h.text)}>
              <Icon className="size-[3.8cqw]" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[3.3cqw] font-semibold text-ink">{tool}</span>
              <span className="block truncate text-[2.5cqw] text-muted">{look.sub}</span>
            </span>
            <span className="untangle-check grid size-[4.6cqw] shrink-0 place-items-center rounded-full bg-mint text-white">
              <Check className="size-[2.8cqw]" strokeWidth={3.5} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
