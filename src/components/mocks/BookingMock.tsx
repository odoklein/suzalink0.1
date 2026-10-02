"use client";

import {
  AudioLines,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Flag,
  Mail,
  MailCheck,
  MapPin,
  MousePointer2,
  Phone,
  PhoneOff,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";
import { Avatar, Chip, MockShell, Panel, PanelTitle, TONE, type Tone } from "./kit";

/*
 * S3, booking and the fiche RDV: the week planning on the left, the selected
 * meeting on the right. Every ~11 s a slot is booked during a call, the
 * booking is detected, the AI writes the five-part fiche from the call
 * transcription, a manager confirms, and only then is the client notified.
 */

type Kind = "visio" | "presentiel" | "telephone";

const KINDS: Record<Kind, { label: string; Icon: LucideIcon; tone: Tone }> = {
  visio: { label: "Visio", Icon: Video, tone: "azure" },
  presentiel: { label: "Présentiel", Icon: MapPin, tone: "violet" },
  telephone: { label: "Téléphone", Icon: Phone, tone: "coral" },
};

type Status = "confirme" | "attente" | "manque" | "annule";

const STATUSES: Record<Status, { label: string; Icon: LucideIcon; card: string; dot: string }> = {
  confirme: { label: "Confirmé", Icon: Check, card: "border-mint bg-mint-soft text-mint-ink", dot: "bg-mint" },
  attente: { label: "En attente", Icon: Clock, card: "border-sun bg-sun-soft text-sun-ink", dot: "bg-sun" },
  manque: { label: "Manqué", Icon: RotateCcw, card: "border-rose bg-rose-soft text-rose-ink", dot: "bg-rose" },
  annule: { label: "Annulé", Icon: X, card: "border-[#c3c9d3] bg-[#f1f3f6] text-[#7b8494]", dot: "bg-[#c3c9d3]" },
};

type CalEvent = { day: number; from: number; to: number; company: string; kind: Kind; status: Status; note?: string };

/** The rest of the week, already on the planning. */
const EVENTS: CalEvent[] = [
  { day: 0, from: 9, to: 10, company: "Valrhône Fret", kind: "visio", status: "manque", note: "Renvoyé en file" },
  { day: 0, from: 14, to: 15, company: "Sogétrans", kind: "presentiel", status: "confirme" },
  { day: 0, from: 16, to: 16.75, company: "Martin Frigo", kind: "telephone", status: "confirme" },
  { day: 1, from: 11.5, to: 12.5, company: "Nexa Log", kind: "visio", status: "confirme" },
  { day: 1, from: 15, to: 16, company: "Alpes Messagerie", kind: "visio", status: "attente", note: "En attente" },
  { day: 2, from: 9, to: 9.75, company: "Batiflux", kind: "telephone", status: "confirme" },
  { day: 2, from: 11, to: 12, company: "Duval Transports", kind: "presentiel", status: "annule", note: "Motif : budget gelé" },
  { day: 2, from: 14.5, to: 15.5, company: "Oréa Distribution", kind: "visio", status: "confirme" },
  { day: 3, from: 14, to: 15, company: "Lacroix Logistique", kind: "presentiel", status: "attente", note: "En attente" },
  { day: 3, from: 16, to: 16.75, company: "Hexa Froid", kind: "visio", status: "confirme" },
  { day: 4, from: 9.5, to: 10.25, company: "Primeurs Vidal", kind: "visio", status: "confirme" },
  { day: 4, from: 11, to: 12, company: "Sud Palettes", kind: "telephone", status: "confirme" },
];

type Meeting = {
  company: string;
  contact: string;
  role: string;
  initials: string;
  seed: number;
  day: number;
  from: number;
  to: number;
  kind: Kind;
  date: string;
  owner: string;
  /** Call timer while the slot is being booked, then the final call length. */
  live: [string, string];
  call: string;
  bookedAt: string;
  confirmedAt: string;
  /** The five parts of the fiche, one or two lines each. */
  fiche: string[][];
};

/** The meetings booked during the loop (same contacts as the calling workspace). */
const MEETINGS: Meeting[] = [
  {
    company: "Transports Lemaire",
    contact: "Claire Vasseur",
    role: "Directrice des achats",
    initials: "CV",
    seed: 0,
    day: 3,
    from: 10.5,
    to: 11.5,
    kind: "visio",
    date: "Jeu. 8 oct.",
    owner: "Hugo Lambert",
    live: ["03:41", "03:42"],
    call: "04:12",
    bookedAt: "11:06",
    confirmedAt: "11:14",
    fiche: [
      ["Transporteur régional, 85 poids lourds à Lyon.", "Tournées encore planifiées à la main, sur Excel."],
      ["Claire Vasseur, directrice des achats, décide.", "Sa DAF participe à la démo."],
      ["Réduire les kilomètres à vide et le temps passé", "chaque matin à bâtir les tournées."],
      ["« Notre contrat télématique court jusqu'en mars. »", "Ouverte à comparer si le gain est chiffré."],
      ["Démo ciblée sur les tournées lyonnaises,", "chiffrage attendu avant fin octobre."],
    ],
  },
  {
    company: "Delorme & Fils",
    contact: "Marc Delorme",
    role: "Directeur commercial",
    initials: "MD",
    seed: 3,
    day: 1,
    from: 9.5,
    to: 10.5,
    kind: "presentiel",
    date: "Mar. 6 oct.",
    owner: "Inès Roux",
    live: ["05:30", "05:31"],
    call: "06:05",
    bookedAt: "11:21",
    confirmedAt: "11:27",
    fiche: [
      ["Négoce de matériaux, 3 dépôts en Gironde.", "Livraisons chantier calées par téléphone."],
      ["Marc Delorme, directeur commercial, et le DG.", "Rendez-vous au siège, à Bordeaux."],
      ["Tenir les créneaux de livraison chantier", "et prévenir les clients en cas de retard."],
      ["« Nos chauffeurs ne veulent pas d'une appli de plus. »"],
      ["Visite du dépôt de Mérignac,", "puis proposition chiffrée."],
    ],
  },
  {
    company: "Groupe Arnaud",
    contact: "Julien Marchetti",
    role: "Responsable logistique",
    initials: "JM",
    seed: 1,
    day: 4,
    from: 14,
    to: 15,
    kind: "telephone",
    date: "Ven. 9 oct.",
    owner: "Hugo Lambert",
    live: ["02:48", "02:49"],
    call: "03:20",
    bookedAt: "11:32",
    confirmedAt: "11:38",
    fiche: [
      ["340 salariés, 6 entrepôts dans les Hauts-de-France.", "Suivi des livraisons réparti entre trois outils."],
      ["Julien Marchetti, responsable logistique.", "Le DSI se joint à l'appel."],
      ["Suivre les livraisons en temps réel", "et partager l'heure d'arrivée aux clients."],
      ["« Le budget 2027 n'est pas arbitré avant décembre. »"],
      ["Point technique avec le DSI, puis devis."],
    ],
  },
];

const PARTS: { title: string; Icon: LucideIcon }[] = [
  { title: "Contexte", Icon: Building2 },
  { title: "Interlocuteurs", Icon: Users },
  { title: "Besoin exprimé", Icon: Target },
  { title: "Objections", Icon: ShieldAlert },
  { title: "Prochaine étape", Icon: Flag },
];

const MANAGER = { initials: "SL", name: "Sarah L.", seed: 4 };

const DAYS = [
  { label: "Lun.", n: 5 },
  { label: "Mar.", n: 6 },
  { label: "Mer.", n: 7 },
  { label: "Jeu.", n: 8 },
  { label: "Ven.", n: 9 },
];
const TODAY = 0;
const NOW = 11 + 40 / 60;

/** Planning geometry: 09:00 → 18:00, one hour = H px. */
const START = 9;
const HOURS = 9;
const H = 60;
/** Width of the hours column; keep in sync with the 36px in grid-cols-[36px_…] below. */
const GUTTER = 36;
const y = (h: number) => (h - START) * H;
const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;
/** "10:30 – 11:30" with narrow no-break spaces, so it stays on one line. */
const range = (from: number, to: number) => `${hhmm(from)}\u202f–\u202f${hhmm(to)}`;

const GRID_LINES: CSSProperties = {
  backgroundImage: `linear-gradient(to bottom, rgb(11 18 32 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, transparent ${H / 2}px, rgb(11 18 32 / 0.03) ${H / 2}px, rgb(11 18 32 / 0.03) ${H / 2 + 1}px, transparent ${H / 2 + 1}px)`,
  backgroundSize: `100% ${H}px`,
};
const LUNCH: CSSProperties = {
  top: y(12.5),
  height: H,
  backgroundImage: "repeating-linear-gradient(135deg, rgb(11 18 32 / 0.045) 0 1px, transparent 1px 7px)",
};

// Phases of one booking: 0 slot chosen in the call · 1 booking detected ·
// 2–6 the fiche is written part by part · 7 a manager confirms · 8 the client
// is notified · 9 hold.
const STEPS = 10;

type SlotState = "hidden" | "selecting" | "pending" | "confirmed" | "done";

const t = typo;

function EventCard({ e, order }: { e: CalEvent; order: number }) {
  const s = STATUSES[e.status];
  const k = KINDS[e.kind];
  const past = e.day === TODAY && e.to <= NOW;
  return (
    <div
      data-appear-on-view
      className={cn("absolute inset-x-[2px] rounded-[9px] border-l-[3px] py-1 pl-1.5 pr-1", s.card, past && "opacity-60")}
      style={{ top: y(e.from) + 1, height: (e.to - e.from) * H - 2, "--delay": `${120 + order * 45}ms` } as CSSProperties}
    >
      <p className={cn("whitespace-nowrap text-[10px] font-semibold leading-3", e.status === "annule" && "line-through decoration-[#9aa3b2]")}>{e.company}</p>
      <p className="mt-1 flex items-center gap-[3px] whitespace-nowrap text-[9.5px] font-medium leading-3 opacity-80">
        <k.Icon size={9} strokeWidth={2.4} className="shrink-0" />
        {range(e.from, e.to)}
      </p>
      {e.note && e.to - e.from >= 1 ? (
        <p className="mt-1 flex items-center gap-[3px] whitespace-nowrap text-[9px] font-semibold leading-3">
          <s.Icon size={9} strokeWidth={2.8} className="shrink-0" /> {t(e.note)}
        </p>
      ) : null}
    </div>
  );
}

function BookedCard({ m, state, selected, animate }: { m: Meeting; state: SlotState; selected: boolean; animate: boolean }) {
  const k = KINDS[m.kind];
  const live = state === "pending" || state === "confirmed";
  return (
    <div
      className={cn(
        "absolute inset-x-[2px] z-10 rounded-[9px] border-l-[3px] py-1 pl-1.5 pr-1 transition-[opacity,scale,background-color,border-color,color,box-shadow] duration-500 ease-out-expo",
        state === "hidden" && "scale-95 border-transparent opacity-0",
        state === "selecting" && "border-transparent bg-mint-soft/70 text-mint-ink outline-[1.5px] outline-offset-[-1.5px] outline-mint outline-dashed",
        live && "border-[#0a9e6e] bg-mint text-white shadow-[0_12px_24px_-12px_rgb(16_185_129/0.95)]",
        state === "done" && "border-mint bg-mint-soft text-mint-ink",
        selected && state === "done" && "ring-1 ring-mint/60",
      )}
      style={{ top: y(m.from) + 1, height: (m.to - m.from) * H - 2 }}
    >
      <p className="whitespace-nowrap text-[10px] font-semibold leading-3">{m.company}</p>
      <p className="mt-1 flex items-center gap-[3px] whitespace-nowrap text-[9.5px] font-medium leading-3 opacity-90">
        <k.Icon size={9} strokeWidth={2.4} className="shrink-0" />
        {range(m.from, m.to)}
      </p>
      {state === "selecting" ? (
        <p className="mt-1.5 flex items-center gap-1 text-[9px] font-semibold leading-3">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-mint" /> {t("Réservation…")}
        </p>
      ) : live ? (
        <span
          key={state}
          className={cn(
            "mt-1.5 inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-px text-[9px] font-bold leading-3",
            state === "confirmed" ? "text-mint-ink" : "text-sun-ink",
            animate && "animate-pop",
          )}
        >
          {state === "confirmed" ? <Check size={9} strokeWidth={3} /> : <Clock size={9} strokeWidth={2.6} />}
          {state === "confirmed" ? "Confirmé" : "En attente"}
        </span>
      ) : null}
    </div>
  );
}

function Step({ on, active, tone, icon, label, sub, line }: { on: boolean; active?: boolean; tone: Tone; icon: ReactNode; label: string; sub: ReactNode; line?: "on" | "off" }) {
  return (
    <li className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "relative grid size-[22px] shrink-0 place-items-center rounded-full transition-colors duration-500",
            on ? cn(TONE[tone].solid, "text-white") : "bg-white text-[#b3bac6] ring-1 ring-black/10",
          )}
        >
          {active ? <span className={cn("absolute inset-0 animate-ping-soft rounded-full", TONE[tone].solid)} /> : null}
          <span className="relative">{icon}</span>
        </span>
        {line ? (
          <span className="h-0.5 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
            <span className={cn("block h-full origin-left bg-mint transition-transform duration-700 ease-out-expo", line === "on" ? "scale-x-100" : "scale-x-0")} />
          </span>
        ) : null}
      </div>
      <p className={cn("mt-1.5 whitespace-nowrap text-[10.5px] font-semibold leading-4 transition-colors duration-500", on ? "text-[#0b1220]" : "text-[#9aa3b2]")}>{label}</p>
      <div className="mt-px flex items-center gap-1 whitespace-nowrap text-[9.5px] leading-[14px] text-[#6b7280]">{sub}</div>
    </li>
  );
}

export function BookingMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  // Start on the most telling frame (booked, fiche written, confirmed, client notified), then play.
  const played = useTicker(1150, inView);
  const tick = played + STEPS - 1;
  const phase = tick % STEPS;
  const index = Math.floor(tick / STEPS) % MEETINGS.length;
  const prev = (index + MEETINGS.length - 1) % MEETINGS.length;
  const m = MEETINGS[index];

  const slot = (j: number): SlotState => {
    if (j === index) return phase === 0 ? "selecting" : phase >= 7 ? "confirmed" : "pending";
    return j === prev ? "done" : "hidden";
  };

  // The fiche on the right stays on the previous meeting until the new booking is detected.
  const shown = phase === 0 ? prev : index;
  const fp = phase === 0 ? STEPS - 1 : phase;
  const f = MEETINGS[shown];
  const fk = KINDS[f.kind];
  const drafting = fp <= 6;
  const confirmed = fp >= 7;
  const notified = fp >= 8;

  const calling = phase <= 1;
  const toastOn = phase === 1 || phase === 2 || phase >= 8;
  const detected = phase >= 1 && phase <= 6;

  const counts = DAYS.map(
    (_, d) =>
      EVENTS.filter((e) => e.day === d && e.status !== "annule").length +
      MEETINGS.filter((mm, j) => mm.day === d && ["pending", "confirmed", "done"].includes(slot(j))).length,
  );

  return (
    <div ref={ref}>
      <MockShell
        variant="sdr"
        active="Rendez-vous"
        crumb="Rendez-vous"
        page="Planning"
        user={{ initials: "CR", name: "Camille R.", role: "SDR" }}
        right={
          calling ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-rose-soft px-2 py-1 font-semibold text-rose-ink">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-rose" /> En appel · {m.contact} <span className="num">{m.live[phase]}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-lg bg-[#f6f7f9] px-2 py-1 font-medium text-[#0b1220] ring-1 ring-black/5">
              <PhoneOff size={11} className="text-[#9aa3b2]" /> Appel terminé · {f.contact} · {f.call}
            </span>
          )
        }
      >
        <div className="grid h-full grid-cols-[minmax(0,1fr)_360px] gap-3 bg-[#f7f8fb] p-4 leading-snug">
          {/* Week planning */}
          <Panel className="flex min-w-0 flex-col p-3">
            <div className="flex items-center justify-between gap-3 px-1">
              <PanelTitle icon={<CalendarDays size={14} />} tone="mint" title="Du 5 au 9 octobre 2026" sub="Logistique IDF · via Cal.com" />
              <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[10.5px] font-medium">
                <span className="flex items-center rounded-lg ring-1 ring-black/10">
                  <span className="grid size-[26px] place-items-center text-[#6b7280]">
                    <ChevronLeft size={13} />
                  </span>
                  <span className="px-1">{t("Aujourd'hui")}</span>
                  <span className="grid size-[26px] place-items-center text-[#6b7280]">
                    <ChevronRight size={13} />
                  </span>
                </span>
                <span className="flex rounded-lg p-0.5 ring-1 ring-black/10">
                  <span className="px-2 py-1 text-[#6b7280]">Jour</span>
                  <span className="rounded-md bg-[#0b0f1a] px-2 py-1 font-semibold text-white">Semaine</span>
                  <span className="px-2 py-1 text-[#6b7280]">Mois</span>
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-accent px-2.5 py-[7px] font-semibold text-white">
                  <CalendarPlus size={12} /> Prendre RDV
                </span>
              </div>
            </div>

            {/* Day headers */}
            <div className="mt-3 grid grid-cols-[36px_repeat(5,minmax(0,1fr))] border-b border-black/[0.06] pb-2">
              <span className="self-center text-[8.5px] font-medium text-[#9aa3b2]">UTC+2</span>
              {DAYS.map((d, i) => (
                <div key={d.label} className="flex items-center gap-1.5 px-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{d.label}</span>
                  <span className={cn("grid size-6 place-items-center rounded-full text-[12.5px] font-semibold", i === TODAY && "bg-accent text-white")}>{d.n}</span>
                  <span className="num ml-auto text-[9.5px] font-medium text-[#9aa3b2]">{counts[i]} RDV</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="relative grid grid-cols-[36px_repeat(5,minmax(0,1fr))]" style={{ height: HOURS * H }}>
              <div className="relative">
                {Array.from({ length: HOURS }, (_, i) => (
                  <span key={i} className="num absolute right-2 text-[9.5px] font-medium leading-3 text-[#9aa3b2]" style={{ top: i * H + 3 }}>
                    {hhmm(START + i)}
                  </span>
                ))}
                <span className="num absolute right-1 z-20 -translate-y-1/2 rounded-[4px] bg-rose px-1 py-px text-[8.5px] font-bold leading-3 text-white" style={{ top: y(NOW) }}>
                  {hhmm(NOW)}
                </span>
              </div>

              {DAYS.map((d, i) => (
                <div key={d.label} className="relative border-l border-black/[0.05]" style={GRID_LINES}>
                  <div className="absolute inset-x-0" style={LUNCH} />
                  {i === TODAY ? <div className="absolute inset-x-0 top-0 bg-[rgb(11_18_32/0.018)]" style={{ height: y(NOW) }} /> : null}
                  {EVENTS.filter((e) => e.day === i).map((e) => (
                    <EventCard key={e.company} e={e} order={EVENTS.indexOf(e)} />
                  ))}
                  {MEETINGS.map((mm, j) => (mm.day === i ? <BookedCard key={mm.company} m={mm} state={slot(j)} selected={j === shown} animate={played > 0} /> : null))}
                  {i === TODAY ? (
                    <div className="absolute inset-x-0 z-20" style={{ top: y(NOW) }}>
                      <span className="absolute -left-[4px] -top-[3.5px] size-2 rounded-full bg-rose" />
                      <span data-grow-on-view className="block h-[1.5px] bg-rose" />
                    </div>
                  ) : null}
                </div>
              ))}

              {/* The SDR picks the slot during the call */}
              {phase <= 2 ? (
                <span
                  key={`cursor-${index}`}
                  className={cn("pointer-events-none absolute z-30 transition-[opacity,translate] duration-500", phase === 2 && "translate-x-2 translate-y-2 opacity-0")}
                  style={{ left: `calc(${GUTTER}px + (100% - ${GUTTER}px) * ${(m.day + 0.8) / DAYS.length})`, top: y(m.from) + 37 }}
                >
                  <span className="relative block animate-pop">
                    {phase === 1 ? <span className="absolute -left-1.5 -top-1.5 size-4 animate-ping-soft rounded-full bg-mint/70" /> : null}
                    <MousePointer2
                      size={19}
                      className={cn("relative fill-[#0b0f1a] text-white drop-shadow-[0_4px_8px_rgb(11_15_26/0.35)] transition-transform duration-200", phase === 1 && "scale-90")}
                    />
                  </span>
                </span>
              ) : null}

              {/* Toast */}
              <div
                className={cn(
                  "absolute inset-x-6 bottom-3 z-30 flex items-center gap-2.5 rounded-2xl bg-[#0b0f1a] px-3.5 py-2.5 text-[11.5px] font-medium text-white shadow-[0_18px_40px_-12px_rgb(11_15_26/0.6)] transition-[opacity,translate] duration-500 ease-out-expo",
                  toastOn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                <span className={cn("grid size-5 place-items-center rounded-full text-white", TONE.mint.solid)}>
                  {detected ? <CalendarCheck size={11} strokeWidth={2.6} /> : <Mail size={11} strokeWidth={2.6} />}
                </span>
                {detected ? t(`RDV détecté · ${f.date.toLowerCase()} à ${hhmm(f.from)}`) : t("Client prévenu · fiche RDV jointe")}
                <span className="ml-auto text-white/50">{detected ? t("Cal.com · en attente de validation") : t(`Confirmé par ${MANAGER.name}`)}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-auto flex items-center gap-3 px-1 pt-2.5 text-[10px] font-medium text-[#6b7280]">
              {(["confirme", "attente", "manque", "annule"] as Status[]).map((s) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className={cn("size-2 rounded-[3px]", STATUSES[s].dot)} /> {STATUSES[s].label}
                </span>
              ))}
              <span className="ml-auto flex items-center gap-2.5">
                {Object.values(KINDS).map((k) => (
                  <span key={k.label} className="flex items-center gap-1">
                    <k.Icon size={10} /> {k.label}
                  </span>
                ))}
              </span>
            </div>
          </Panel>

          {/* The meeting and its fiche */}
          <Panel key={`fiche-${shown}`} className={cn("flex min-w-0 flex-col", played > 0 && "animate-slide-in")}>
            <div className="flex items-center gap-3">
              <Avatar initials={f.initials} seed={f.seed} size={42} className="shadow-[0_8px_18px_-8px_rgb(51_85_255/0.6)]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="whitespace-nowrap font-display text-[20px] leading-6">{f.company}</p>
                  <Chip tone={fk.tone}>
                    <fk.Icon size={10} /> {fk.label}
                  </Chip>
                </div>
                <p className="mt-0.5 whitespace-nowrap text-[11px] text-[#6b7280]">
                  {f.contact} · {f.role}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["Date", f.date],
                ["Horaire", range(f.from, f.to)],
                ["Commercial", f.owner],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#f7f8fb] px-2.5 py-2">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{k}</p>
                  <p className="mt-0.5 whitespace-nowrap text-[11.5px] font-semibold">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3.5">
              <p className="flex items-center gap-2 text-[12.5px] font-semibold">
                <FileText size={13} className="text-[#6b7280]" /> Fiche RDV
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-[10px] font-semibold text-violet-ink">
                  <Sparkles size={10} className={cn(drafting && "animate-pulse-dot")} /> {drafting ? t("L'IA rédige…") : t("Rédigée par l'IA")}
                </span>
              </p>
              <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                <AudioLines size={11} /> Transcription · {f.call}
              </span>
            </div>

            <ol className="mt-3.5 space-y-3.5">
              {PARTS.map((part, s) => {
                const written = fp >= 2 + s;
                const typing = fp === 2 + s;
                const lines = f.fiche[s];
                return (
                  <li key={part.title} className="flex gap-2.5">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                        typing ? "bg-violet-soft text-violet-ink" : written ? "bg-mint-soft text-mint-ink" : "bg-[#f1f3f6] text-[#9aa3b2]",
                      )}
                    >
                      <part.Icon size={12} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[11px] font-semibold leading-4", !written && "text-[#9aa3b2]")}>{part.title}</p>
                      {written ? (
                        <div className="mt-0.5 text-[11px] leading-[17px] text-[#4b5563]">
                          {lines.map((line, l) => (
                            <span
                              key={l}
                              className={cn("block w-fit whitespace-nowrap", typing && "animate-type")}
                              style={typing ? { animationDuration: "700ms", animationDelay: `${l * 420}ms` } : undefined}
                            >
                              {t(line)}
                              {typing && l === lines.length - 1 ? <span className="ml-0.5 inline-block h-3 w-px translate-y-0.5 animate-caret bg-violet" /> : null}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-1.5 space-y-1.5">
                          {lines.map((line, l) => (
                            <span
                              key={l}
                              className="block h-2 animate-shimmer rounded-full"
                              style={{
                                width: `${Math.min(92, 30 + line.length * 1.25)}%`,
                                backgroundImage: "linear-gradient(90deg, #eef0f4 0%, #f7f8fb 50%, #eef0f4 100%)",
                                backgroundSize: "200% 100%",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Manager validation */}
            <div className="mt-auto rounded-2xl bg-[#f7f8fb] p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold">Validation manager</p>
                <Chip key={confirmed ? "ok" : "wait"} tone={confirmed ? "mint" : "sun"} className={cn(played > 0 && "animate-pop")}>
                  {confirmed ? <Check size={9} strokeWidth={3} /> : <Clock size={9} strokeWidth={2.6} />}
                  {confirmed ? "Confirmé" : "En attente"}
                </Chip>
              </div>
              <ol className="mt-3 grid grid-cols-3 gap-2">
                <Step
                  on
                  active={!confirmed}
                  tone="sun"
                  icon={<Clock size={11} strokeWidth={2.6} />}
                  label="En attente"
                  sub={`Réservé à ${f.bookedAt}`}
                  line={confirmed ? "on" : "off"}
                />
                <Step
                  on={confirmed}
                  tone="mint"
                  icon={<Check size={11} strokeWidth={3} />}
                  label={confirmed ? "Confirmé" : "Confirmation"}
                  sub={
                    confirmed ? (
                      <>
                        <Avatar initials={MANAGER.initials} seed={MANAGER.seed} size={14} className={cn(played > 0 && "animate-pop")} />
                        {MANAGER.name} · {f.confirmedAt}
                      </>
                    ) : (
                      "par un manager"
                    )
                  }
                  line={notified ? "on" : "off"}
                />
                <Step
                  on={notified}
                  tone="mint"
                  icon={notified ? <MailCheck size={11} strokeWidth={2.6} /> : <Mail size={11} strokeWidth={2.6} />}
                  label={notified ? "Client prévenu" : "Prévenir le client"}
                  sub={notified ? "Fiche RDV jointe" : "après confirmation"}
                />
              </ol>
              <p className="mt-3 border-t border-black/[0.06] pt-2.5 text-[10px] leading-snug text-[#6b7280]">
                {notified ? t(`${f.owner} a reçu le rendez-vous et sa fiche.`) : t("Le client n'est prévenu qu'après la confirmation d'un manager.")}
              </p>
            </div>
          </Panel>
        </div>
      </MockShell>
    </div>
  );
}
