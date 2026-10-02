"use client";

import {
  Activity,
  ArrowRight,
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarSync,
  ChartColumn,
  Check,
  ChevronDown,
  Clock,
  Download,
  Link2,
  MapPin,
  MousePointer2,
  Percent,
  Phone,
  PhoneCall,
  Star,
  TrendingUp,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";
import { Avatar, MOCK_H, MOCK_W, TONE, type Tone } from "./kit";

/*
 * S6, the client portal: the campaign report Transports Lemaire follows in its
 * own space, for the campaign Suzali Conseil runs for it. Every ~10 s a new
 * rendez-vous lands at the top of the list and the counters move, the client
 * rates a past rendez-vous, then copies the report's share link.
 */

const t = typo;
const NBSP = String.fromCharCode(0xa0); // espace insécable

type Kind = "visio" | "site" | "phone";

const KINDS: Record<Kind, { label: string; Icon: LucideIcon }> = {
  visio: { label: "Visio", Icon: Video },
  site: { label: "Présentiel", Icon: MapPin },
  phone: { label: "Téléphone", Icon: Phone },
};

type Status = "upcoming" | "confirmed" | "moved";

const STATUSES: Record<Status, { label: string; Icon: LucideIcon; tone: Tone }> = {
  upcoming: { label: "À venir", Icon: Clock, tone: "azure" },
  confirmed: { label: "Confirmé", Icon: Check, tone: "mint" },
  moved: { label: "Déplacé", Icon: CalendarSync, tone: "sun" },
};

type Meeting = { company: string; person: string; role: string; day: number; month: string };
type Rdv = Meeting & { kind: Kind; status: Status };

/** Rendez-vous in order of arrival. Each lands « À venir », then takes its own status. */
const FEED: Rdv[] = [
  { company: "Cartonnages Duval", person: "Hugo Ferrand", role: "Dir. supply chain", day: 8, month: "oct.", kind: "visio", status: "confirmed" },
  { company: "Métallerie Roux", person: "Karim Haddad", role: "Resp. expéditions", day: 12, month: "oct.", kind: "visio", status: "upcoming" },
  { company: "Fromagerie Vallet", person: "Inès Morel", role: "Resp. logistique", day: 2, month: "oct.", kind: "site", status: "confirmed" },
  { company: "Plastiques Verdier", person: "Antoine Garnier", role: "Resp. transport", day: 6, month: "oct.", kind: "phone", status: "moved" },
  { company: "Menuiseries Allard", person: "Thomas Allard", role: "Gérant", day: 1, month: "oct.", kind: "site", status: "confirmed" },
];

/** Past rendez-vous the client rates, one per loop. */
const PAST: (Meeting & { stars: number })[] = [
  { company: "Savonnerie Clément", person: "Lucie Clément", role: "Dir. des opérations", day: 24, month: "sept.", stars: 5 },
  { company: "Ozon Matériaux", person: "Romain Bertin", role: "Resp. logistique", day: 23, month: "sept.", stars: 4 },
  { company: "Imprimerie Morand", person: "Céline Morand", role: "Gérante", day: 25, month: "sept.", stars: 5 },
];

/** RDV per week of September; the current week (S40) grows with each arrival. */
const WEEKS = [
  { label: "S36", dates: "1–6 sept.", value: 3 },
  { label: "S37", dates: "7–13 sept.", value: 5 },
  { label: "S38", dates: "14–20 sept.", value: 4 },
  { label: "S39", dates: "21–27 sept.", value: 4 },
];

const STEPS = 8;
const LOOP = FEED.length; // five arrivals, then the counters start over
const ROW_H = 52;
const ROW_STEP = ROW_H + 6;
const ROWS = 4;
const UNIT = 42; // px per RDV in the chart
const Y_MAX = 6;
const GOAL = 4;
const PLOT_TOP = 34;
const PLOT_H = UNIT * Y_MAX;
const AXIS_H = 46;

/** Where the pointer tip sits in each phase (mock pixels). The stars spot moves to the star clicked. */
const SPOTS = {
  rest: [548, 622],
  stars: [960, 678],
  share: [916, 33],
  away: [846, 58],
} as const;
const STAR_GAP = 22;
const CURSOR: (keyof typeof SPOTS)[] = ["rest", "rest", "stars", "stars", "share", "share", "away", "away"];

const mod = (a: number, n: number) => ((a % n) + n) % n;
const groups = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ").split(" ");
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")}${NBSP}%`;
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Thousands set apart by a fine gap: the display font has no narrow no-break space. */
function Grouped({ n }: { n: number }) {
  return (
    <>
      {groups(n).map((g, i) => (
        <span key={i} className={i ? "ml-[0.16em]" : undefined}>
          {g}
        </span>
      ))}
    </>
  );
}

function Title({ icon, tone, title, sub, right }: { icon: ReactNode; tone: Tone; title: string; sub: string; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-3">
        <span className={cn("grid size-9 place-items-center rounded-xl", TONE[tone].soft, TONE[tone].text)}>{icon}</span>
        <span className="leading-tight">
          <span className="block text-[15px] font-semibold">{title}</span>
          <span className="mt-0.5 block text-[11.5px] text-[#6b7280]">{sub}</span>
        </span>
      </p>
      {right}
    </div>
  );
}

function Tag({ tone, className, children }: { tone: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none", TONE[tone].soft, TONE[tone].text, className)}>
      {children}
    </span>
  );
}

function Kpi({
  icon,
  tone,
  label,
  value,
  unit,
  chip,
  foot,
  hero,
  index,
}: {
  icon: ReactNode;
  tone: Tone;
  label: string;
  value: ReactNode;
  unit?: string;
  chip?: ReactNode;
  foot: ReactNode;
  hero?: boolean;
  index: number;
}) {
  return (
    <div
      data-appear-on-view
      style={delay(index * 90)}
      className={cn(
        "flex h-[140px] flex-col rounded-[18px] p-4 ring-1",
        hero ? "bg-gradient-to-br from-rose-soft via-white to-white ring-rose/25" : "bg-white ring-black/[0.06]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2.5">
          <span className={cn("grid size-8 place-items-center rounded-xl", hero ? "bg-white text-rose-ink ring-1 ring-rose/20" : cn(TONE[tone].soft, TONE[tone].text))}>
            {icon}
          </span>
          <span className="text-[12.5px] font-semibold text-[#5b6475]">{label}</span>
        </span>
        {chip}
      </div>
      <p className="mt-auto flex items-baseline gap-2">
        <span className="num font-display text-[50px] leading-none tracking-[-0.01em]">{value}</span>
        {unit ? <span className="text-[13px] font-medium text-[#6b7280]">{unit}</span> : null}
      </p>
      <p className="mt-2 truncate text-[12px] text-[#6b7280]">{foot}</p>
    </div>
  );
}

function DateTile({ day, month, hot, muted }: { day: number; month: string; hot?: boolean; muted?: boolean }) {
  return (
    <span className={cn("flex size-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white ring-1", hot ? "ring-rose/30" : "ring-black/[0.07]")}>
      <span className={cn("num font-display text-[19px] leading-none", muted && "text-[#5b6475]")}>{day}</span>
      <span className={cn("mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.08em]", hot ? "text-rose-ink" : "text-[#9aa3b2]")}>{month}</span>
    </span>
  );
}

function KindChip({ kind }: { kind: Kind }) {
  const { label, Icon } = KINDS[kind];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#f1f3f6] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#5b6475]">
      <Icon size={12} strokeWidth={2.25} />
      {label}
    </span>
  );
}

export function PortalMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  // Start on the most telling frame (new RDV in, a past one rated, link just copied), then play.
  const tick = useTicker(1300, inView) + 6;
  const phase = tick % STEPS;
  const cycle = Math.floor(tick / STEPS);
  const arrived = phase >= 1;
  const k = mod(cycle, LOOP);
  // Arrivals so far in this loop (1–5). A new loop starts with an arrival, so the counters only move when an RDV lands.
  const got = arrived ? k + 1 : k === 0 ? LOOP : k;
  const newest = arrived ? cycle : cycle - 1; // arrival index of the top row
  const week = 1 + got;
  const rdv = 16 + week;
  const calls = 1277 + 7 * got;
  const answered = 234 + 2 * got;
  const past = PAST[mod(cycle, PAST.length)];
  const rated = phase >= 3;
  const pressed = phase === 5;
  const copied = phase >= 6;
  const spot = CURSOR[phase];
  const cx = SPOTS[spot][0] + (spot === "stars" ? (past.stars - 1) * STAR_GAP : 0);
  const cy = SPOTS[spot][1];
  const clicking = phase === 3 || phase === 5;
  // Slot of each feed row: -1 waits above the list, 0 is the newest, 4 has slid out below.
  const slot = (i: number) => (!arrived && k === i ? -1 : mod(newest - i, LOOP));
  const weeks = [...WEEKS, { label: "S40", dates: "En cours", value: week, current: true }];

  return (
    <div ref={ref} aria-hidden className="relative flex flex-col overflow-hidden bg-[#f7f8fb] font-sans leading-snug text-[#0b1220]" style={{ width: MOCK_W, height: MOCK_H }}>
      {/* Top bar: the agency and its client, the portal tabs, sharing */}
      <header className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/5 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-[10px] bg-[#0b0f1a] font-display text-[18px] leading-none text-white">S</span>
          <span className="text-[14px] font-semibold">Suzali Conseil</span>
          <span className="px-1 text-[15px] text-[#c2c8d2]">×</span>
          <span className="grid size-8 place-items-center rounded-[10px] bg-rose-soft text-[11.5px] font-bold tracking-wide text-rose-ink ring-1 ring-rose/20">TL</span>
          <span className="leading-tight">
            <span className="block text-[14px] font-semibold">Transports Lemaire</span>
            <span className="block text-[10.5px] text-[#6b7280]">Espace client</span>
          </span>
        </div>

        <nav className="flex items-center gap-1 text-[13px] font-semibold">
          {[
            { label: "Rendez-vous", Icon: CalendarDays },
            { label: "Rapports", Icon: ChartColumn, on: true },
            { label: "Activité", Icon: Activity },
          ].map(({ label, Icon, on }) => (
            <span key={label} className={cn("flex items-center gap-2 rounded-full px-4 py-2", on ? "bg-[#0b0f1a] text-white" : "text-[#5b6475]")}>
              <Icon size={14} />
              {t(label)}
            </span>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl text-[#5b6475] ring-1 ring-black/10">
            <Bell size={15} />
            {phase === 1 || phase === 2 ? <span key={`ping-${cycle}`} className="absolute right-[8px] top-[8px] size-2 animate-ping-soft rounded-full bg-rose" /> : null}
            <span className="absolute right-[8px] top-[8px] size-2 rounded-full bg-rose ring-2 ring-white" />
          </span>
          <span
            className={cn(
              "flex h-9 w-[160px] items-center justify-center gap-2 rounded-xl text-[13px] font-semibold text-white transition-[scale,background-color,box-shadow] duration-150",
              pressed ? "scale-95 bg-accent-hover shadow-none" : "bg-accent shadow-[0_8px_20px_-8px_rgb(51_85_255/0.8)]",
            )}
          >
            {copied ? <Check size={14} strokeWidth={3} /> : <Link2 size={14} strokeWidth={2.5} />}
            {copied ? "Lien copié" : "Partager le lien"}
          </span>
          <span className="flex items-center gap-2 pl-1">
            <Avatar initials="ÉL" seed={2} size={34} />
            <span className="leading-tight">
              <span className="block text-[12.5px] font-semibold">Élodie Lemaire</span>
              <span className="block text-[10.5px] text-[#6b7280]">Directrice commerciale</span>
            </span>
            <ChevronDown size={14} className="text-[#9aa3b2]" />
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6 pt-5">
        {/* Report header */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-3">
              <span className="font-display text-[32px] leading-none tracking-[-0.01em]">{t("Rapport de campagne · Septembre 2026")}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-semibold text-mint-ink">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-mint" /> En direct
              </span>
            </p>
            <p className="mt-2.5 text-[12.5px] text-[#6b7280]">
              Mission <b className="font-semibold text-[#0b1220]">Industriels Rhône-Alpes</b> · {t("du 1er au 30 septembre 2026 · menée par l'équipe Suzali Conseil")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] font-semibold">
            <span className="flex h-9 items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-black/10">
              <CalendarDays size={14} className="text-[#6b7280]" /> Septembre 2026 <ChevronDown size={14} className="text-[#9aa3b2]" />
            </span>
            <span className="flex h-9 items-center gap-2 rounded-xl bg-white px-3 ring-1 ring-black/10">
              <Download size={14} className="text-[#6b7280]" /> Rapport PDF
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <Kpi
            hero
            index={0}
            tone="rose"
            icon={<CalendarCheck size={16} />}
            label="RDV obtenus"
            value={
              <span key={rdv} className="inline-block animate-pop">
                {rdv}
              </span>
            }
            unit="ce mois-ci"
            chip={
              <Tag tone="mint">
                <TrendingUp size={12} strokeWidth={2.5} /> {t(`+${rdv - 14} vs août`)}
              </Tag>
            }
            foot={
              <>
                dont <b className="font-semibold text-rose-ink">{week}</b> cette semaine
              </>
            }
          />
          <Kpi index={1} tone="azure" icon={<PhoneCall size={16} />} label="Appels passés" value={<Grouped n={calls} />} foot={`${answered} appels décrochés`} />
          <Kpi index={2} tone="mint" icon={<Percent size={16} />} label="Taux de RDV" value={pct((rdv / answered) * 100)} foot="des appels décrochés" />
          <Kpi index={3} tone="sun" icon={<CalendarClock size={16} />} label="Prochain RDV" value="29 sept." foot={t("Demain 14:30 · Laboratoires Sennac")} />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.08fr_1fr] gap-4">
          {/* RDV per week */}
          <div className="flex flex-col rounded-[18px] bg-white p-5 ring-1 ring-black/[0.06]">
            <Title
              icon={<ChartColumn size={16} />}
              tone="rose"
              title="RDV obtenus par semaine"
              sub={t("Septembre 2026 · objectif : 4 par semaine")}
              right={
                <span className="flex items-center gap-3 text-[11px] font-semibold text-[#5b6475]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-[3px] bg-rose" /> RDV
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 border-t-2 border-dashed border-[#0b1220]/40" /> Objectif
                  </span>
                </span>
              }
            />
            <div className="relative mt-auto" style={{ height: PLOT_TOP + PLOT_H + AXIS_H }}>
              {[0, 2, 4, 6].map((v) => (
                <div key={v} className="absolute inset-x-0 flex -translate-y-1/2 items-center gap-2.5" style={{ top: PLOT_TOP + PLOT_H - v * UNIT }}>
                  <span className="num w-4 text-right text-[11.5px] font-medium text-[#9aa3b2]">{v}</span>
                  <span className={cn("h-px flex-1", v === 0 ? "bg-[#dfe3ea]" : "bg-[#eef0f4]")} />
                </div>
              ))}
              <div className="absolute inset-y-0 left-7 right-0 grid grid-cols-5">
                {weeks.map((w, i) => {
                  const current = "current" in w;
                  return (
                    <div key={w.label} className="relative flex flex-col items-center">
                      {current ? <span className="absolute inset-x-1.5 -top-1 bottom-0 rounded-2xl bg-rose-soft/70" /> : null}
                      <div className="relative flex w-full flex-col items-center justify-end" style={{ height: PLOT_TOP + PLOT_H }}>
                        <span
                          key={current ? `v-${w.value}` : "v"}
                          className={cn("mb-2 font-display text-[22px] leading-none", current ? "animate-pop text-rose-ink" : "text-[#374151]")}
                        >
                          {w.value}
                        </span>
                        <div className="w-[58px] transition-[height] duration-700 ease-out-expo" style={{ height: w.value * UNIT }}>
                          <div
                            data-rise-on-view
                            style={delay(120 + i * 90)}
                            className={cn(
                              "size-full rounded-b-[5px] rounded-t-[12px]",
                              current ? "bg-gradient-to-t from-rose to-[#ff86b5] shadow-[0_14px_26px_-12px_rgb(247_70_138/0.75)]" : "bg-[#fbc6da]",
                            )}
                          />
                        </div>
                      </div>
                      <div className="relative mt-3 text-center leading-tight">
                        <p className={cn("text-[13px] font-semibold", current && "text-rose-ink")}>{w.label}</p>
                        <p className={cn("mt-0.5 text-[11px]", current ? "font-semibold text-rose-ink" : "text-[#9aa3b2]")}>{w.dates}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Objective, drawn over the bars */}
              <div className="absolute left-7 right-0" style={{ top: PLOT_TOP + PLOT_H - GOAL * UNIT - 1 }}>
                <div data-grow-on-view style={delay(600)} className="border-t-2 border-dashed border-[#0b1220]/35" />
              </div>
            </div>
          </div>

          {/* Latest rendez-vous */}
          <div className="flex flex-col rounded-[18px] bg-white p-5 ring-1 ring-black/[0.06]">
            <Title
              icon={<CalendarDays size={16} />}
              tone="rose"
              title="Derniers rendez-vous"
              sub="Obtenus par Suzali Conseil pour vous"
              right={
                <span className="flex items-center gap-1 text-[12px] font-semibold text-accent">
                  Tout voir <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              }
            />
            <div className="relative mt-3.5 overflow-hidden" style={{ height: ROWS * ROW_STEP - 6 }}>
              {FEED.map((r, i) => {
                const s = slot(i);
                const fresh = s <= 0;
                const status = STATUSES[fresh ? "upcoming" : r.status];
                return (
                  <div
                    key={r.company}
                    className={cn(
                      "absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl px-3",
                      s < 0 ? "transition-none" : "transition-[transform,background-color,box-shadow] duration-700 ease-out-expo",
                      fresh ? "bg-rose-soft/70 shadow-[inset_0_0_0_1px_rgb(247_70_138/0.22)]" : "bg-[#f7f8fb] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.03)]",
                    )}
                    style={{ height: ROW_H, transform: `translateY(${s * ROW_STEP}px)` }}
                  >
                    <DateTile day={r.day} month={r.month} hot={fresh} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-semibold">{r.company}</span>
                        {s === 0 ? (
                          <span className="animate-pop rounded-full bg-rose px-2 py-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[0.06em] text-white">Nouveau</span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-[#6b7280]">
                        {r.person} · {r.role}
                      </span>
                    </span>
                    <span className="w-[100px]">
                      <KindChip kind={r.kind} />
                    </span>
                    <Tag tone={status.tone} className="w-[92px] justify-center">
                      <status.Icon size={12} strokeWidth={2.75} /> {status.label}
                    </Tag>
                  </div>
                );
              })}
            </div>

            <p className="mt-3.5 flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#9aa3b2]">
              {t("Rendez-vous passé · à noter")}
              <span className="h-px flex-1 bg-black/[0.06]" />
            </p>
            <div key={`past-${cycle}`} className="mt-2.5 flex h-[56px] animate-slide-in items-center gap-3 rounded-2xl px-3 ring-1 ring-black/[0.07]">
              <DateTile day={past.day} month={past.month} muted />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{past.company}</span>
                <span className="mt-0.5 block truncate text-[11.5px] text-[#6b7280]">
                  {past.person} · {past.role}
                </span>
              </span>
              <span className="flex items-center gap-[3px]">
                {[0, 1, 2, 3, 4].map((n) => {
                  const on = rated && n < past.stars;
                  return (
                    <span key={n} className="relative grid size-[19px] place-items-center">
                      <Star size={19} strokeWidth={1.75} className="text-[#d4d8df]" />
                      <Star
                        size={19}
                        strokeWidth={1.75}
                        className={cn("absolute inset-0 fill-sun text-sun transition-[opacity,scale] duration-300 ease-out", on ? "scale-100 opacity-100" : "scale-50 opacity-0")}
                        style={{ transitionDelay: on ? `${n * 110}ms` : "0ms" }}
                      />
                    </span>
                  );
                })}
              </span>
              <span className="w-[74px]">
                {rated ? (
                  <Tag key="done" tone="mint" className="animate-pop [animation-delay:600ms]">
                    <Check size={12} strokeWidth={3} /> Noté
                  </Tag>
                ) : (
                  <Tag key="todo" tone="accent">
                    <Star size={12} strokeWidth={2.5} /> Noter
                  </Tag>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast under the share button, over the report actions */}
      <div
        className={cn(
          "absolute right-6 top-[80px] z-20 flex h-[54px] w-[318px] items-center gap-3 rounded-2xl bg-[#0b0f1a] pl-3.5 pr-4 text-white shadow-[0_18px_40px_-12px_rgb(11_15_26/0.6)] [transition:opacity_180ms_ease,translate_500ms_var(--ease-out-expo)]",
          copied ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <span className="grid size-6 place-items-center rounded-full bg-mint">
          <Check size={13} strokeWidth={3} />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold">Lien de partage copié</span>
          <span className="mt-0.5 block text-[11px] text-white/55">{t("Rapport de septembre · valable 30 jours")}</span>
        </span>
      </div>

      {/* The client's pointer */}
      <span
        className="pointer-events-none absolute left-0 top-0 z-30 transition-transform duration-900 ease-out-quint"
        style={{ transform: `translate(${cx - 4}px, ${cy - 4}px)` }}
      >
        {clicking ? <span key={`click-${tick}`} className="absolute -left-2 -top-2 size-5 animate-ping-soft rounded-full bg-accent/50" /> : null}
        <MousePointer2
          size={21}
          className={cn("relative fill-[#0b0f1a] text-white drop-shadow-[0_4px_8px_rgb(11_15_26/0.35)] transition-transform duration-200", clicking && "scale-90")}
        />
      </span>
    </div>
  );
}
