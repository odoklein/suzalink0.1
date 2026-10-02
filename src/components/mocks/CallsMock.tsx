"use client";

import { Check, CornerDownLeft, PhoneCall, PhoneOff, Sparkles, Timer } from "lucide-react";
import { useInView } from "../fx/InView";
import { useTicker } from "../fx/useTicker";
import { cn } from "@/lib/cn";
import { typo } from "@/lib/typo";
import { Avatar, Chip, MockKey, MockShell, Panel, PanelTitle, TONE, type Tone } from "./kit";

/*
 * S1, the calling workspace: the queue on the left, the contact and its
 * script in the middle, outcomes on the keyboard on the right. Every ~6 s an
 * outcome is keyed in and the next contact arrives.
 */

const OUTCOMES: { key: string; label: string; tone: Tone }[] = [
  { key: "1", label: "RDV décroché", tone: "mint" },
  { key: "2", label: "Rappel", tone: "sun" },
  { key: "3", label: "À suivre", tone: "azure" },
  { key: "4", label: "Pas intéressé", tone: "gray" },
  { key: "5", label: "NRP", tone: "gray" },
  { key: "6", label: "Barrage", tone: "gray" },
  { key: "7", label: "Messagerie", tone: "violet" },
  { key: "8", label: "Faux numéro", tone: "rose" },
  { key: "9", label: "Refus argumenté", tone: "coral" },
];

type Contact = {
  initials: string;
  name: string;
  role: string;
  company: string;
  city: string;
  size: string;
  source: string;
  last: string;
  status: { label: string; tone: Tone };
  outcome: number;
  note: string;
  detected?: string;
  toast: string;
};

const CONTACTS: Contact[] = [
  {
    initials: "CV",
    name: "Claire Vasseur",
    role: "Directrice des achats",
    company: "Transports Lemaire",
    city: "Lyon",
    size: "120 salariés",
    source: "Apollo",
    last: "il y a 3 j",
    status: { label: "RDV manqué", tone: "rose" },
    outcome: 0,
    note: "Démo jeudi 10 h avec Claire et sa DAF.",
    toast: "RDV décroché · fiche RDV créée",
  },
  {
    initials: "JM",
    name: "Julien Marchetti",
    role: "Responsable logistique",
    company: "Groupe Arnaud",
    city: "Lille",
    size: "340 salariés",
    source: "CSV salon",
    last: "il y a 8 j",
    status: { label: "Rappel 14:00", tone: "sun" },
    outcome: 1,
    note: "Intéressé mais en salon, rappeler jeudi 14 h.",
    detected: "Rappel détecté · jeu. 14:00",
    toast: "Rappel planifié · jeudi 14:00",
  },
  {
    initials: "SB",
    name: "Sophie Benali",
    role: "Directrice générale",
    company: "Atelier Norme",
    city: "Nantes",
    size: "45 salariés",
    source: "Apollo",
    last: "jamais",
    status: { label: "Nouveau", tone: "gray" },
    outcome: 2,
    note: "Envoyer la plaquette, relancer la semaine prochaine.",
    toast: "À suivre · relance dans 7 jours",
  },
  {
    initials: "MD",
    name: "Marc Delorme",
    role: "Directeur commercial",
    company: "Delorme & Fils",
    city: "Bordeaux",
    size: "80 salariés",
    source: "HubSpot",
    last: "il y a 2 j",
    status: { label: "À suivre", tone: "azure" },
    outcome: 0,
    note: "RDV mardi 9 h 30 au siège, avec le DG.",
    toast: "RDV décroché · fiche RDV créée",
  },
];

const QUEUE_TAIL = [
  { initials: "LP", name: "Léa Perrin", company: "Breizh Emballage", status: { label: "Nouveau", tone: "gray" as Tone } },
  { initials: "TG", name: "Thomas Girard", company: "Girard Industrie", status: { label: "Nouveau", tone: "gray" as Tone } },
  { initials: "NA", name: "Nadia Amrani", company: "Cofisud", status: { label: "À réessayer", tone: "violet" as Tone } },
];

const TIMERS = ["", "00:12", "01:05", "01:48", "02:10", "02:10"];
const STEPS = 6;

const t = typo;

export function CallsMock() {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -10% 0px" });
  // Start on the most telling frame (outcome keyed in), then play.
  const tick = useTicker(1150, inView) + 4;
  const phase = tick % STEPS;
  const index = Math.floor(tick / STEPS) % CONTACTS.length;
  const c = CONTACTS[index];
  const outcome = OUTCOMES[c.outcome];
  const keyed = phase >= 4;
  const calling = phase >= 1 && phase <= 3;
  const rdv = 2 + CONTACTS.filter((q, i) => q.outcome === 0 && (i < index || (i === index && keyed))).length;

  return (
    <div ref={ref}>
      <MockShell
        variant="sdr"
        active="Espace d'appel"
        crumb="SDR"
        page="Espace d'appel"
        user={{ initials: "CR", name: "Camille R.", role: "SDR" }}
        right={
          <span className="flex items-center gap-1.5 rounded-lg bg-[#f6f7f9] px-2 py-1 font-medium text-[#0b1220] ring-1 ring-black/5">
            <Timer size={11} className="text-accent" /> Session 01:42
          </span>
        }
      >
        <div className="grid h-full grid-cols-[264px_1fr_252px] gap-3 bg-[#f7f8fb] p-4">
          {/* Queue */}
          <Panel className="flex flex-col p-3">
            <div className="px-1">
              <PanelTitle icon={<PhoneCall size={14} />} tone="coral" title="File d'appels" sub="Mission · Logistique IDF" right={<Chip tone="coral">48</Chip>} />
              <div className="mt-3 flex rounded-lg bg-[#f1f3f6] p-0.5 text-[10.5px] font-medium text-[#6b7280]">
                <span className="flex-1 rounded-md bg-white py-1 text-center text-[#0b1220] shadow-[0_1px_2px_rgb(0_0_0/0.08)]">Tous 48</span>
                <span className="flex-1 py-1 text-center">Rappels 6</span>
                <span className="flex-1 py-1 text-center">Nouveaux 31</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5">
              {CONTACTS.map((q, i) => {
                const active = i === index;
                const done = i < index || (active && keyed);
                const o = OUTCOMES[q.outcome];
                return (
                  <li
                    key={q.name}
                    className={cn(
                      "relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors duration-500",
                      active ? "bg-accent-tint ring-1 ring-accent/20" : "bg-white",
                    )}
                  >
                    {active ? <span className="absolute -left-0.5 top-2 h-[calc(100%-16px)] w-[3px] rounded-full bg-accent" /> : null}
                    <Avatar initials={q.initials} seed={i} size={30} className={cn(done && !active && "opacity-50")} />
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-[12px] font-semibold", done && !active && "text-[#9aa3b2] line-through decoration-[#c9ced8]")}>{q.name}</span>
                      <span className="block truncate text-[10px] text-[#6b7280]">{q.company}</span>
                    </span>
                    {done ? (
                      <Chip tone={o.tone} className="animate-pop">
                        <Check size={9} strokeWidth={3} /> {o.label}
                      </Chip>
                    ) : (
                      <Chip tone={q.status.tone}>{q.status.label}</Chip>
                    )}
                  </li>
                );
              })}
              {QUEUE_TAIL.map((q, i) => (
                <li key={q.name} className="flex items-center gap-2.5 rounded-xl bg-white px-2.5 py-2">
                  <Avatar initials={q.initials} seed={i + 4} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold">{q.name}</span>
                    <span className="block truncate text-[10px] text-[#6b7280]">{q.company}</span>
                  </span>
                  <Chip tone={q.status.tone}>{q.status.label}</Chip>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Contact, script and note */}
          <div className="relative flex min-w-0 flex-col gap-3">
            <Panel key={`card-${index}`} className="animate-slide-in">
              <div className="flex items-start gap-3">
                <Avatar initials={c.initials} seed={index} size={48} className="shadow-[0_8px_18px_-8px_rgb(51_85_255/0.6)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[23px] leading-7">{c.name}</p>
                  <p className="text-[11px] text-[#6b7280]">
                    {c.role} · <span className="font-semibold text-[#0b1220]">{c.company}</span>
                  </p>
                </div>
                {calling ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-rose-soft px-2.5 py-1 text-[10.5px] font-semibold text-rose-ink">
                    <span className="size-1.5 animate-pulse-dot rounded-full bg-rose" /> En appel {TIMERS[phase]}
                  </span>
                ) : keyed ? (
                  <span className="rounded-full bg-[#f1f3f6] px-2.5 py-1 text-[10.5px] font-semibold text-[#5b6475]">Terminé · {TIMERS[4]}</span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full bg-accent-tint px-2.5 py-1 text-[10.5px] font-semibold text-accent">
                    <PhoneCall size={11} className="animate-pulse-dot" /> {t("Appel en cours…")}
                  </span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  ["Ville", c.city],
                  ["Effectif", c.size],
                  ["Source", c.source],
                  ["Dernier appel", c.last],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-[#f7f8fb] px-2.5 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{k}</p>
                    <p className="mt-0.5 truncate text-[11.5px] font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={cn("flex h-8 flex-1 items-center justify-center gap-2 rounded-xl text-[11.5px] font-semibold", calling ? "bg-rose text-white" : "bg-mint text-white")}>
                  {calling ? <PhoneOff size={13} /> : <PhoneCall size={13} />}
                  {calling ? "Raccrocher" : "Appeler +33 6 •• •• 42 18"}
                </span>
                <span className="flex h-8 items-center rounded-xl px-3 text-[11px] font-medium ring-1 ring-black/10">Email</span>
                <span className="flex h-8 items-center rounded-xl px-3 text-[11px] font-medium ring-1 ring-black/10">LinkedIn</span>
              </div>
            </Panel>

            <Panel className="flex-1">
              <div className="flex gap-1.5 text-[10.5px] font-semibold">
                {["Accroche", "Découverte", "Objections", "Conclusion"].map((tab, i) => (
                  <span key={tab} className={cn("rounded-full px-2.5 py-1", i === Math.min(2, Math.max(0, phase - 1)) ? "bg-[#0b0f1a] text-white" : "text-[#6b7280] ring-1 ring-black/10")}>
                    {tab}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[12.5px] leading-[1.65] text-[#374151]">
                {t("Bonjour ")}
                <span className="rounded bg-accent-tint px-[3px] font-semibold text-accent">{c.name.split(" ")[0]}</span>
                {t(", ici Camille de Suzali Conseil. Je vous appelle parce que vous gérez la prospection chez ")}
                <span className="rounded bg-accent-tint px-[3px] font-semibold text-accent">{c.company}</span>
                {t(". En deux minutes, je vous montre comment nos clients décrochent deux fois plus de rendez-vous ?")}
              </p>
              <div className="mt-3 rounded-xl bg-sun-soft px-3 py-2 text-[11px] leading-snug text-sun-ink">
                <b>{t("Objection fréquente :")}</b> {t("« On a déjà un prestataire. » Demandez ce qui manque aujourd'hui.")}
              </div>
              <div className="mt-3 rounded-xl px-3 py-2.5 ring-1 ring-black/10">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-[#9aa3b2]">{t("Note d'appel")}</p>
                <p className="mt-1 min-h-[18px] text-[12px] font-medium">
                  {phase >= 3 ? (
                    <span key={`note-${index}`} className="inline-block animate-type">
                      {t(c.note)}
                    </span>
                  ) : (
                    <span className="inline-block h-3.5 w-px translate-y-0.5 animate-caret bg-[#0b1220]" />
                  )}
                </p>
                {c.detected && phase >= 3 ? (
                  <span className="mt-2 inline-flex animate-pop items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-[10px] font-semibold text-violet-ink [animation-delay:700ms]">
                    <Sparkles size={10} /> {c.detected}
                  </span>
                ) : null}
              </div>
            </Panel>

            {/* Toast */}
            <div
              className={cn(
                "absolute inset-x-6 bottom-4 flex items-center gap-2.5 rounded-2xl bg-[#0b0f1a] px-3.5 py-2.5 text-[11.5px] font-medium text-white shadow-[0_18px_40px_-12px_rgb(11_15_26/0.6)] transition-[opacity,translate] duration-500 ease-out-expo",
                keyed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <span className={cn("grid size-5 place-items-center rounded-full text-white", TONE[outcome.tone].solid)}>
                <Check size={12} strokeWidth={3} />
              </span>
              {t(c.toast)}
              <span className="ml-auto text-white/50">{t("Contact suivant →")}</span>
            </div>
          </div>

          {/* Outcomes */}
          <div className="flex flex-col gap-3">
            <Panel>
              <PanelTitle icon={<CornerDownLeft size={14} />} tone="accent" title={t("Issue de l'appel")} sub="Touches 1 à 9, puis Entrée" />
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {OUTCOMES.map((o, i) => {
                  const on = keyed && i === c.outcome;
                  return (
                    <div
                      key={o.key}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-center ring-1 transition-colors duration-300",
                        on ? cn(TONE[o.tone].soft, TONE[o.tone].ring) : "bg-white ring-black/[0.06]",
                      )}
                    >
                      <MockKey down={on} tone={o.tone}>
                        {o.key}
                      </MockKey>
                      <span className={cn("text-[9.5px] font-semibold leading-tight", on ? TONE[o.tone].text : "text-[#5b6475]")}>{o.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#0b0f1a] px-3 py-2 text-[10.5px] font-semibold text-white">
                <span>Valider · contact suivant</span>
                <span className={cn("rounded-md bg-white/10 px-1.5 py-0.5 transition-colors", phase === 5 && "bg-accent")}>Entrée ↵</span>
              </div>
            </Panel>
            <Panel className="flex-1">
              <p className="text-[12px] font-semibold">{t("Aujourd'hui")}</p>
              <div className="mt-3 space-y-3">
                {[
                  { label: "Appels passés", value: 64 + index + (keyed ? 1 : 0), max: 80, tone: "coral" as Tone },
                  { label: "Décrochés", value: 21 + index + (keyed ? 1 : 0), max: 40, tone: "azure" as Tone },
                  { label: "RDV décrochés", value: rdv, max: 5, tone: "mint" as Tone },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="flex items-baseline justify-between text-[10.5px] text-[#6b7280]">
                      {s.label}
                      <span className="num text-[13px] font-semibold text-[#0b1220]">{s.value}</span>
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-[#f1f3f6]">
                      <div className={cn("h-1.5 rounded-full transition-[width] duration-700 ease-out-expo", TONE[s.tone].solid)} style={{ width: `${Math.min(100, (s.value / s.max) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-mint-soft px-3 py-2 text-[10.5px] font-medium leading-snug text-mint-ink">
                {t("Objectif du jour : 5 RDV. La file passe les rappels en premier.")}
              </p>
            </Panel>
          </div>
        </div>
      </MockShell>
    </div>
  );
}
