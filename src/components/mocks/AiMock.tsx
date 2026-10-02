"use client";

import {
  ArrowRight,
  ArrowUp,
  AtSign,
  BellPlus,
  Check,
  ChevronDown,
  Copy,
  CornerDownRight,
  History,
  ListOrdered,
  MousePointer2,
  NotebookPen,
  PenLine,
  RefreshCw,
  ScrollText,
  Sparkles,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { typo } from "@/lib/typo";
import { Avatar, Chip, MockShell, TONE, type Tone } from "./kit";

/*
 * S5, the Analyse IA Stratégique of a mission: its synthesis and four
 * recommendations ranked by priority on the left, the assistant on the right.
 * Each loop the analysis refreshes and ranks its cards one by one, the
 * assistant answers a first question with a chart, an action is applied, then
 * a follow-up question ends with reminders created from the chat. Copy-backed
 * features only: no model names, hosting, daily report or Grain/Fireflies.
 */

const t = typo;

type Reco = {
  title: string;
  why: string;
  impact: string;
  tag: string;
  priority: { label: string; tone: Tone };
  action: string;
  done: string;
  primary?: boolean;
};

const RECOS: Reco[] = [
  {
    title: "Appeler en priorité entre 10 h et 12 h",
    why: "Les appels entre 10 h et 12 h décrochent **2× plus** sur Logistique IDF.",
    impact: "+6 RDV estimés / mois",
    tag: "Créneaux · 1 284 appels lus",
    priority: { label: "Priorité haute", tone: "coral" },
    action: "Ajuster la file",
    done: "File ajustée",
    primary: true,
  },
  {
    title: "Rappeler les 14 leads chauds",
    why: "**14\u00a0contacts** intéressés attendent un rappel depuis plus de 7 jours.",
    impact: "+4 RDV estimés / mois",
    tag: "Rappels · 3 SDR concernés",
    priority: { label: "Priorité haute", tone: "coral" },
    action: "Créer les rappels",
    done: "Rappels créés",
    primary: true,
  },
  {
    title: "Retravailler l'objection « prestataire »",
    why: "« On a déjà un prestataire » revient dans **41 %** des refus argumentés.",
    impact: "+2 RDV estimés / mois",
    tag: "Script · 212 notes d'appel lues",
    priority: { label: "Priorité moyenne", tone: "sun" },
    action: "Réécrire le script",
    done: "Script prêt",
  },
  {
    title: "Rééquilibrer le planning de jeudi",
    why: "Mehdi est planifié sur 2 missions jeudi : **3 h** d'appels en moins ici.",
    impact: "+1 RDV estimé / mois",
    tag: "Planning · semaine 41",
    priority: { label: "Priorité basse", tone: "azure" },
    action: "Ouvrir le planning",
    done: "Planning ouvert",
  },
];

const KPIS: { label: string; value: string; unit?: string; delta: string; tone: Tone }[] = [
  { label: "Appels", value: "1 284", delta: "+12 %", tone: "mint" },
  { label: "Taux de décroché", value: "27 %", delta: "+3 pts", tone: "mint" },
  { label: "RDV pris", value: "46", unit: "/ 50", delta: "92 %", tone: "mint" },
  { label: "Leads chauds", value: "14", delta: "sans rappel", tone: "coral" },
];

const SYNTHESIS =
  "Objectif en vue, mais des leads chauds refroidissent. Deux leviers rapides : appeler entre 10 h et 12 h et rappeler sous 48 h.";

/** RDV per 100 calls, last 30 days. */
const MISSIONS = [
  { name: "Retail Grand Ouest", value: 4.8 },
  { name: "Logistique IDF", value: 3.6 },
  { name: "SaaS RH Lyon", value: 2.7 },
  { name: "Industrie Nord", value: 1.9 },
];
const MISSION_MAX = 5;
const MISSION_AVG = 3.1;

const ASSIGN = [
  { initials: "SL", name: "Sarah Lemoine", leads: 6, seed: 2 },
  { initials: "MS", name: "Mehdi Saïdi", leads: 5, seed: 3 },
  { initials: "LF", name: "Lucas Fontaine", leads: 3, seed: 5 },
];

const Q1 = "Quelle mission convertit le mieux ce mois-ci ?";
const Q2 = "Qui doit rappeler les leads chauds ?";
const FOLLOW_UPS = [Q2, "Pourquoi Retail ?", "Comparer au mois dernier"];
/** Example questions from the copy, shown on a new conversation. */
const STARTERS = [
  "Quels rappels dois-je passer aujourd'hui ?",
  "Combien de rendez-vous cette semaine sur la campagne Retail ?",
  "Qui est en retard sur son planning ?",
];

/*
 * One loop, a step every 1.2 s:
 *  0 the analysis refreshes, new conversation · 1–4 cards ranked one by one, Q1 typed then sent
 *  3–6 the answer streams with its chart, then follow-ups · 9–10 « Ajuster la file » applied
 *  11–16 a follow-up is asked and answered · 17–18 reminders created from the chat · 19 new chat
 * The first pass opens on step 6 (the most telling frame) and plays its entrances in CSS.
 */
const STEPS = 20;
const START = 6;

/** Animation delay from `--d`, dropped under reduced motion. */
const DELAYED = "motion-safe:[animation-delay:var(--d)]";
const delay = (ms: number) => vars({ "--d": `${ms}ms` });

const SPARK_TILE = "bg-gradient-to-br from-[#7a5cff] to-[#b18cff] text-white";

type Word = { index: number; parts: { text: string; bold: boolean }[] };

/** Splits copy into words at ordinary spaces (no-break spaces stay inside a word); `**…**` marks bold. */
function tokenize(text: string): Word[] {
  let bold = false;
  return typo(text)
    .split(" ")
    .filter(Boolean)
    .map((raw, index) => {
      const parts: Word["parts"] = [];
      raw.split("**").forEach((piece, k) => {
        if (k > 0) bold = !bold;
        if (piece) parts.push({ text: piece, bold });
      });
      return { index, parts };
    });
}

function Words({ text, bold, word }: { text: string; bold: string; word?: (index: number) => { className?: string; style?: CSSProperties } }) {
  return tokenize(text).map((w) => {
    const extra = word?.(w.index);
    return (
      <span key={w.index}>
        {w.index > 0 ? " " : null}
        <span className={extra?.className} style={extra?.style}>
          {w.parts.map((part, k) => (
            <span key={k} className={part.bold ? bold : undefined}>
              {part.text}
            </span>
          ))}
        </span>
      </span>
    );
  });
}

/** AI text streaming in: the words fade in one after another. */
function Stream({ text, from = 0, step = 26 }: { text: string; from?: number; step?: number }) {
  return (
    <Words
      text={text}
      bold="font-semibold text-[#0b1220]"
      word={(i) => ({ className: cn("animate-fade-in [animation-duration:450ms]", DELAYED), style: delay(from + i * step) })}
    />
  );
}

function Cursor({ className }: { className?: string }) {
  return (
    <MousePointer2
      size={18}
      strokeWidth={1.5}
      className={cn("pointer-events-none absolute z-10 animate-pop fill-[#0b0f1a] text-white drop-shadow-[0_3px_4px_rgb(11_15_26/0.35)]", className)}
    />
  );
}

function Rank({ n, top }: { n: number; top?: boolean }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center">
      {top ? <span className="absolute -inset-1 animate-pulse-dot rounded-[14px] bg-violet/35 blur-[6px]" /> : null}
      <span
        className={cn(
          "relative grid size-9 place-items-center rounded-xl font-display text-[18px] leading-none",
          top ? cn(SPARK_TILE, "shadow-[0_6px_16px_-6px_rgb(122_92_255/0.9)]") : "bg-violet-soft text-violet-ink",
        )}
      >
        {n}
      </span>
    </span>
  );
}

function ActionButton({ reco, state }: { reco: Reco; state: "idle" | "pressed" | "done" }) {
  const done = state === "done";
  return (
    <span
      className={cn(
        "relative flex h-8 w-[136px] shrink-0 items-center justify-center gap-1.5 rounded-xl text-[11px] font-semibold leading-none transition-[scale,background-color,box-shadow,color] duration-200",
        done
          ? "bg-mint-soft text-mint-ink"
          : state === "pressed"
            ? "scale-95 bg-accent-hover text-white shadow-[0_0_0_4px_rgb(51_85_255/0.18)]"
            : reco.primary
              ? "bg-accent text-white shadow-[0_6px_14px_-6px_rgb(51_85_255/0.75)]"
              : "bg-white text-[#0b1220] ring-1 ring-black/10",
      )}
    >
      {done ? (
        <span key="done" className="flex animate-pop items-center gap-1.5">
          <Check size={12} strokeWidth={3} /> {t(reco.done)}
        </span>
      ) : (
        <>
          {t(reco.action)} <ArrowRight size={12} className={reco.primary ? "opacity-80" : "text-[#9aa3b2]"} />
        </>
      )}
      {state === "pressed" ? <Cursor className="-bottom-3 right-5" /> : null}
    </span>
  );
}

function RecoCard({ reco, rank, state, style }: { reco: Reco; rank: number; state: "idle" | "pressed" | "done"; style?: CSSProperties }) {
  const top = rank === 1;
  return (
    <div
      className={cn(
        "relative flex h-[94px] animate-pop items-center gap-3 rounded-[16px] px-3.5 ring-1",
        DELAYED,
        top ? "bg-[linear-gradient(90deg,#f6f3ff,#ffffff_55%)] shadow-[0_12px_30px_-18px_rgb(122_92_255/0.7)] ring-violet/30" : "bg-white ring-black/[0.06]",
      )}
      style={style}
    >
      <Rank n={rank} top={top} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2">
          <span className="truncate text-[13px] font-semibold leading-[18px]">{t(reco.title)}</span>
          <Chip tone={reco.priority.tone} className="leading-[14px]">
            {reco.priority.label}
          </Chip>
        </p>
        <p className="mt-0.5 whitespace-nowrap text-[11px] leading-4 text-[#5b6475]">
          <Words text={reco.why} bold="font-semibold text-violet-ink" />
        </p>
        <p className="mt-2 flex items-center gap-2 text-[10px] leading-[14px] text-[#9aa3b2]">
          <Chip tone="mint" className="leading-[14px]">
            <TrendingUp size={10} strokeWidth={2.5} /> {t(reco.impact)}
          </Chip>
          {t(reco.tag)}
        </p>
      </div>
      <ActionButton reco={reco} state={state} />
    </div>
  );
}

function SkeletonCard() {
  const bar = "rounded-full bg-[linear-gradient(90deg,#eef0f4_25%,#f7f8fb_50%,#eef0f4_75%)] bg-[length:200%_100%] animate-shimmer";
  return (
    <div className="flex h-[94px] animate-fade-in items-center gap-3 rounded-[16px] bg-white px-3.5 ring-1 ring-black/[0.04] [animation-duration:250ms]">
      <span className={cn("size-9 shrink-0 rounded-xl", bar)} />
      <div className="flex-1 space-y-2">
        <span className={cn("block h-3 w-[46%]", bar)} />
        <span className={cn("block h-2.5 w-[82%]", bar)} />
        <span className={cn("block h-2.5 w-[30%]", bar)} />
      </div>
      <span className={cn("h-8 w-[136px] shrink-0 rounded-xl", bar)} />
    </div>
  );
}

function Kpi({ k }: { k: (typeof KPIS)[number] }) {
  return (
    <div className="rounded-xl bg-white/85 px-3 py-2 ring-1 ring-black/[0.05]">
      <p className="whitespace-nowrap text-[9px] font-semibold uppercase leading-3 tracking-wide text-[#9aa3b2]">{k.label}</p>
      <p className="mt-1 flex items-baseline gap-1 whitespace-nowrap leading-5">
        <span className="num text-[16px] font-semibold">{t(k.value)}</span>
        {k.unit ? <span className="num text-[11px] font-medium text-[#9aa3b2]">{t(k.unit)}</span> : null}
        <span className={cn("ml-1 text-[9.5px] font-semibold", TONE[k.tone].text)}>{t(k.delta)}</span>
      </p>
    </div>
  );
}

function AssistantHead({ time }: { time: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] leading-4">
      <span className={cn("grid size-5 place-items-center rounded-md", SPARK_TILE)}>
        <Sparkles size={11} />
      </span>
      <span className="font-semibold">Assistant</span>
      <span className="text-[10px] text-[#9aa3b2]">{time}</span>
    </p>
  );
}

function Thinking({ label }: { label: string }) {
  return (
    <p className="flex animate-fade-in items-center gap-2 text-[11px] leading-4">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-1.5 animate-pulse-dot rounded-full bg-violet" style={{ animationDelay: `${i * 220}ms` }} />
        ))}
      </span>
      <span className="animate-shimmer bg-[linear-gradient(90deg,#9aa3b2_0%,#9aa3b2_35%,#5232e0_50%,#9aa3b2_65%,#9aa3b2_100%)] bg-[length:200%_100%] bg-clip-text font-medium text-transparent">
        {t(label)}
      </span>
    </p>
  );
}

function UserBubble({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <p
      className={cn(
        "ml-auto w-fit max-w-[94%] animate-slide-in rounded-2xl rounded-br-md bg-accent px-3 py-2 text-[11.5px] font-medium leading-4 text-white shadow-[0_8px_18px_-10px_rgb(51_85_255/0.8)]",
        DELAYED,
      )}
      style={style}
    >
      {t(text)}
    </p>
  );
}

/** A bar that grows from the left when it mounts (the typing reveal, eased). */
function Bar({ pct, fill, from }: { pct: number; fill: string; from: number }) {
  return (
    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-black/[0.04]">
      <span
        className={cn("block h-full animate-type rounded-full [animation-duration:1s] [animation-timing-function:var(--ease-out-quint)]", DELAYED, fill)}
        style={{ width: `${pct}%`, ...delay(from) }}
      />
    </span>
  );
}

export function AiMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  const tick = useTicker(1200, inView) + START;
  const loop = Math.floor(tick / STEPS);
  const p = tick % STEPS;
  // The first pass starts complete; its entrances are staggered in CSS instead.
  const intro = loop === 0;
  const at = (ms: number) => (intro ? ms : 0);

  // The conversation follows its newest message.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [tick]);

  // Analysis
  const analysing = !intro && p < 4;
  const shown = intro ? RECOS.length : Math.min(RECOS.length, p);
  const recoState = (i: number): "idle" | "pressed" | "done" => {
    if (i === 0) return p === 9 ? "pressed" : p >= 10 ? "done" : "idle";
    if (i === 1) return p >= 18 ? "done" : "idle";
    return "idle";
  };

  // Assistant
  const fresh = !intro && p < 2;
  const q1 = (step: number) => intro || p >= step;
  const asked2 = p >= 12;
  const busy = (!intro && p >= 2 && p <= 5) || (p >= 12 && p <= 15);
  const created = p >= 18;

  return (
    <div ref={ref} className="relative">
      <MockShell
        variant="manager"
        active="Analyse IA"
        crumb="IA"
        page="Analyse IA Stratégique"
        right={
          <span className="flex items-center gap-1.5 rounded-lg bg-violet-soft px-2 py-1 font-medium text-violet-ink">
            <Sparkles size={11} /> {t("Crédits IA · 640 / 1 000")}
          </span>
        }
      >
        <div className="grid h-full grid-cols-[1fr_356px] gap-3 bg-[#f7f8fb] p-4 leading-[1.4]">
          {/* Analysis */}
          <div className="flex min-w-0 flex-col gap-3">
            <div className="relative overflow-hidden rounded-[18px] bg-white p-4 ring-1 ring-violet/15">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_100%_0%,rgb(122_92_255/0.13),transparent_60%),radial-gradient(50%_90%_at_0%_100%,rgb(31_147_255/0.06),transparent_70%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={cn("grid size-10 place-items-center rounded-2xl shadow-[0_8px_20px_-8px_rgb(122_92_255/0.85)]", SPARK_TILE)}>
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <p className="font-display text-[22px] leading-none">Analyse IA Stratégique</p>
                    <p className="mt-1.5 flex items-center gap-1.5 whitespace-nowrap text-[11px] leading-4 text-[#6b7280]">
                      Mission
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 font-semibold text-[#0b1220] ring-1 ring-black/10">
                        Logistique IDF <ChevronDown size={10} />
                      </span>
                      {t("· 3 SDR · 1 284 appels, 386 emails et 46 RDV lus")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="flex rounded-lg bg-white p-0.5 text-[10.5px] leading-4 ring-1 ring-black/10">
                    <span className="px-2 py-0.5 text-[#6b7280]">7j</span>
                    <span className="rounded-md bg-[#0b0f1a] px-2 py-0.5 font-semibold text-white">30j</span>
                    <span className="px-2 py-0.5 text-[#6b7280]">Trimestre</span>
                  </span>
                  {analysing ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold leading-[14px] text-violet-ink">
                      <RefreshCw size={10} className="animate-spin" /> {t("Analyse en cours…")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] leading-[14px] text-[#6b7280]">
                      <RefreshCw size={10} /> {t(intro ? "Mise à jour il y a 4 min" : "Mise à jour à l'instant")}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative mt-3 min-h-[52px] rounded-xl bg-white/85 px-3 py-2 ring-1 ring-violet/15">
                <p className="text-[11.5px] leading-[18px] text-[#374151]">
                  <span className="mr-1.5 inline-flex items-center gap-1 font-semibold text-violet-ink">
                    <Sparkles size={11} /> {t("Synthèse :")}
                  </span>
                  {analysing ? null : <Stream key={`syn-${loop}`} text={SYNTHESIS} from={at(200)} step={20} />}
                </p>
                {analysing ? (
                  <div className="mt-1 space-y-1.5">
                    <span className="block h-2 w-[92%] animate-shimmer rounded-full bg-[linear-gradient(90deg,#eef0f4_25%,#f6f3ff_50%,#eef0f4_75%)] bg-[length:200%_100%]" />
                  </div>
                ) : null}
              </div>

              <div className="relative mt-3 grid grid-cols-4 gap-2">
                {KPIS.map((k) => (
                  <Kpi key={k.label} k={k} />
                ))}
              </div>
            </div>

            <p className="flex items-center justify-between px-1 text-[12px] font-semibold leading-4">
              <span className="flex items-center gap-2">
                <ListOrdered size={14} className="text-violet" /> Recommandations classées par priorité
                <Chip tone="violet" className="leading-[14px]">
                  {shown || "…"}
                </Chip>
              </span>
              <span className="flex items-center gap-1 text-[10.5px] font-medium text-[#6b7280]">
                {t("Trier : impact estimé")} <ChevronDown size={11} />
              </span>
            </p>

            <div className="flex flex-col gap-2">
              {RECOS.map((r, i) =>
                i < shown ? (
                  <RecoCard key={`reco-${loop}-${i}`} reco={r} rank={i + 1} state={recoState(i)} style={delay(at(100 + i * 130))} />
                ) : (
                  <SkeletonCard key={`skel-${loop}-${i}`} />
                ),
              )}
            </div>
          </div>

          {/* Assistant */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-[18px] bg-white ring-1 ring-black/[0.06]">
            <div className="flex items-center gap-2.5 border-b border-black/5 px-4 py-3">
              <span className={cn("grid size-8 place-items-center rounded-xl", SPARK_TILE)}>
                <Sparkles size={15} />
              </span>
              <span className="min-w-0 flex-1 leading-tight">
                <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                  Assistant <span className="size-1.5 rounded-full bg-mint" />
                </span>
                <span className="block text-[10px] text-[#6b7280]">{t("Répond à partir de vos appels, emails et RDV")}</span>
              </span>
              <span className="grid size-7 place-items-center rounded-lg text-[#6b7280] ring-1 ring-black/10">
                <History size={13} />
              </span>
              <span
                className={cn(
                  "relative grid size-7 place-items-center rounded-lg ring-1 ring-black/10 transition-[scale,background-color] duration-200",
                  p === 19 ? "scale-90 bg-violet-soft text-violet-ink" : "text-[#6b7280]",
                )}
              >
                <SquarePen size={13} />
                {p === 19 ? <Cursor className="-bottom-3 -right-1" /> : null}
              </span>
            </div>

            <div
              ref={listRef}
              className={cn("flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-3", asked2 && "[mask-image:linear-gradient(to_bottom,transparent,#000_36px)]")}
            >
              {fresh ? (
                <div key={`fresh-${loop}`} className="flex flex-1 animate-fade-in flex-col items-center justify-center px-2 text-center [animation-duration:300ms]">
                  <span className={cn("grid size-11 place-items-center rounded-2xl shadow-[0_10px_24px_-10px_rgb(122_92_255/0.9)]", SPARK_TILE)}>
                    <Sparkles size={19} />
                  </span>
                  <p className="mt-3 font-display text-[21px] leading-none">Bonjour Camille</p>
                  <p className="mt-2 text-[11px] leading-4 text-[#6b7280]">{t("Je connais vos campagnes, vos rendez-vous et l'activité de l'équipe.")}</p>
                  <div className="mt-4 w-full space-y-1.5 text-left">
                    {STARTERS.map((s) => (
                      <p key={s} className="flex items-center gap-2 rounded-xl bg-[#f7f8fb] px-3 py-2 text-[11px] leading-4 text-[#374151] ring-1 ring-black/[0.04]">
                        <CornerDownRight size={11} className="shrink-0 text-violet" /> {t(s)}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Q1: which mission converts best */}
                  <p className="text-center text-[10px] leading-[14px] text-[#9aa3b2]">{t("Aujourd'hui · 10:42")}</p>
                  <UserBubble key={`q1-${loop}`} text={Q1} style={delay(at(0))} />
                  <div key={`a1-${loop}`} className="space-y-2">
                    <AssistantHead time="10:42" />
                    {!intro && p === 2 ? <Thinking label="Lecture de 4 missions et 2 146 appels…" /> : null}
                    {q1(3) ? (
                      <p className="text-[12px] leading-[18px] text-[#374151]">
                        <Stream
                          text={"**Retail Grand Ouest** convertit le mieux ce mois-ci : **4,8\u00a0RDV** pour 100 appels, contre 3,1 en moyenne sur vos missions."}
                          from={at(300)}
                        />
                      </p>
                    ) : null}
                    {q1(4) ? (
                      <div className={cn("animate-slide-in rounded-xl bg-[#f7f8fb] p-2.5 ring-1 ring-black/[0.04]", DELAYED)} style={delay(at(750))}>
                        <p className="flex items-center justify-between text-[9px] font-semibold uppercase leading-3 tracking-wide text-[#9aa3b2]">
                          <span>RDV pour 100 appels</span>
                          <span>30 derniers jours</span>
                        </p>
                        <div className="relative mt-2 space-y-2">
                          {MISSIONS.map((m, i) => (
                            <div key={m.name} className="flex items-center gap-2 text-[10.5px] leading-[14px]">
                              <span className={cn("w-[104px] shrink-0 truncate", i === 0 ? "font-semibold text-[#0b1220]" : "text-[#5b6475]")}>{m.name}</span>
                              <Bar
                                pct={(m.value / MISSION_MAX) * 100}
                                fill={i === 0 ? "bg-gradient-to-r from-[#7a5cff] to-[#a98fff]" : "bg-violet/25"}
                                from={at(750) + 150 + i * 110}
                              />
                              <span className={cn("num w-6 text-right font-semibold", i === 0 ? "text-violet-ink" : "text-[#374151]")}>
                                {String(m.value).replace(".", ",")}
                              </span>
                            </div>
                          ))}
                          {/* Average across missions */}
                          <span
                            className="pointer-events-none absolute -bottom-1 -top-1 border-l border-dashed border-[#9aa3b2]"
                            style={{ left: `calc(112px + (100% - 144px) * ${MISSION_AVG / MISSION_MAX})` }}
                          />
                        </div>
                        <p className="mt-1.5 flex items-center justify-end gap-1 text-[9px] leading-3 text-[#9aa3b2]">
                          <span className="h-2.5 border-l border-dashed border-[#9aa3b2]" /> {t("moyenne des missions : 3,1")}
                        </p>
                      </div>
                    ) : null}
                    {q1(5) ? (
                      <>
                        <p className="text-[12px] leading-[18px] text-[#374151]">
                          <Stream text={"Logistique IDF suit à 3,6, mais **14\u00a0leads chauds** y attendent un rappel depuis plus de 7 jours."} from={at(1350)} />
                        </p>
                        <p className={cn("flex animate-fade-in items-center text-[9.5px] leading-[14px] text-[#9aa3b2]", DELAYED)} style={delay(at(1850))}>
                          {t("Sources : 2 146 appels · 61 RDV · 4 missions")}
                          <span className="ml-auto flex items-center gap-2 text-[#b4bbc7]">
                            <Copy size={11} />
                            <ThumbsUp size={11} />
                            <ThumbsDown size={11} />
                          </span>
                        </p>
                      </>
                    ) : null}
                  </div>
                  {q1(6) ? (
                    <div className="flex flex-wrap gap-1.5">
                      {FOLLOW_UPS.map((f, i) => {
                        const used = i === 0 && p >= 11;
                        return (
                          <span
                            key={`${f}-${loop}`}
                            className={cn(
                              "relative inline-flex animate-pop items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-medium leading-[14px] ring-1 transition-[scale,background-color] duration-200",
                              DELAYED,
                              used ? "bg-violet-soft text-violet-ink ring-violet/40" : "bg-white text-violet-ink ring-violet/25",
                              p === 11 && i === 0 && "scale-95",
                            )}
                            style={delay(at(1900 + i * 110))}
                          >
                            <CornerDownRight size={10} /> {t(f)}
                            {p === 11 && i === 0 ? <Cursor className="-bottom-3 right-6" /> : null}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Q2: who should call the hot leads back */}
                  {asked2 ? (
                    <>
                      <UserBubble text={Q2} />
                      <div className="space-y-2">
                        <AssistantHead time="10:44" />
                        {p === 12 ? <Thinking label="Lecture des leads chauds et des plannings…" /> : null}
                        {p >= 13 ? (
                          <p className="text-[12px] leading-[18px] text-[#374151]">
                            <Stream text={"Je propose de confier les **14\u00a0leads chauds** de Logistique IDF aux SDR qui les ont qualifiés :"} />
                          </p>
                        ) : null}
                        {p >= 14 ? (
                          <div className="animate-slide-in space-y-1.5 rounded-xl bg-[#f7f8fb] p-2.5 ring-1 ring-black/[0.04]">
                            <p className="flex items-center justify-between text-[9px] font-semibold uppercase leading-3 tracking-wide text-[#9aa3b2]">
                              <span>Répartition proposée</span>
                              <span>14 leads</span>
                            </p>
                            {ASSIGN.map((a, i) => (
                              <div key={a.name} className="flex items-center gap-2 text-[11px] leading-4">
                                <Avatar initials={a.initials} seed={a.seed} size={20} />
                                <span className="w-[92px] shrink-0 truncate font-semibold">{a.name}</span>
                                <Bar pct={(a.leads / 6) * 100} fill="bg-gradient-to-r from-coral to-sun" from={150 + i * 110} />
                                <span className="num w-4 text-right font-semibold">{a.leads}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {p >= 15 ? (
                          <p className="text-[12px] leading-[18px] text-[#374151]">
                            <Stream text={"Créneau conseillé : demain entre 10 h et 12 h, quand la mission décroche **2× plus**."} />
                          </p>
                        ) : null}
                        {p >= 16 ? (
                          <div className="flex animate-slide-in items-center gap-2.5 rounded-xl bg-white p-2 ring-1 ring-black/[0.08]">
                            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-coral-soft text-coral-ink">
                              <BellPlus size={13} />
                            </span>
                            <span className="min-w-0 flex-1 leading-tight">
                              <span className="block text-[11px] font-semibold">{t("14 rappels · demain 10 h")}</span>
                              <span className="block truncate text-[9.5px] text-[#6b7280]">{t("Dans la file de chaque SDR")}</span>
                            </span>
                            <span
                              className={cn(
                                "relative flex h-7 shrink-0 items-center gap-1 rounded-lg px-2.5 text-[10.5px] font-semibold leading-none transition-[scale,background-color,box-shadow,color] duration-200",
                                created
                                  ? "bg-mint-soft text-mint-ink"
                                  : p === 17
                                    ? "scale-95 bg-accent-hover text-white shadow-[0_0_0_4px_rgb(51_85_255/0.18)]"
                                    : "bg-accent text-white",
                              )}
                            >
                              {created ? (
                                <span key="done" className="flex animate-pop items-center gap-1">
                                  <Check size={11} strokeWidth={3} /> {t("14 rappels créés")}
                                </span>
                              ) : (
                                t("Créer les rappels")
                              )}
                              {p === 17 ? <Cursor className="-bottom-3 right-3" /> : null}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>

            <div className="border-t border-black/5 px-3 pb-3 pt-2.5">
              <div className="flex gap-1.5 text-[10px] font-medium leading-[14px] text-[#5b6475]">
                {[
                  { icon: <PenLine size={10} />, label: "Rédiger un email" },
                  { icon: <ScrollText size={10} />, label: "Script d'appel" },
                  { icon: <NotebookPen size={10} />, label: "Compte rendu Leexi" },
                ].map((a) => (
                  <span key={a.label} className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f7f8fb] px-2 py-1 ring-1 ring-black/[0.05]">
                    <span className="text-violet">{a.icon}</span> {t(a.label)}
                  </span>
                ))}
              </div>
              <div
                className={cn(
                  "mt-2 rounded-xl bg-white px-3 pb-2 pt-2.5 ring-1 transition-shadow duration-300",
                  fresh ? "shadow-[0_0_0_3px_rgb(122_92_255/0.1)] ring-violet/40" : "shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-black/10",
                )}
              >
                <p className="h-4 whitespace-nowrap text-[11.5px] leading-4">
                  {!intro && p === 1 ? (
                    <span key={`type-${loop}`} className="inline-block animate-type font-medium text-[#0b1220]">
                      {t(Q1)}
                      <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-[#0b1220]" />
                    </span>
                  ) : (
                    <>
                      <span className="mr-px inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-[#0b1220]" />
                      <span className="text-[#9aa3b2]">{t("Posez une question sur vos campagnes…")}</span>
                    </>
                  )}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-violet-soft px-1.5 py-0.5 text-[10px] font-semibold leading-[14px] text-violet-ink">
                    <AtSign size={10} /> Toutes les missions <ChevronDown size={10} />
                  </span>
                  <span className={cn("grid size-7 place-items-center rounded-lg text-white transition-colors duration-300", busy ? "bg-[#0b0f1a]" : "bg-accent")}>
                    {busy ? <span className="size-2.5 rounded-[3px] bg-white" /> : <ArrowUp size={14} strokeWidth={2.5} />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MockShell>

      {/* The « Analyse IA » shortcut at the top of the sidebar is the current page. Same box as the kit's pill. */}
      <div aria-hidden className="pointer-events-none absolute left-3 top-14 w-[166px]">
        <div className="flex items-center gap-2 rounded-lg border border-amber-300/70 bg-amber-300/15 px-2.5 py-1.5 text-[11px] font-semibold text-transparent shadow-[0_0_22px_-4px_rgb(252_211_77/0.55)]">
          <Sparkles size={12} /> Analyse IA
          <span className="ml-auto size-1.5 animate-pulse-dot rounded-full bg-amber-300" />
        </div>
        <span className="absolute -left-3 bottom-1.5 top-1.5 w-[3px] rounded-r bg-accent" />
      </div>
    </div>
  );
}
