"use client";

import {
  ArrowDown,
  ArrowUp,
  CalendarCheck,
  CalendarRange,
  Check,
  ChevronDown,
  Clock,
  Coffee,
  Copy,
  CornerUpRight,
  Crown,
  Headset,
  PhoneCall,
  Plane,
  Radio,
  RefreshCw,
  TriangleAlert,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";
import { Avatar, Chip, MockShell, Panel, PanelTitle, TONE, type Tone } from "./kit";

/*
 * S4, team management: the weekly leaderboard, the live activity feed and the
 * week's planning. Something happens on the floor every ~2.4 s. When an RDV
 * lands, that SDR's bar and the team counters move and the board re-sorts.
 * Mid-loop the board switches to the calls ranking and back, which lets the
 * loop start over without a visible reset.
 */

const TICK = 1200;
const STEPS = 16;
/** First frame: Lucas has just reached his weekly objective (the most telling state). */
const START = 6;
const ROW_H = 39;
const FEED_H = 42;
const FEED_SHOWN = 6;

type PersonId = "hugo" | "ines" | "lucas" | "manon" | "sarah" | "yanis";
type MissionKey = "log" | "ind" | "san" | "ret";
type Slot = MissionKey | "off" | "clash";
type Status = "call" | "online" | "off";
type Board = "rdv" | "calls";

const MISSIONS: Record<MissionKey, { name: string; tone: Tone }> = {
  log: { name: "Logistique IDF", tone: "azure" },
  ind: { name: "Industrie Grand Est", tone: "violet" },
  san: { name: "Santé Lyon", tone: "mint" },
  ret: { name: "Retail Sud-Ouest", tone: "sun" },
};

type Person = {
  id: PersonId;
  name: string;
  initials: string;
  /** Avatar gradient; `bar` repeats it for the progress bar. */
  seed: number;
  bar: string;
  mission: MissionKey;
  rdv: number;
  rdvGoal: number;
  calls: number;
  callsGoal: number;
  pickup: number;
  /** Calls added per step while the calls board plays. */
  rate: number;
  /** Rank last week, per board (1-based). */
  lastRdv: number;
  lastCalls: number;
  capacity: string;
  over?: boolean;
  /** Ten half-days, Monday morning to Friday afternoon. */
  plan: Slot[];
};

// Alphabetical, as in the planning. The leaderboard order is computed.
const PEOPLE: Person[] = [
  {
    id: "hugo",
    name: "Hugo L.",
    initials: "HL",
    seed: 2,
    bar: "from-[#2fc6a0] to-[#1f93ff]",
    mission: "log",
    rdv: 6,
    rdvGoal: 8,
    calls: 341,
    callsGoal: 400,
    pickup: 29,
    rate: 1,
    lastRdv: 1,
    lastCalls: 1,
    capacity: "5 j",
    plan: ["log", "log", "log", "log", "ind", "ind", "log", "log", "log", "log"],
  },
  {
    id: "ines",
    name: "Inès B.",
    initials: "IB",
    seed: 1,
    bar: "from-[#ff8a65] to-[#f7468a]",
    mission: "log",
    rdv: 6,
    rdvGoal: 8,
    calls: 276,
    callsGoal: 400,
    pickup: 36,
    rate: 1,
    lastRdv: 4,
    lastCalls: 4,
    capacity: "5 j",
    plan: ["log", "log", "log", "log", "log", "log", "log", "log", "san", "san"],
  },
  {
    id: "lucas",
    name: "Lucas M.",
    initials: "LM",
    seed: 0,
    bar: "from-[#5b7cff] to-[#7a5cff]",
    mission: "ind",
    rdv: 7,
    rdvGoal: 8,
    calls: 298,
    callsGoal: 400,
    pickup: 34,
    rate: 0,
    lastRdv: 2,
    lastCalls: 3,
    capacity: "5 j",
    plan: ["ind", "ind", "ind", "ind", "ind", "ind", "ind", "ind", "ret", "ret"],
  },
  {
    id: "manon",
    name: "Manon T.",
    initials: "MT",
    seed: 4,
    bar: "from-[#7a5cff] to-[#f7468a]",
    mission: "san",
    rdv: 3,
    rdvGoal: 6,
    calls: 214,
    callsGoal: 320,
    pickup: 33,
    rate: 1,
    lastRdv: 6,
    lastCalls: 5,
    capacity: "4 j",
    plan: ["san", "san", "san", "san", "san", "san", "san", "san", "off", "off"],
  },
  {
    id: "sarah",
    name: "Sarah K.",
    initials: "SK",
    seed: 3,
    bar: "from-[#ffc24b] to-[#ff6847]",
    mission: "ret",
    rdv: 5,
    rdvGoal: 8,
    calls: 295,
    callsGoal: 400,
    pickup: 31,
    rate: 2,
    lastRdv: 3,
    lastCalls: 2,
    capacity: "5,5 j",
    over: true,
    plan: ["ret", "ret", "ret", "ret", "ret", "ret", "ret", "ret", "clash", "ret"],
  },
  {
    id: "yanis",
    name: "Yanis D.",
    initials: "YD",
    seed: 5,
    bar: "from-[#1f93ff] to-[#10b981]",
    mission: "ind",
    rdv: 4,
    rdvGoal: 8,
    calls: 262,
    callsGoal: 400,
    pickup: 27,
    rate: 0,
    lastRdv: 5,
    lastCalls: 6,
    capacity: "4,5 j",
    plan: ["off", "ind", "ind", "ind", "ind", "ind", "ind", "ind", "ind", "ind"],
  },
];

const BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p])) as Record<PersonId, Person>;
const RDV_BASE = PEOPLE.reduce((s, p) => s + p.rdv, 0);
const RDV_GOAL = PEOPLE.reduce((s, p) => s + p.rdvGoal, 0);

/** RDV landed in this loop: Inès at step 0, Lucas at step 6. The calls board (8–11) hides the reset. */
function rdvBonus(id: PersonId, phase: number) {
  if (phase >= 8) return 0;
  if (id === "ines") return 1;
  return id === "lucas" && phase >= 6 ? 1 : 0;
}

function callsBonus(p: Person, phase: number) {
  return phase > 8 && phase < 12 ? p.rate * (phase - 8) : 0;
}

function statusOf(id: PersonId, phase: number): Status {
  if (id === "yanis") return phase >= 4 && phase < 10 ? "off" : "call";
  if (id === "lucas") return phase >= 6 && phase < 12 ? "online" : "call";
  if (id === "ines") return phase < 8 ? "online" : "call";
  return "call";
}

type FeedEvent = { who: PersonId; verb: string; detail: string; tone: Tone; icon: LucideIcon };

/** One event every two steps: EVENTS[i] happens at step 2i. */
const EVENTS: FeedEvent[] = [
  { who: "ines", verb: "a décroché un RDV", detail: "Transports Lemaire · Logistique IDF", tone: "mint", icon: CalendarCheck },
  { who: "hugo", verb: "a planifié un rappel", detail: "Groupe Arnaud · ven. 10:30", tone: "sun", icon: Clock },
  { who: "yanis", verb: "est en pause", detail: "Industrie Grand Est", tone: "gray", icon: Coffee },
  { who: "lucas", verb: "a décroché un RDV", detail: "Ateliers Kieffer · Industrie Grand Est", tone: "mint", icon: CalendarCheck },
  { who: "sarah", verb: "a classé « À suivre »", detail: "Cofisud · Retail Sud-Ouest", tone: "azure", icon: CornerUpRight },
  { who: "yanis", verb: "a repris sa session", detail: "Industrie Grand Est", tone: "accent", icon: Headset },
  { who: "manon", verb: "a planifié un rappel", detail: "Clinique du Parc · lun. 9:30", tone: "sun", icon: Clock },
  { who: "ines", verb: "a lancé un appel", detail: "Transports Lemaire · Logistique IDF", tone: "rose", icon: PhoneCall },
];

const AGO = ["à l'instant", "il y a 1 min", "il y a 3 min", "il y a 4 min", "il y a 6 min", "il y a 8 min", "il y a 9 min"];

const DAYS = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven."];
const TODAY = 3;
/** RDV per day, Monday to Wednesday; Thursday is live. They add up to RDV_BASE with Thursday's 7. */
const WEEK_RDV = [7, 9, 8];
const TODAY_BASE = RDV_BASE - WEEK_RDV.reduce((s, v) => s + v, 0);

// Calls per hour today (9 h → 16 h), drawn as a sparkline.
const HOURLY = [38, 61, 72, 30, 18, 64, 70, 55];
const SPARK_W = 86;
const SPARK_H = 32;
const SPARK_PTS = HOURLY.map((v, i) => [3 + (i * (SPARK_W - 6)) / (HOURLY.length - 1), SPARK_H - 4 - (v / 80) * (SPARK_H - 8)]);
const SPARK = smooth(SPARK_PTS);
const SPARK_END = SPARK_PTS[SPARK_PTS.length - 1];

const PICKUP = 31.6;
const RING = arc(18, 18, 14, PICKUP / 100);

const STATUS_DOT: Record<Status, string> = { call: "bg-rose", online: "bg-mint", off: "bg-[#c3c9d3]" };

const t = typo;
// A full no-break space: Lastik draws the narrow one almost invisibly.
const nf = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const pct = (n: number) => `${n.toFixed(1).replace(".", ",")} %`;
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/** Catmull-Rom through the points, as cubic Béziers. */
function smooth(pts: number[][]) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A clockwise arc from twelve o'clock covering `frac` of the circle. */
function arc(cx: number, cy: number, r: number, frac: number) {
  const a = frac * 2 * Math.PI;
  const x = cx + r * Math.sin(a);
  const y = cy - r * Math.cos(a);
  return `M${cx},${cy - r} A${r},${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x.toFixed(2)},${y.toFixed(2)}`;
}

/** Consecutive identical half-days merged into blocks. */
function blocks(plan: Slot[]) {
  const out: { slot: Slot; start: number; len: number }[] = [];
  plan.forEach((slot, i) => {
    const last = out[out.length - 1];
    if (last && last.slot === slot && slot !== "clash") last.len += 1;
    else out.push({ slot, start: i, len: 1 });
  });
  return out;
}

const GRID = "grid grid-cols-[24px_150px_minmax(0,1fr)_46px_52px_44px_38px] items-center gap-x-3";

export function TeamMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  const tick = useTicker(TICK, inView) + START;
  const phase = tick % STEPS;
  const board: Board = phase >= 8 && phase < 12 ? "calls" : "rdv";
  /** Whether this loop's step `p` played after the first frame: only those arrivals animate in. */
  const fresh = (p: number) => tick - ((phase - p + STEPS) % STEPS) > START;

  const rows = PEOPLE.map((p) => ({
    ...p,
    rdvNow: p.rdv + rdvBonus(p.id, phase),
    callsNow: p.calls + callsBonus(p, phase),
    status: statusOf(p.id, phase),
  }));
  const order = [...rows].sort((a, b) =>
    board === "rdv" ? b.rdvNow - a.rdvNow || b.callsNow - a.callsNow : b.callsNow - a.callsNow || b.rdvNow - a.rdvNow,
  );
  const rankOf = (id: PersonId) => order.findIndex((r) => r.id === id);

  // Who just scored (mint wash, « +1 RDV ») and who is overtaking (drawn on top while rows cross).
  const scorer: PersonId | null = phase < 2 ? "ines" : phase === 6 || phase === 7 ? "lucas" : null;
  const scoredAt = scorer === "ines" ? 0 : 6;
  const lifted: PersonId | null = phase < 2 ? "ines" : phase === 10 || phase === 11 ? "sarah" : null;

  const rdvTeam = rows.reduce((s, r) => s + r.rdvNow, 0);
  const callsTeam = rows.reduce((s, r) => s + r.callsNow, 0);
  const live = rows.filter((r) => r.status !== "off").length;
  const today = TODAY_BASE + rdvTeam - RDV_BASE;

  const latest = Math.floor(tick / 2);
  const feed = Array.from({ length: FEED_SHOWN + 1 }, (_, i) => latest - i);

  return (
    <div ref={ref}>
      <MockShell variant="manager" active="Performance" crumb="Manager" page="Équipe · Classement">
        <div className="flex h-full flex-col gap-3 bg-[#f7f8fb] p-4 leading-[1.35]">
          {/* Page header */}
          <div className="flex h-7 shrink-0 items-center justify-between">
            <p className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-[10px] bg-[#0b0f1a] text-white">
                <Users size={14} />
              </span>
              <span className="font-display text-[21px] leading-none">{t("Performance de l'équipe")}</span>
              <Chip tone="accent">6 commerciaux · 4 missions</Chip>
            </p>
            <span className="flex items-center gap-2 text-[11px]">
              <span className="flex rounded-lg bg-white p-0.5 ring-1 ring-black/10">
                <span className="px-2 py-0.5">Jour</span>
                <span className="rounded-md bg-[#0b0f1a] px-2 py-0.5 font-semibold text-white">Semaine</span>
                <span className="px-2 py-0.5">Mois</span>
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 ring-1 ring-black/10">
                Tous les clients <ChevronDown size={11} className="text-[#9aa3b2]" />
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 ring-1 ring-black/10">
                Toutes les missions <ChevronDown size={11} className="text-[#9aa3b2]" />
              </span>
            </span>
          </div>

          {/* KPI strip */}
          <div className="grid shrink-0 grid-cols-4 divide-x divide-black/[0.06] rounded-[18px] bg-white ring-1 ring-black/[0.06]">
            <Kpi label="RDV de l'équipe" value={String(rdvTeam)} unit={`/ ${RDV_GOAL} visés`} flash={scorer !== null}>
              <WeekBars today={today} rising={scorer !== null} />
            </Kpi>
            <Kpi label="Appels passés" value={nf(callsTeam)} unit="cette semaine">
              <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} width={SPARK_W} height={SPARK_H} className="overflow-visible">
                <path d={SPARK} pathLength={1} data-draw-on-view fill="none" stroke="#ff6847" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={delay(250)} />
                <circle cx={SPARK_END[0]} cy={SPARK_END[1]} r={5} className="animate-ping-soft fill-coral/40 [transform-box:fill-box] [transform-origin:center]" />
                <circle cx={SPARK_END[0]} cy={SPARK_END[1]} r={2.6} className="fill-coral" />
              </svg>
            </Kpi>
            <Kpi label="Taux de décroché" value={pct(PICKUP)} unit="en moyenne">
              <svg viewBox="0 0 36 36" width={36} height={36}>
                <circle cx={18} cy={18} r={14} fill="none" stroke="#e5f2ff" strokeWidth={4} />
                <path d={RING} pathLength={1} data-draw-on-view fill="none" stroke="#1f93ff" strokeWidth={4} strokeLinecap="round" style={delay(350)} />
              </svg>
            </Kpi>
            <Kpi label="En session" value={String(live)} unit={`/ ${PEOPLE.length}`}>
              <span className="flex -space-x-1">
                {rows.map((r) => (
                  <Avatar key={r.id} initials={r.initials} seed={r.seed} size={24} className={cn("ring-2 ring-white transition-opacity duration-500", r.status === "off" && "opacity-35")} />
                ))}
              </span>
            </Kpi>
          </div>

          {/* Leaderboard and live feed */}
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_330px] gap-3">
            <Panel className="flex min-h-0 flex-col">
              <PanelTitle
                icon={<Trophy size={14} />}
                tone="accent"
                title={t("Classement de l'équipe")}
                sub={board === "rdv" ? "Rendez-vous décrochés · semaine en cours" : "Appels passés · semaine en cours"}
                right={<BoardSwitch board={board} />}
              />
              <div className={cn(GRID, "mt-3 px-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9aa3b2]")}>
                <span className="text-center">#</span>
                <span>Commercial</span>
                <span>{board === "rdv" ? "RDV / objectif" : "Appels / objectif"}</span>
                <span className="text-right">{board === "rdv" ? "Appels" : "RDV"}</span>
                <span className="text-right">Décroché</span>
                <span className="text-right">Conv.</span>
                <span className="text-right">Évol.</span>
              </div>
              <div className="relative mt-1.5" style={{ height: ROW_H * PEOPLE.length }}>
                {rows.map((r) => {
                  const rank = rankOf(r.id);
                  const value = board === "rdv" ? r.rdvNow : r.callsNow;
                  const goal = board === "rdv" ? r.rdvGoal : r.callsGoal;
                  const reached = board === "rdv" && r.rdvNow >= r.rdvGoal;
                  const scored = scorer === r.id;
                  const delta = (board === "rdv" ? r.lastRdv : r.lastCalls) - (rank + 1);
                  return (
                    <div
                      key={r.id}
                      className={cn("absolute inset-x-0 top-0 transition-transform duration-700 ease-out-expo", lifted === r.id && "z-10")}
                      style={{ height: ROW_H - 3, transform: `translateY(${rank * ROW_H}px)` }}
                    >
                      <div data-appear-on-view className="h-full" style={delay(150 + rank * 70)}>
                        <div
                          className={cn(
                            GRID,
                            "h-full rounded-xl px-2.5 ring-1 transition-[background-color,box-shadow] duration-700",
                            lifted === r.id && "shadow-[0_10px_24px_-12px_rgb(11_18_32/0.35)]",
                            scored
                              ? "bg-mint-soft/80 ring-mint/25"
                              : rank === 0
                                ? "bg-[linear-gradient(90deg,#fff6dc,#fffdf7_45%,#fff)] ring-sun/20"
                                : "bg-white ring-transparent",
                          )}
                        >
                          <span className="flex justify-center">
                            <RankBadge rank={rank} />
                          </span>
                          <span className="flex min-w-0 items-center gap-2.5">
                            <Presence initials={r.initials} seed={r.seed} status={r.status} size={28} />
                            <span className="min-w-0 leading-tight">
                              <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                                {r.name}
                                {scored ? (
                                  <span className={cn("rounded-full bg-mint px-1.5 py-px text-[9px] font-bold text-white", fresh(scoredAt) && "animate-pop")}>
                                    +1 RDV
                                  </span>
                                ) : null}
                              </span>
                              {reached ? (
                                <span className={cn("mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-mint-ink", fresh(6) && "animate-pop")}>
                                  <Check size={10} strokeWidth={3} /> Objectif atteint
                                </span>
                              ) : (
                                <span className="mt-0.5 block truncate text-[10px] text-[#6b7280]">{MISSIONS[r.mission].name}</span>
                              )}
                            </span>
                          </span>
                          <span className="flex items-center gap-2.5">
                            <span className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#eef0f4]">
                              <span data-grow-on-view className="block h-full" style={delay(350 + rank * 70)}>
                                <span
                                  className={cn("relative block h-full overflow-hidden rounded-full bg-gradient-to-r transition-[width] duration-700 ease-out-expo", r.bar)}
                                  style={{ width: `${Math.min(100, (value / goal) * 100)}%` }}
                                >
                                  {/* The sheen rests outside the bar (75 % of a 200 % image), so a still frame shows a clean bar. */}
                                  {reached ? <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(100deg,transparent_65%,rgb(255_255_255/0.55)_75%,transparent_85%)] bg-[length:200%_100%]" /> : null}
                                </span>
                              </span>
                            </span>
                            <span className="num w-[54px] shrink-0 text-right text-[12px] font-semibold">
                              <span className={cn("transition-colors duration-500", reached && "text-mint-ink")}>{nf(value)}</span>
                              <span className="text-[10px] font-medium text-[#9aa3b2]">/{goal}</span>
                            </span>
                          </span>
                          <span className="num text-right text-[11.5px] font-medium">{board === "rdv" ? r.callsNow : r.rdvNow}</span>
                          <span className="num text-right text-[11.5px] text-[#5b6475]">{t(`${r.pickup} %`)}</span>
                          <span className="num text-right text-[11.5px] text-[#5b6475]">{pct((r.rdvNow / r.callsNow) * 100)}</span>
                          <span className="flex justify-end">
                            <Trend delta={delta} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel className="flex min-h-0 flex-col">
              <PanelTitle icon={<Radio size={14} />} tone="rose" title={t("Activité en direct")} sub={t("Toute l'équipe · toutes les missions")} right={<LiveChip />} />
              <div className="relative mt-3 min-h-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_76%,transparent)]">
                {feed.map((k, i) => {
                  const ev = EVENTS[((k % EVENTS.length) + EVENTS.length) % EVENTS.length];
                  const p = BY_ID[ev.who];
                  const Icon = ev.icon;
                  return (
                    <div key={k} className="absolute inset-x-0 top-0 transition-transform duration-700 ease-out-expo" style={{ transform: `translateY(${i * FEED_H}px)` }}>
                      <div data-appear-on-view style={delay(300 + i * 80)}>
                        <div
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-2 transition-colors duration-700",
                            i === 0 ? "bg-[#f4f6fa]" : "bg-white",
                            2 * k > START && "animate-slide-in",
                          )}
                          style={{ height: FEED_H - 4 }}
                        >
                          <span className="relative shrink-0">
                            <Avatar initials={p.initials} seed={p.seed} size={28} />
                            <span className={cn("absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full text-white ring-2 ring-white", TONE[ev.tone].solid)}>
                              <Icon size={9} strokeWidth={2.6} />
                            </span>
                          </span>
                          <span className="min-w-0 flex-1 leading-tight">
                            <span className="block truncate text-[11.5px] text-[#374151]">
                              <b className="font-semibold text-[#0b1220]">{p.name}</b> {t(ev.verb)}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-[#6b7280]">{t(ev.detail)}</span>
                          </span>
                          <span className="shrink-0 self-start pt-[7px] text-[9.5px] text-[#9aa3b2]">{t(AGO[i])}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Week planning */}
          <Panel className="shrink-0">
            <PanelTitle
              icon={<CalendarRange size={14} />}
              tone="accent"
              title="Planning de la semaine"
              sub={t("Répartition par mission · absences et capacité")}
              right={
                <span className="flex items-center gap-2 text-[10px]">
                  <span className="mr-1 flex items-center gap-2.5 font-medium text-[#6b7280]">
                    {Object.values(MISSIONS).map((m) => (
                      <span key={m.name} className="flex items-center gap-1">
                        <span className={cn("size-2 rounded-[3px]", TONE[m.tone].solid)} />
                        {m.name}
                      </span>
                    ))}
                  </span>
                  <Chip tone="rose">
                    <TriangleAlert size={10} /> 1 surcharge
                  </Chip>
                  <span className="flex items-center gap-1.5 rounded-lg bg-accent-tint px-2.5 py-1 text-[10.5px] font-semibold text-accent ring-1 ring-accent/20">
                    <RefreshCw size={11} /> {t("Rééquilibrer")}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-medium text-[#0b1220] ring-1 ring-black/10">
                    <Copy size={11} /> Copier la semaine
                  </span>
                </span>
              }
            />
            <Planning />
          </Panel>
        </div>
      </MockShell>
    </div>
  );
}

function Kpi({ label, value, unit, flash, children }: { label: string; value: string; unit: string; flash?: boolean; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5">
      <div className="min-w-0">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#9aa3b2]">{t(label)}</p>
        <p className="mt-1.5 flex items-baseline gap-1.5 whitespace-nowrap">
          <span className={cn("font-display text-[26px] leading-none transition-colors duration-500", flash && "text-mint-ink")}>{value}</span>
          <span className="text-[10.5px] text-[#6b7280]">{t(unit)}</span>
        </p>
      </div>
      {children}
    </div>
  );
}

/** RDV per day this week. Thursday grows as an RDV lands, and snaps back unseen when the loop restarts. */
function WeekBars({ today, rising }: { today: number; rising: boolean }) {
  const days = [...WEEK_RDV, today];
  return (
    <span className="flex flex-col items-center gap-1">
      <span className="flex h-[28px] items-end gap-[5px]">
        {days.map((v, i) => (
          <span key={i} data-rise-on-view className="flex h-full w-[9px] items-end" style={delay(200 + i * 90)}>
            <span
              className={cn("block w-full rounded-[3px]", rising && "transition-[height] duration-700 ease-out-expo", i === TODAY ? "bg-accent" : "bg-accent/25")}
              style={{ height: `${(v / 11) * 100}%` }}
            />
          </span>
        ))}
        <span className="h-[62%] w-[9px] rounded-[3px] border border-dashed border-accent/35" />
      </span>
      <span className="flex gap-[5px] text-[8px] font-semibold text-[#9aa3b2]">
        {["L", "M", "M", "J", "V"].map((d, i) => (
          <span key={i} className={cn("w-[9px] text-center", i === TODAY && "text-accent")}>
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function BoardSwitch({ board }: { board: Board }) {
  return (
    <span className="relative flex rounded-lg bg-[#f1f3f6] p-0.5 text-[10.5px] font-medium">
      <span
        className="absolute inset-y-0.5 left-0.5 w-[82px] rounded-md bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)] transition-transform duration-500 ease-out-expo"
        style={{ transform: `translateX(${board === "calls" ? 82 : 0}px)` }}
      />
      {(["rdv", "calls"] as const).map((b) => (
        <span key={b} className={cn("relative w-[82px] py-1 text-center transition-colors duration-300", board === b ? "text-[#0b1220]" : "text-[#6b7280]")}>
          {b === "rdv" ? "Rendez-vous" : "Appels"}
        </span>
      ))}
    </span>
  );
}

function LiveChip() {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-semibold text-mint-ink">
      <span className="relative grid size-1.5 place-items-center">
        <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
        <span className="relative size-1.5 animate-pulse-dot rounded-full bg-mint" />
      </span>
      En direct
    </span>
  );
}

function Presence({ initials, seed, status, size }: { initials: string; seed: number; status: Status; size: number }) {
  return (
    <span className="relative shrink-0">
      <Avatar initials={initials} seed={seed} size={size} className={cn("transition-opacity duration-500", status === "off" && "opacity-45")} />
      <span className={cn("absolute -bottom-px -right-px size-[9px] rounded-full ring-2 ring-white transition-colors duration-500", STATUS_DOT[status])} />
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 0) {
    return (
      <span className="grid size-[22px] place-items-center rounded-full bg-gradient-to-br from-[#ffd77a] to-[#f59f0b] text-white shadow-[0_4px_10px_-3px_rgb(245_159_11/0.8)]">
        <Crown size={12} strokeWidth={2.5} />
      </span>
    );
  }
  if (rank < 3) {
    return (
      <span
        className={cn(
          "grid size-[22px] place-items-center rounded-full text-[11px] font-bold ring-1",
          rank === 1 ? "bg-[#eef1f5] text-[#5b6475] ring-[#d9dee6]" : "bg-[#fbeee4] text-[#b0602a] ring-[#f1d5bf]",
        )}
      >
        {rank + 1}
      </span>
    );
  }
  return <span className="text-[11px] font-semibold text-[#9aa3b2]">{rank + 1}</span>;
}

function Trend({ delta }: { delta: number }) {
  if (delta === 0) return <span className="pr-1 text-[11px] font-semibold text-[#c3c9d3]">=</span>;
  const up = delta > 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold", up ? "bg-mint-soft text-mint-ink" : "bg-rose-soft text-rose-ink")}>
      {up ? <ArrowUp size={9} strokeWidth={3} /> : <ArrowDown size={9} strokeWidth={3} />}
      {Math.abs(delta)}
    </span>
  );
}

const NAME_W = 132;
const track = (frac: number) => `calc(${NAME_W}px + (100% - ${NAME_W}px) * ${frac})`;

function Planning() {
  return (
    <div className="relative mt-2.5">
      {/* Today's column and the day separators, behind the rows */}
      <span className="absolute inset-y-0 rounded-lg bg-accent/[0.05] ring-1 ring-accent/10" style={{ left: track(TODAY / 5), width: `calc((100% - ${NAME_W}px) / 5)` }} />
      {[1, 2, 3, 4].map((d) => (
        <span key={d} className="absolute bottom-0 top-[18px] w-px bg-black/[0.05]" style={{ left: track(d / 5) }} />
      ))}

      <div className="relative grid h-[18px] items-center" style={{ gridTemplateColumns: `${NAME_W}px 1fr` }}>
        <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9aa3b2]">{t("Équipe · capacité")}</span>
        <span className="grid grid-cols-5 text-[10px] font-semibold text-[#6b7280]">
          {DAYS.map((d, i) => (
            <span key={d} className={cn("flex items-center gap-1.5 px-2", i === TODAY && "text-accent")}>
              {d}
              {i === TODAY ? <span className="rounded-full bg-accent px-1.5 py-px text-[8.5px] text-white">{t("Aujourd'hui")}</span> : null}
            </span>
          ))}
        </span>
      </div>

      <div className="relative mt-1 space-y-[2px]">
        {PEOPLE.map((p, row) => (
          <div key={p.id} className="grid h-[18px] items-center" style={{ gridTemplateColumns: `${NAME_W}px 1fr` }}>
            <span className="flex items-center gap-2 pr-3">
              <Avatar initials={p.initials} seed={p.seed} size={18} />
              <span className="text-[11px] font-semibold">{p.name}</span>
              <span className={cn("ml-auto text-[10px] font-medium", p.over ? "text-rose-ink" : "text-[#9aa3b2]")}>{p.capacity}</span>
            </span>
            <span className="relative h-full">
              {blocks(p.plan).map((b) => (
                <span
                  key={b.start}
                  className="absolute inset-y-0 overflow-hidden rounded-[6px]"
                  style={{ left: `calc(${b.start * 10}% + 2px)`, width: `calc(${b.len * 10}% - 4px)` }}
                >
                  <PlanBlock slot={b.slot} len={b.len} person={p.id} wait={250 + row * 70 + b.start * 25} />
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>

      {/* Now, Thursday mid-afternoon: drawn over the blocks */}
      <span className="pointer-events-none absolute -bottom-1 top-[16px] z-10 w-[1.5px] rounded-full bg-accent" style={{ left: track(0.74) }}>
        <span className="absolute -left-[3px] -top-[3px] size-[7.5px] rounded-full bg-accent ring-2 ring-white" />
      </span>
    </div>
  );
}

/**
 * A planning block: the tint grows across its half-days on first view, then
 * the label slides up into it (scaling the label itself would squash the text).
 */
function PlanBlock({ slot, len, person, wait }: { slot: Slot; len: number; person: PersonId; wait: number }) {
  const mission = slot === "off" || slot === "clash" ? null : MISSIONS[slot];
  const tone = mission ? TONE[mission.tone] : null;
  const fill =
    slot === "off"
      ? "bg-[repeating-linear-gradient(135deg,#f3f4f7_0_4px,#e8ebf0_4px_8px)]"
      : slot === "clash"
        ? "bg-rose-soft ring-1 ring-inset ring-rose/50"
        : tone?.soft;
  const ink = slot === "off" ? "text-[#5b6475]" : slot === "clash" ? "text-rose-ink" : tone?.text;
  return (
    <>
      <span data-grow-on-view className={cn("absolute inset-0", fill)} style={delay(wait)}>
        {tone ? <span className={cn("absolute inset-y-0 left-0 w-[3px]", tone.solid)} /> : null}
      </span>
      <span data-appear-on-view className={cn("relative flex h-full items-center gap-1 text-[9.5px] font-semibold", mission ? "pl-2 pr-1.5" : "px-1.5", ink)} style={delay(wait + 450)}>
        {slot === "off" && person === "manon" ? <Plane size={9} className="shrink-0" /> : null}
        {slot === "clash" ? <TriangleAlert size={9} className="shrink-0 animate-pulse-dot" /> : null}
        <span className="truncate">{mission ? mission.name : slot === "clash" ? "2 missions" : person === "manon" ? "Congé" : "Absent"}</span>
        {mission && len >= 4 ? <span className="ml-auto shrink-0 font-medium opacity-60">{`${String(len / 2).replace(".", ",")} j`}</span> : null}
      </span>
    </>
  );
}
