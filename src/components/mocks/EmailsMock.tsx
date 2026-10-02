"use client";

import {
  Archive,
  Bold,
  Braces,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Gauge,
  Hand,
  Inbox,
  Italic,
  Link2,
  List,
  ListOrdered,
  Mail,
  PenLine,
  Plus,
  RefreshCw,
  Reply,
  Send,
  Sparkles,
  Underline,
  Users,
  Workflow,
} from "lucide-react";
import { Fragment, useId, type ReactNode } from "react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { typo } from "@/lib/typo";
import { Avatar, Chip, MockShell, Panel, PanelTitle, TONE, type Tone } from "./kit";

/*
 * S2, the Email Hub sequence editor: the sequences on the left, the selected
 * one as a timeline in the middle, the step's email and its sending rules on
 * the right. Each round two emails go out under the daily cap, then a prospect
 * replies: the sequence stops for that contact and their next steps are
 * cancelled. Verified features only (no A/B, warm-up or mailbox rotation).
 */

type Sequence = { name: string; status: { label: string; tone: Tone }; contacts: number; replies: number; done: number; bar: string };

const SEQUENCES: Sequence[] = [
  { name: "Relance salons 2026", status: { label: "Active", tone: "mint" }, contacts: 428, replies: 57, done: 64, bar: "bg-azure" },
  { name: "DAF Île-de-France", status: { label: "Active", tone: "mint" }, contacts: 260, replies: 18, done: 38, bar: "bg-azure" },
  { name: "Réactivation 2025", status: { label: "En pause", tone: "sun" }, contacts: 140, replies: 9, done: 81, bar: "bg-sun" },
  { name: "Webinar logistique", status: { label: "Brouillon", tone: "gray" }, contacts: 85, replies: 0, done: 0, bar: "bg-[#9aa3b2]" },
];

type Step = { day: string; time: string; title: string; sent: number; replies: number; upcoming: number };

const STEPS: Step[] = [
  { day: "J+0", time: "9 h 00", title: "Premier contact", sent: 310, replies: 40, upcoming: 118 },
  { day: "J+2", time: "9 h 00", title: "Relance douce", sent: 198, replies: 12, upcoming: 73 },
  { day: "J+5", time: "14 h 00", title: "Dernier message", sent: 64, replies: 5, upcoming: 122 },
];

const WAITS = ["Attendre 2 jours ouvrés", "Attendre 3 jours ouvrés"];

type Reply = { initials: string; name: string; short: string; seed: number; step: number; quote: string };

/** One reply per round; `step` is the email it answers, the later ones are cancelled. */
const REPLIES: Reply[] = [
  { initials: "TG", name: "Thomas Girard", short: "Thomas G.", seed: 5, step: 0, quote: "Oui, appelons-nous jeudi." },
  { initials: "LP", name: "Léa Perrin", short: "Léa P.", seed: 4, step: 1, quote: "Envoyez-moi la plaquette." },
  { initials: "NA", name: "Nadia Amrani", short: "Nadia A.", seed: 0, step: 0, quote: "Pas avant janvier, merci." },
];
/** The reply already in the shared inbox when the loop starts. */
const EARLIER: Reply = { initials: "MD", name: "Marc Delorme", short: "Marc D.", seed: 3, step: 0, quote: "Rappelez-moi lundi." };
const SENT_TO = [
  ["Hugo Lefèvre", "Inès Moreau"],
  ["Paul Renaud", "Chloé Martin"],
  ["Yanis Haddad", "Emma Rousseau"],
];

/** `sent: null` is the sequence's own mailbox, which follows the live counter. */
const MAILBOXES: { address: string; provider: string; tone: Tone; sent: number | null }[] = [
  { address: "camille@suzali-conseil.fr", provider: "Gmail", tone: "rose", sent: null },
  { address: "julien@suzali-conseil.fr", provider: "Outlook", tone: "azure", sent: 31 },
  { address: "contact@suzali-conseil.fr", provider: "IMAP", tone: "violet", sent: 12 },
];

const CAP = 80;
/** A round: 0 idle, 1–2 an email goes out, 3 a reply comes in, 4–5 next steps cancelled, 6 toast leaves. */
const PHASES = 7;
const LOOP = PHASES * REPLIES.length;

const t = typo;

/** A merge field, {{prénom}}. */
function Var({ name }: { name: string }) {
  return <span className="rounded-[5px] bg-azure-soft px-[3px] py-px font-semibold text-azure-ink">{`{{${name}}}`}</span>;
}

/** A number that pops each time it changes (`still` when the loop resets the counters). */
function Tick({ value, still, className }: { value: number; still?: boolean; className?: string }) {
  return (
    <span key={value} className={cn("num inline-block", !still && "animate-pop", className)}>
      {value}
    </span>
  );
}

function Toggle() {
  return (
    <span className="relative inline-flex h-4 w-7 shrink-0 rounded-full bg-mint">
      <span className="absolute left-3.5 top-0.5 size-3 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)]" />
    </span>
  );
}

function Kpi({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("shrink-0 rounded-xl bg-[#f7f8fb] px-3 py-2", className)}>
      <p className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{label}</p>
      <div className="mt-0.5 text-[15px] font-semibold leading-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex h-9 items-center gap-2 px-3 text-[11.5px]">
      <span className="w-9 shrink-0 text-[10px] font-medium text-[#9aa3b2]">{label}</span>
      {children}
    </div>
  );
}

function Rule({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex h-8 items-center gap-2 rounded-lg bg-[#f7f8fb] px-2.5 text-[11px]">
      <span className="grid size-5 place-items-center rounded-md bg-white text-azure-ink ring-1 ring-black/[0.06]">{icon}</span>
      <span className="font-medium text-[#374151]">{label}</span>
      <span className="ml-auto font-semibold">{children}</span>
    </div>
  );
}

export function EmailsMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  const uid = useId();
  // Start on the most telling frame (reply in, next steps cancelled), then play.
  const tick = (useTicker(1200, inView) + 4) % LOOP;
  // Tick 0 only comes back when the loop wraps: counters reset without popping.
  const reset = tick === 0;
  const round = Math.floor(tick / PHASES);
  const phase = tick % PHASES;
  const reply = REPLIES[round];
  const before = REPLIES.slice(0, round);
  const sends = round * 2 + Math.min(2, phase);
  const today = 44 + sends;
  const answered = phase >= 3;
  const showToast = answered && phase <= 5;
  const showCancel = phase >= 4 && phase <= 5;
  const replied = round + (answered ? 1 : 0);
  const sentTo = phase === 1 || phase === 2 ? SENT_TO[round][phase - 1] : null;
  const last = answered ? reply : round > 0 ? REPLIES[round - 1] : EARLIER;

  const repliesAt = (i: number) => STEPS[i].replies + before.filter((r) => r.step === i).length + (answered && reply.step === i ? 1 : 0);
  const upcomingAt = (i: number) =>
    i === 0 ? STEPS[0].upcoming - sends : STEPS[i].upcoming - before.filter((r) => r.step < i).length - (phase >= 4 && reply.step < i ? 1 : 0);

  return (
    <div ref={ref}>
      <MockShell
        variant="sdr"
        active="Email"
        crumb="Email Hub"
        page="Séquences"
        user={{ initials: "CR", name: "Camille R.", role: "SDR" }}
        right={
          <span className="flex items-center gap-1.5 rounded-lg bg-[#f6f7f9] px-2 py-1 font-medium text-[#0b1220] ring-1 ring-black/5">
            <RefreshCw size={11} className="text-azure" /> {t("Boîtes synchronisées")}
          </span>
        }
      >
        {/* Explicit line height: the page's 28 px body leading would make every row too tall. */}
        <div className="grid h-full grid-cols-[232px_1fr] gap-3 bg-[#f7f8fb] p-4 leading-[1.4]">
          {/* Sequences, shared inbox and sending mailboxes */}
          <div className="flex min-h-0 flex-col gap-3">
            <Panel className="flex flex-1 flex-col p-3">
              <div className="px-1">
                <PanelTitle
                  icon={<Workflow size={14} />}
                  tone="azure"
                  title="Séquences"
                  sub="Email Hub · 4 séquences"
                  right={
                    <span className="grid size-7 place-items-center rounded-lg bg-accent text-white shadow-[0_6px_14px_-6px_rgb(51_85_255/0.7)]">
                      <Plus size={14} />
                    </span>
                  }
                />
                <div className="mt-3 flex rounded-lg bg-[#f1f3f6] p-0.5 text-[10.5px] font-medium text-[#6b7280]">
                  <span className="flex-1 rounded-md bg-white py-1 text-center text-[#0b1220] shadow-[0_1px_2px_rgb(0_0_0/0.08)]">Toutes 4</span>
                  <span className="flex-1 py-1 text-center">Actives 2</span>
                  <span className="flex-1 py-1 text-center">Brouillon 1</span>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5">
                {SEQUENCES.map((s, i) => {
                  const on = i === 0;
                  const replies = on ? s.replies + replied : s.replies;
                  return (
                    <li key={s.name} className={cn("relative rounded-xl px-2.5 py-2", on ? "bg-accent-tint ring-1 ring-accent/20" : "bg-white")}>
                      {on ? <span className="absolute -left-0.5 top-2 h-[calc(100%-16px)] w-[3px] rounded-full bg-accent" /> : null}
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold">{s.name}</span>
                        <Chip tone={s.status.tone}>{s.status.label}</Chip>
                      </span>
                      <span className="mt-1 flex items-center justify-between text-[10px] text-[#6b7280]">
                        <span className="flex items-center gap-1">
                          <Users size={10} /> {s.contacts} contacts
                        </span>
                        {replies ? (
                          <span className="flex items-center gap-1 font-semibold text-mint-ink">
                            <Reply size={10} strokeWidth={2.5} /> <Tick still={reset} value={replies} /> réponses
                          </span>
                        ) : (
                          <span>Non lancée</span>
                        )}
                      </span>
                      <span className="mt-2 block h-1 overflow-hidden rounded-full bg-black/[0.05]">
                        <span data-grow-on-view className={cn("block h-1 rounded-full", s.bar)} style={{ width: `${s.done}%`, ...vars({ "--delay": `${200 + i * 120}ms` }) }} />
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-auto flex items-center gap-2 border-t border-black/[0.05] px-1 pt-2.5 text-[10.5px] font-medium text-[#6b7280]">
                <Archive size={12} /> {t("Séquences archivées")}
                <span className="num ml-auto rounded-full bg-[#f1f3f6] px-1.5 text-[10px] font-semibold text-[#5b6475]">6</span>
              </p>
            </Panel>

            <Panel className="p-3">
              <div className="px-1">
                <PanelTitle
                  icon={<Inbox size={14} />}
                  tone="violet"
                  title={t("Boîte partagée")}
                  sub="Réponses de vos 3 boîtes"
                  right={
                    <span key={6 + replied} className={cn("grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white", !reset && "animate-pop")}>
                      {6 + replied}
                    </span>
                  }
                />
              </div>
              <div key={last.name} className={cn("mt-2.5 flex items-center gap-2 rounded-xl bg-violet-soft px-2.5 py-2 ring-1 ring-violet/15", !reset && "animate-slide-in")}>
                <Avatar initials={last.initials} seed={last.seed} size={26} />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[11px] font-semibold">{last.name}</span>
                    <span className="shrink-0 text-[9px] font-medium text-[#8a93a3]">{t(answered ? "à l'instant" : round > 0 ? "il y a 1 min" : "il y a 12 min")}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-[#5b6475]">{t(`« ${last.quote} »`)}</span>
                </span>
              </div>
              <p className="mb-1 mt-3 flex items-center justify-between px-1 text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">
                {t("Boîtes d'envoi")}
                <span className="normal-case tracking-normal">3 connectées</span>
              </p>
              <ul className="space-y-0.5">
                {MAILBOXES.map((m) => (
                  <li key={m.address} className="flex items-center gap-2 rounded-lg px-1 py-1">
                    <span className={cn("grid size-6 shrink-0 place-items-center rounded-md", TONE[m.tone].soft, TONE[m.tone].text)}>
                      <Mail size={12} />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[11px] font-semibold">{m.address}</span>
                      <span className="block text-[9.5px] text-[#6b7280]">
                        {m.provider} · <span className="num">{m.sent ?? today}</span> / {CAP} {t("aujourd'hui")}
                      </span>
                    </span>
                    <span className="size-1.5 shrink-0 rounded-full bg-mint" />
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="flex min-h-0 min-w-0 flex-col gap-3">
            {/* Sequence header */}
            <Panel className="flex items-center gap-3 py-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-azure text-white shadow-[0_8px_18px_-8px_rgb(31_147_255/0.7)]">
                <Send size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2">
                  <span className="font-display text-[22px] leading-7">Relance salons 2026</span>
                  <Chip tone="mint">
                    <span className="size-1.5 animate-pulse-dot rounded-full bg-mint" /> Active
                  </Chip>
                </p>
                <p className="mt-0.5 truncate text-[10.5px] text-[#6b7280]">{t("Mission Salons B2B 2026 · lancée le 15 septembre par Camille R.")}</p>
              </div>
              <Kpi label="Contacts">
                <span className="num">428</span>
              </Kpi>
              <Kpi label="Réponses">
                <Tick still={reset} value={57 + replied} className="text-mint-ink" />
              </Kpi>
              <Kpi label={t("Envoyés aujourd'hui")} className="w-[132px]">
                <span className="flex items-baseline gap-1">
                  <Tick still={reset} value={today} />
                  <span className="text-[10.5px] font-medium text-[#9aa3b2]">/ {CAP}</span>
                </span>
                <span className="mt-1 block h-1 overflow-hidden rounded-full bg-black/[0.06]">
                  <span data-grow-on-view className="block h-1" style={vars({ "--delay": "300ms" })}>
                    <span className="block h-1 rounded-full bg-azure transition-[width] duration-700 ease-out-expo" style={{ width: `${(today / CAP) * 100}%` }} />
                  </span>
                </span>
              </Kpi>
            </Panel>

            <div className="grid min-h-0 flex-1 grid-cols-[1fr_372px] gap-3">
              {/* Timeline of the steps */}
              <div className="relative min-h-0 min-w-0">
                <Panel className="flex h-full flex-col">
                  <PanelTitle icon={<ListOrdered size={14} />} tone="azure" title={t("Étapes de la séquence")} sub={t("3 emails · 5 jours ouvrés")} right={<Chip tone="azure">J+0 → J+5</Chip>} />
                  <div className="relative mt-3">
                    <div aria-hidden className="absolute bottom-[14px] left-[13px] top-[22px] w-0.5">
                      <svg className="block size-full overflow-visible" viewBox="0 0 2 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`${uid}-thread`} x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="#3355ff" />
                            <stop offset="0.5" stopColor="#1f93ff" />
                            <stop offset="1" stopColor="#1f93ff" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                        <path data-draw-on-view pathLength={1} d="M1 0 V100" fill="none" stroke={`url(#${uid}-thread)`} strokeWidth={2} />
                      </svg>
                    </div>
                    <ol className="space-y-1.5">
                      {STEPS.map((s, i) => {
                        const on = i === 0;
                        const hit = i > reply.step;
                        return (
                          <Fragment key={s.title}>
                            {i > 0 ? (
                              <li data-appear-on-view className="flex items-center gap-2.5 py-0.5" style={vars({ "--delay": `${i * 320 - 160}ms` })}>
                                <span className="relative z-10 ml-1 grid size-5 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-[#8a93a3] ring-[3px] ring-white">
                                  <Clock size={10} />
                                </span>
                                <span className="text-[10.5px] font-medium text-[#5b6475]">{t(WAITS[i - 1])}</span>
                              </li>
                            ) : null}
                            <li data-appear-on-view className="flex gap-2.5" style={vars({ "--delay": `${i * 320}ms` })}>
                              <span
                                className={cn(
                                  "relative z-10 mt-2 grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold ring-4 ring-white",
                                  on ? "bg-accent text-white" : "bg-azure-soft text-azure-ink",
                                )}
                              >
                                {i + 1}
                              </span>
                              <div
                                className={cn(
                                  "min-w-0 flex-1 rounded-xl px-3 py-2 ring-1",
                                  on ? "bg-accent-tint shadow-[0_10px_22px_-16px_rgb(51_85_255/0.6)] ring-accent/25" : "bg-white ring-black/[0.07]",
                                )}
                              >
                                <p className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wide text-[#9aa3b2]">
                                  <Mail size={11} className={on ? "text-accent" : "text-azure"} /> Email · {s.day}
                                  <span className="ml-auto flex items-center gap-1 font-medium normal-case tracking-normal text-[#5b6475]">
                                    <Clock size={10} /> {t(s.time)}
                                  </span>
                                </p>
                                <p className="mt-0.5 text-[12.5px] font-semibold">{s.title}</p>
                                <p className="mt-0.5 text-[10.5px] text-[#6b7280]">
                                  <span className="num font-semibold text-[#0b1220]">{s.sent + (on ? sends : 0)}</span> envoyés ·{" "}
                                  <Tick still={reset} value={repliesAt(i)} className="font-semibold text-mint-ink" /> réponses
                                </p>
                                <div className="mt-1.5 flex h-6 items-center justify-between gap-2 border-t border-black/[0.06] pt-1.5">
                                  {on ? (
                                    <span className="flex items-center gap-1.5 text-[10px] font-semibold text-azure-ink">
                                      <span className="relative flex size-1.5">
                                        <span className="absolute inset-0 animate-ping-soft rounded-full bg-azure" />
                                        <span className="relative size-1.5 rounded-full bg-azure" />
                                      </span>
                                      Envoi en cours
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                                      <Users size={11} /> <Tick still={reset} value={upcomingAt(i)} className="font-semibold text-[#0b1220]" /> à venir
                                    </span>
                                  )}
                                  {on ? (
                                    <span className="text-[10px] text-[#6b7280]">
                                      <Tick still={reset} value={upcomingAt(0)} className="font-semibold text-[#0b1220]" /> à venir
                                    </span>
                                  ) : hit ? (
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 rounded-full bg-rose-soft py-0.5 pl-0.5 pr-2 text-[10px] font-semibold text-rose-ink transition-[opacity,translate,scale] duration-500 ease-spring",
                                        showCancel ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-90 opacity-0",
                                      )}
                                      style={{ transitionDelay: showCancel ? `${(i - reply.step - 1) * 180}ms` : "0ms" }}
                                    >
                                      <Avatar initials={reply.initials} seed={reply.seed} size={16} />
                                      {reply.short} · annulé
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          </Fragment>
                        );
                      })}
                      <li data-appear-on-view className="flex items-center gap-2.5" style={vars({ "--delay": "800ms" })}>
                        <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-[#c3cad6] bg-white text-[#8a93a3] ring-4 ring-white">
                          <Plus size={13} />
                        </span>
                        <span className="flex h-7 flex-1 items-center rounded-xl border border-dashed border-[#d4d8df] px-3 text-[10.5px] font-medium text-[#6b7280]">
                          {t("Ajouter une étape · email ou délai")}
                        </span>
                      </li>
                    </ol>
                  </div>
                  <div
                    className={cn(
                      "mt-3 flex items-center gap-2.5 rounded-xl bg-mint-soft px-3 py-2 ring-1 transition-[box-shadow] duration-500",
                      showToast ? "shadow-[0_0_0_4px_rgb(16_185_129/0.14)] ring-mint/50" : "ring-mint/15",
                    )}
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white text-mint-ink">
                      <Hand size={14} />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block text-[11px] font-semibold text-mint-ink">{t("Arrêt à la réponse")}</span>
                      <span className="mt-0.5 block text-[10px] text-mint-ink/80">{t("La séquence s'arrête dès qu'un contact répond.")}</span>
                    </span>
                    <Toggle />
                  </div>
                  {/* Sending activity; the reply toast covers it */}
                  <div
                    className={cn(
                      "mt-auto flex h-9 items-center gap-2 rounded-xl px-3 text-[10.5px] text-[#5b6475] ring-1 ring-black/[0.06] transition-opacity duration-300",
                      showToast ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {sentTo ? (
                      <span key={sentTo} className="flex min-w-0 animate-pop items-center gap-1.5 font-semibold text-azure-ink">
                        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-azure text-white">
                          <Check size={9} strokeWidth={3} />
                        </span>
                        <span className="truncate">{t(`Envoyé à ${sentTo}`)}</span>
                      </span>
                    ) : (
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="size-1.5 shrink-0 animate-pulse-dot rounded-full bg-mint" />
                        <span className="truncate">{t("Envoi actif jusqu'à 18 h")}</span>
                      </span>
                    )}
                    <span className="ml-auto shrink-0">
                      <Tick still={reset} value={CAP - today} className="font-semibold text-[#0b1220]" /> envois restants
                    </span>
                  </div>
                </Panel>

                {/* Reply toast */}
                <div
                  className={cn(
                    "absolute inset-x-3 bottom-3 z-20 flex items-center gap-2.5 rounded-2xl bg-[#0b0f1a] px-3 py-2.5 text-white shadow-[0_18px_40px_-12px_rgb(11_15_26/0.6)] transition-[opacity,translate] duration-500 ease-out-expo",
                    showToast ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                >
                  <span className="relative shrink-0">
                    <Avatar initials={reply.initials} seed={reply.seed} size={28} />
                    <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-mint text-white ring-2 ring-[#0b0f1a]">
                      <Reply size={9} strokeWidth={3} />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[11.5px] font-semibold">Réponse de {reply.name}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-white/55">{t("Séquence arrêtée pour ce contact")}</span>
                  </span>
                  <span className="shrink-0 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold">Voir le fil</span>
                </div>
              </div>

              {/* The step's email and sending rules */}
              <Panel className="flex min-h-0 flex-col">
                <PanelTitle
                  icon={<PenLine size={14} />}
                  tone="accent"
                  title={t("Étape 1 · Premier contact")}
                  sub={t("Email · J+0 · 9 h 00")}
                  right={
                    <span className="flex rounded-lg bg-[#f1f3f6] p-0.5 text-[10px] font-medium text-[#6b7280]">
                      <span className="rounded-md bg-white px-2 py-0.5 text-[#0b1220] shadow-[0_1px_2px_rgb(0_0_0/0.08)]">Modèle</span>
                      <span className="px-2 py-0.5">Aperçu</span>
                    </span>
                  }
                />
                <div className="mt-3 divide-y divide-black/[0.06] rounded-xl ring-1 ring-black/[0.08]">
                  <Field label="De">
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-rose-soft text-rose-ink">
                      <Mail size={11} />
                    </span>
                    <span className="min-w-0 truncate font-semibold">camille@suzali-conseil.fr</span>
                    <span className="shrink-0 rounded-full bg-rose-soft px-1.5 py-px text-[9px] font-semibold text-rose-ink">Gmail</span>
                    <ChevronDown size={12} className="ml-auto shrink-0 text-[#9aa3b2]" />
                  </Field>
                  <Field label="À">
                    <Users size={12} className="shrink-0 text-[#9aa3b2]" />
                    <span className="min-w-0 truncate">{t("Liste « Salons B2B 2026 »")}</span>
                    <span className="ml-auto shrink-0 text-[10px] text-[#6b7280]">428 contacts</span>
                  </Field>
                  <Field label="Objet">
                    <span className="min-w-0 flex-1 truncate font-semibold">
                      <Var name="prénom" />
                      {t(", une idée pour ")}
                      <Var name="entreprise" />
                      <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-[#0b1220]" />
                    </span>
                  </Field>
                </div>

                <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-xl ring-1 ring-black/[0.08]">
                  <div className="flex items-center gap-0.5 border-b border-black/[0.06] px-2 py-1.5 text-[#5b6475]">
                    {[
                      { k: "b", icon: <Bold size={12} /> },
                      { k: "i", icon: <Italic size={12} /> },
                      { k: "u", icon: <Underline size={12} /> },
                      { k: "link", icon: <Link2 size={12} /> },
                      { k: "list", icon: <List size={12} /> },
                    ].map((b) => (
                      <span key={b.k} className="grid size-6 place-items-center rounded-md">
                        {b.icon}
                      </span>
                    ))}
                    <span className="ml-auto flex items-center gap-1 rounded-md bg-azure-soft px-1.5 py-0.5 text-[10px] font-semibold text-azure-ink">
                      <Braces size={11} /> Variable
                    </span>
                    <span className="ml-1 flex items-center gap-1 rounded-md bg-violet-soft px-1.5 py-0.5 text-[10px] font-semibold text-violet-ink">
                      <Sparkles size={11} /> IA
                    </span>
                  </div>
                  <div className="space-y-2 px-3 py-2.5 text-[11.5px] leading-[1.6] text-[#374151]">
                    <p>
                      {t("Bonjour ")}
                      <Var name="prénom" />,
                    </p>
                    <p>
                      {t("Merci pour notre échange sur le stand la semaine dernière. Vous évoquiez vos relances clients chez ")}
                      <Var name="entreprise" />
                      {t(" : je vous propose 20 minutes pour vous montrer notre méthode.")}
                    </p>
                    <p>{t("Mardi ou jeudi, qu'est-ce qui vous arrange ?")}</p>
                    <p className="text-[#6b7280]">Camille Roussel · Suzali Conseil</p>
                  </div>
                </div>

                <p className="mt-3 px-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{t("Règles d'envoi")}</p>
                <div className="mt-1.5 space-y-1.5">
                  <Rule icon={<Clock size={11} />} label="Horaires">
                    {t("Lun.–ven. · 9 h–18 h")}
                  </Rule>
                  <Rule icon={<CalendarCheck size={11} />} label={t("Jours ouvrés uniquement")}>
                    <Toggle />
                  </Rule>
                  <Rule icon={<Gauge size={11} />} label="Plafond">
                    {t("80 / jour / boîte")}
                  </Rule>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="flex h-8 items-center gap-1.5 rounded-xl px-3 text-[11px] font-medium ring-1 ring-black/10">
                    <Send size={12} /> Envoyer un test
                  </span>
                  <span className="ml-auto flex h-8 items-center rounded-xl bg-accent px-4 text-[11.5px] font-semibold text-white shadow-[0_8px_18px_-8px_rgb(51_85_255/0.7)]">
                    Enregistrer
                  </span>
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </MockShell>
    </div>
  );
}
