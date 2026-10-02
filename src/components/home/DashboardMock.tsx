import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock,
  Database,
  Flame,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { vars } from "@/lib/style";

/** Design size, scaled to fit by <FitBox>. */
export const DASHBOARD_W = 1200;
export const DASHBOARD_H = 740;

const NAV: Array<{ group?: string; items: Array<{ label: string; icon: ReactNode; active?: boolean; chev?: boolean; badge?: string }> }> = [
  { items: [{ label: "Messagerie", icon: <MessageSquare size={15} /> }, { label: "Email", icon: <Mail size={15} />, chev: true }] },
  {
    group: "Pilotage commercial",
    items: [
      { label: "Cockpit", icon: <Activity size={15} />, active: true, badge: "1 RDV" },
      { label: "Clients", icon: <Building2 size={15} /> },
      { label: "Missions", icon: <Target size={15} /> },
      { label: "Listes", icon: <Database size={15} /> },
      { label: "Performance", icon: <BarChart3 size={15} />, chev: true },
    ],
  },
  {
    group: "Opérations SDR",
    items: [
      { label: "Planning équipe", icon: <CalendarDays size={15} /> },
      { label: "Collaborateurs", icon: <Users size={15} />, chev: true },
      { label: "Rendez-vous", icon: <CalendarDays size={15} /> },
    ],
  },
];

function Kpi({
  dark,
  tint,
  icon,
  tag,
  label,
  value,
  unit,
  bar,
  barClass,
  foot,
  footRight,
  delay = 0,
}: {
  dark?: boolean;
  tint: string;
  icon: ReactNode;
  tag: string;
  label: string;
  value: string;
  unit: string;
  bar: number;
  barClass: string;
  foot: string;
  footRight?: string;
  delay?: number;
}) {
  return (
    <div
      className={`rounded-[18px] p-4 ring-1 ${dark ? "bg-gradient-to-br from-[#0d1530] to-[#0a1024] text-white ring-white/10" : `${tint} text-[#0b1220] ring-black/5`}`}
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-9 place-items-center rounded-xl ${dark ? "bg-white/10" : "bg-white/70"}`}>{icon}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${dark ? "bg-white/10 text-white/90" : "bg-white/70"}`}>{tag}</span>
      </div>
      <p className={`mt-3 text-[10.5px] font-semibold uppercase tracking-wide ${dark ? "text-white/60" : "opacity-60"}`}>{label}</p>
      <p className="mt-0.5 flex items-baseline gap-1.5">
        <span className="font-display text-[34px] leading-none">{value}</span>
        <span className={`text-[11px] ${dark ? "text-white/50" : "opacity-60"}`}>{unit}</span>
      </p>
      <div className={`mt-3 h-1 rounded-full ${dark ? "bg-white/10" : "bg-black/5"}`}>
        <div data-grow-on-view className={`h-1 rounded-full ${barClass}`} style={{ width: `${bar}%`, ...vars({ "--delay": `${delay}ms` }) }} />
      </div>
      <p className={`mt-2 flex justify-between text-[10px] font-medium ${dark ? "text-white/70" : "opacity-70"}`}>
        <span>{foot}</span>
        {footRight ? <span>{footRight}</span> : <ArrowUpRight size={11} />}
      </p>
    </div>
  );
}

function Priority({ icon, tone, title, chip, chipTone, sub, n, delay = 0 }: { icon: ReactNode; tone: string; title: string; chip: string; chipTone: string; sub: string; n: number; delay?: number }) {
  return (
    <div data-appear-on-view className="flex items-center gap-3 rounded-2xl bg-[#f7f8fb] px-3 py-3 ring-1 ring-black/5" style={vars({ "--delay": `${delay}ms` })}>
      <span className={`grid size-9 place-items-center rounded-xl ${tone}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[12px] font-semibold">
          {title}
          <span className={`rounded px-1.5 py-px text-[9px] font-semibold ${chipTone}`}>{chip}</span>
        </p>
        <p className="text-[10.5px] text-[#6b7280]">{sub}</p>
      </div>
      <span className="text-[18px] font-semibold">{n}</span>
      <ChevronRight size={14} className="text-[#9ca3af]" />
    </div>
  );
}

/**
 * Coded stand-in for the white-label Suzalink manager dashboard (invented demo data).
 * Flat and front-on: tilt and scale come from <ScrollReveal>, never from the artwork.
 */
export function DashboardMock() {
  return (
    <div aria-hidden className="flex overflow-hidden bg-white font-sans text-[#0b1220]" style={{ width: DASHBOARD_W, height: DASHBOARD_H }}>
      <aside className="flex w-[190px] shrink-0 flex-col bg-[#0b0f1a] px-3 py-4 text-white/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/suzalink-logo-white.svg" alt="" className="mb-4 ml-1 h-6 w-auto self-start" />
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300">
          <Sparkles size={12} /> Analyse IA
        </div>
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60 ring-1 ring-white/10">
          <Search size={12} /> Rechercher… <span className="ml-auto text-[9px]">⌘K</span>
        </div>
        {NAV.map((g, i) => (
          <div key={i} className="mb-2">
            {g.group ? <p className="mb-1 mt-2 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.group}</p> : null}
            {g.items.map((it) => (
              <div key={it.label} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px] ${it.active ? "bg-white/10 text-white" : ""}`}>
                {it.icon}
                {it.label}
                {it.badge ? <span className="ml-auto rounded-full bg-emerald-500 px-1.5 text-[9px] font-semibold text-white">{it.badge}</span> : null}
                {it.chev ? <ChevronRight size={12} className="ml-auto opacity-50" /> : null}
              </div>
            ))}
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">CR</span>
          <div className="text-[11px] leading-tight">
            <p className="font-semibold text-white">Camille R.</p>
            <p className="text-[9px] uppercase text-white/40">Manager</p>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-white">
        <div className="flex h-11 items-center justify-between border-b border-black/5 px-5 text-[11px] text-[#6b7280]">
          <span className="font-mono">
            Manager / <span className="text-[#0b1220]">Tableau de bord</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded-lg px-2 py-1 ring-1 ring-black/10">✦ Assistant</span>
            <span className="rounded-lg px-2 py-1 ring-1 ring-black/10">Signaler</span>
            <span className="grid size-6 place-items-center rounded-lg ring-1 ring-black/10">
              <Bell size={12} />
            </span>
          </span>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-xl bg-[#0b0f1a] text-white">
                  <Activity size={15} />
                </span>
                <span className="font-display text-[22px] leading-none">Command Center Manager</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping-soft rounded-full bg-emerald-500" />
                    <span className="relative size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  En direct
                </span>
              </p>
              <p className="mt-1.5 text-[10.5px] text-[#6b7280]">
                Période : <b className="text-[#0b1220]">30 derniers jours</b> · Missions : <b className="text-[#0b1220]">Toutes les missions</b>
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex rounded-lg p-0.5 ring-1 ring-black/10">
                <span className="px-2 py-1">7j</span>
                <span className="rounded-md bg-[#0b0f1a] px-2 py-1 font-semibold text-white">30j</span>
                <span className="px-2 py-1">Mois</span>
              </span>
              <span className="rounded-lg px-2.5 py-1.5 ring-1 ring-black/10">Toutes les missions ⌄</span>
              <span className="rounded-lg bg-accent px-3 py-1.5 font-semibold text-white">+ Nouvelle mission</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            <Kpi dark tint="" icon={<Phone size={15} className="text-sky-300" />} tag="Volume global" label="Appels & actions" value="1 443" unit="actions" bar={100} barClass="bg-gradient-to-r from-sky-400 to-emerald-400" foot="● Activité active" footRight="1 443 menées" delay={200} />
            <Kpi dark tint="" icon={<Trophy size={15} className="text-amber-300" />} tag="100 % objectif" label="RDV cette semaine" value="12" unit="/ 10 visés" bar={100} barClass="bg-gradient-to-r from-sky-400 to-amber-300" foot="Objectif hebdo (semaine en cours)" footRight="12 signés" delay={320} />
            <Kpi tint="bg-gradient-to-br from-amber-50 to-orange-50" icon={<Flame size={15} className="text-orange-500" />} tag="Haute intention" label="Leads chauds & rappels" value="96" unit="contacts qualifiés" bar={72} barClass="bg-gradient-to-r from-amber-400 to-orange-500" foot="96 rappels à exécuter" delay={440} />
            <Kpi tint="bg-gradient-to-br from-emerald-50 to-teal-50" icon={<TrendingUp size={15} className="text-emerald-600" />} tag="Conversion" label="Taux de conversion" value="2,3 %" unit="global" bar={12} barClass="bg-emerald-400" foot="✦ Performance équipe" delay={560} />
          </div>

          <div className="mt-3 grid grid-cols-[1.55fr_1fr] gap-3">
            <div className="rounded-[18px] p-4 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-accent-tint text-accent">
                    <BarChart3 size={15} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13px] font-semibold">Performance &amp; trajectoire RDV</span>
                    <span className="block text-[10px] text-[#6b7280]">Semaine en cours · cumul vs objectif hebdomadaire</span>
                  </span>
                </p>
                <span className="flex gap-1.5 text-[10px] font-medium">
                  <span className="rounded-full bg-black/5 px-2 py-1">● Réalisé</span>
                  <span className="rounded-full bg-accent-tint px-2 py-1 text-accent">● Objectif</span>
                </span>
              </div>
              <svg viewBox="0 0 560 190" className="mt-3 w-full">
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1="28" x2="556" y1={14 + i * 52} y2={14 + i * 52} stroke="#eef0f4" />
                ))}
                {["16", "12", "8", "4"].map((t, i) => (
                  <text key={t} x="4" y={18 + i * 52} fontSize="9" fill="#9ca3af">
                    {t}
                  </text>
                ))}
                <defs>
                  <linearGradient id="dash-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#3355ff" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#3355ff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="dash-line" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#0b1220" />
                    <stop offset="1" stopColor="#3355ff" />
                  </linearGradient>
                </defs>
                <path data-appear-on-view d="M34 128 C 90 112, 150 98, 200 70 S 270 38, 330 34 L330 166 L34 166Z" fill="url(#dash-area)" style={vars({ "--delay": "500ms" })} />
                <path data-draw-on-view pathLength={1} d="M34 128 C 90 112, 150 98, 200 70 S 270 38, 330 34" fill="none" stroke="url(#dash-line)" strokeWidth="2.4" strokeLinecap="round" style={vars({ "--delay": "300ms" })} />
                <circle cx="330" cy="34" r="9" fill="#3355ff" opacity="0.18" className="origin-center animate-ping-soft [transform-box:fill-box]" />
                <circle cx="330" cy="34" r="4" fill="#3355ff" stroke="#fff" strokeWidth="2" />
                <path d="M34 150 C 140 128, 220 96, 330 78 S 420 68, 548 68" fill="none" stroke="#3b82f6" strokeWidth="1.6" strokeDasharray="4 4" />
                {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((d, i) => (
                  <text key={d} x={34 + i * 85} y="184" fontSize="9" fill="#6b7280" textAnchor="middle">
                    {d}
                  </text>
                ))}
              </svg>
            </div>

            <div className="rounded-[18px] p-4 ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-xl bg-amber-50 text-amber-500">
                    <Zap size={15} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13px] font-semibold">Priorités commerciales</span>
                    <span className="block text-[10px] text-[#6b7280]">Actions à fort impact pour l’équipe</span>
                  </span>
                </p>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">100 signaux</span>
              </div>
              <div className="mt-3 space-y-2">
                <Priority icon={<Clock size={15} />} tone="bg-amber-50 text-amber-500" title="Rappels planifiés" chip="Urgent" chipTone="bg-amber-100 text-amber-700" sub="Prospects en attente d’un second contact" n={96} delay={350} />
                <Priority icon={<Star size={15} />} tone="bg-emerald-50 text-emerald-600" title="Prospects intéressés" chip="Chaud" chipTone="bg-emerald-100 text-emerald-700" sub="Intérêt manifesté à transformer en RDV" n={4} delay={500} />
                <Priority icon={<CircleCheck size={15} />} tone="bg-sky-50 text-sky-600" title="RDV à préparer & briefer" chip="Gagné" chipTone="bg-sky-100 text-sky-700" sub="Rendez-vous récents pris par vos SDR" n={33} delay={650} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
