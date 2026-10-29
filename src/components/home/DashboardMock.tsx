import { Activity, ArrowDownRight, ArrowUpRight, Bell, Calendar, ChevronDown, Flame, Phone, Plus, RefreshCw, Target, TrendingUp, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { vars } from "@/lib/style";
import { CANVAS, INK_BUTTON, MockSidebar, MockTopBar } from "../mocks/kit";

/** Design size, scaled to fit by <FitBox>. */
export const DASHBOARD_W = 1200;
export const DASHBOARD_H = 740;

/** RDV per day over the last 30 days (invented). */
const DAYS = [3, 4, 1, 0, 0, 2, 3, 3, 4, 1, 0, 0, 3, 5, 2, 4, 3, 0, 0, 6, 4, 2, 1, 3, 0, 0, 2, 1, 1, 2];
const MAX = Math.max(...DAYS);

function Kpi({ label, value, unit, delta, down, foot, icon, iconClass, delay }: { label: string; value: string; unit?: string; delta: string; down?: boolean; foot: string; icon: ReactNode; iconClass: string; delay: number }) {
  return (
    <div data-appear-on-view className="flex items-start justify-between rounded-[20px] bg-white px-5 py-4 ring-1 ring-black/[0.07]" style={vars({ "--delay": `${delay}ms` })}>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#6b6860]">{label}</p>
        <p className="mt-1.5 flex items-baseline gap-2">
          <span className="num text-[30px] font-bold leading-none tracking-[-0.03em]">{value}</span>
          {unit ? <span className="rounded-full bg-[#f1f0ec] px-2 py-0.5 text-[9.5px] font-semibold text-[#5f5d57]">{unit}</span> : null}
        </p>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-[#6b6860]">
          <span className={down ? "flex items-center font-semibold text-coral-ink" : "flex items-center font-semibold text-mint-ink"}>
            {down ? <ArrowDownRight size={11} /> : <ArrowUpRight size={11} />}
            {delta}
          </span>
          {foot}
        </p>
      </div>
      <span className={`grid size-10 place-items-center rounded-[12px] text-white ${iconClass}`}>{icon}</span>
    </div>
  );
}

function CardTitle({ icon, iconClass, title, sub, chip }: { icon: ReactNode; iconClass: string; title: string; sub: string; chip?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <p className="flex items-center gap-2.5">
        <span className={`grid size-8 place-items-center rounded-[10px] ${iconClass}`}>{icon}</span>
        <span className="leading-tight">
          <span className="block text-[13px] font-bold">{title}</span>
          <span className="block text-[9.5px] text-[#6b6860]">{sub}</span>
        </span>
      </p>
      {chip}
    </div>
  );
}

/**
 * Coded stand-in for the manager home of the app (« Accueil »), drawn after the
 * real screen: greeting, the black RDV card with its bars per day, three KPI
 * cards, then call results, follow-ups and the RDV leaderboard. Invented demo
 * data. Flat and front-on: tilt and scale come from <ScrollReveal>.
 */
export function DashboardMock() {
  return (
    <div aria-hidden className="flex overflow-hidden bg-white font-sans text-[#0b0b0c]" style={{ width: DASHBOARD_W, height: DASHBOARD_H }}>
      <MockSidebar active="Accueil" />

      <div className={`flex min-w-0 flex-1 flex-col ${CANVAS}`}>
        <MockTopBar crumb="Manager" page="Accueil" />

        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 text-[10px] font-medium text-[#5f5d57]">
            <span className="flex items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 font-semibold text-mint-ink ring-1 ring-mint/30">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
                <span className="relative size-1.5 rounded-full bg-mint" />
              </span>
              En direct · 09:42
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-black/[0.08]">
              <Calendar size={10} /> 30 derniers jours
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 ring-1 ring-black/[0.08]">
              <Target size={10} /> Toutes les missions
            </span>
          </div>

          <div className="mt-2.5 flex items-end justify-between">
            <div>
              <p className="text-[26px] font-bold leading-none tracking-[-0.035em]">Bonjour, Camille</p>
              <p className="mt-1.5 text-[11px] text-[#6b6860]">Tableau de bord de l’équipe : RDV, résultats d’appels et missions.</p>
            </div>
            <div className="flex items-center gap-2 text-[10.5px] font-semibold">
              <span className="flex items-center gap-4 rounded-xl bg-white px-3 py-2 ring-1 ring-black/[0.08]">
                30 derniers jours <ChevronDown size={11} className="text-[#6b6860]" />
              </span>
              <span className="flex items-center gap-4 rounded-xl bg-white px-3 py-2 ring-1 ring-black/[0.08]">
                Toutes les missions <ChevronDown size={11} className="text-[#6b6860]" />
              </span>
              <span className="grid size-8 place-items-center rounded-xl bg-white ring-1 ring-black/[0.08]">
                <RefreshCw size={12} />
              </span>
              <span className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 ${INK_BUTTON}`}>
                <Plus size={12} /> Nouvelle mission
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-[1.72fr_1fr] gap-3.5">
            {/* The black RDV card */}
            <div className="rounded-[22px] bg-[#0b0b0c] p-5 text-white shadow-[0_18px_40px_-24px_rgb(11_11_12/0.8)]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold ring-1 ring-white/10">
                    <Trophy size={11} /> RDV décrochés
                  </span>
                  <span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold ring-1 ring-white/10">9,6 % conv.</span>
                </span>
                <span className="text-[10.5px] font-semibold text-[#7ea0ff]">30 derniers jours</span>
              </div>
              <div className="mt-4 flex items-end justify-between gap-6">
                <div>
                  <p className="flex items-baseline gap-1.5">
                    <span className="num text-[64px] font-bold leading-[0.9] tracking-[-0.05em]">48</span>
                    <span className="text-[16px] font-bold text-white/60">RDV</span>
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[10px] text-white/55">
                    <span className="flex items-center font-semibold text-[#34d399]">
                      <ArrowUpRight size={11} />
                      +62 %
                    </span>
                    vs période préc.
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-white/80">contre 30 RDV sur la période précédente</p>
                </div>
                <div className="flex-1">
                  <div className="flex h-[78px] items-end gap-[3px]">
                    {DAYS.map((d, i) => (
                      <span
                        key={i}
                        data-rise-on-view
                        className={d ? "flex-1 rounded-t-[2px] bg-[#10b981]" : "flex-1 rounded-[1px] bg-[#10b981]/40"}
                        style={{ height: d ? `${(d / MAX) * 100}%` : 2, ...vars({ "--delay": `${300 + i * 28}ms` }) }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 flex justify-between text-[8.5px] text-white/45">
                    <span>Lun. 29</span>
                    <span>RDV / jour</span>
                    <span>Mar. 28</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[
                  ["Période préc.", "30", ""],
                  ["Rythme", "1,6", "/ jour"],
                  ["Rendement", "1 RDV / 27 appels", ""],
                ].map(([k, v, u], i) => (
                  <div key={k} className="rounded-[14px] px-3.5 py-3 ring-1 ring-white/10">
                    <p className="text-[9.5px] text-white/50">{k}</p>
                    <p className={i === 1 ? "mt-1 text-[16px] font-bold text-[#7ea0ff]" : "mt-1 text-[16px] font-bold"}>
                      {v} {u ? <span className="text-[9.5px] font-medium text-white/50">{u}</span> : null}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 flex justify-between text-[9.5px] font-medium text-white/60">
                <span>1 312 appels · 498 joints</span>
                <span>RDV / joints : 9,6 %</span>
              </p>
            </div>

            <div className="grid gap-3">
              <Kpi label="Appels effectués" value="1 312" delta="+38,4 %" foot="vs période préc." icon={<Phone size={17} />} iconClass="bg-[#10b981]" delay={250} />
              <Kpi label="Leads chauds" value="94" unit="Qualifiés" delta="+12,0 %" foot="vs période préc." icon={<Flame size={17} />} iconClass="bg-[#55534d]" delay={380} />
              <Kpi label="Taux de conversion" value="9,6 %" delta="+1,8 pt" foot="RDV / joints · 38 % de joints" icon={<TrendingUp size={17} />} iconClass="bg-[#14b8a6]" delay={510} />
            </div>
          </div>

          {/* Second row, cut by the frame as in the app above the fold */}
          <div className="mt-3.5 grid grid-cols-3 gap-3.5">
            <div className="rounded-[20px] bg-white p-4 ring-1 ring-black/[0.07]">
              <CardTitle icon={<Activity size={14} />} iconClass="bg-mint-soft text-mint-ink" title="Résultats des appels" sub="Répartition des qualifications" chip={<span className="rounded-full bg-[#f1f0ec] px-2 py-0.5 text-[9.5px] font-bold">1 312</span>} />
              <svg viewBox="0 0 120 120" className="mx-auto mt-3 size-[104px] -rotate-90">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#e7e5df" strokeWidth="12" />
                <circle pathLength={1} cx="60" cy="60" r="46" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="0.09 1" />
                <circle pathLength={1} cx="60" cy="60" r="46" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="0.07 1" strokeDashoffset="-0.1" />
                <circle pathLength={1} cx="60" cy="60" r="46" fill="none" stroke="#f43f5e" strokeWidth="12" strokeDasharray="0.14 1" strokeDashoffset="-0.18" />
              </svg>
            </div>
            <div className="rounded-[20px] bg-white p-4 ring-1 ring-black/[0.07]">
              <CardTitle icon={<Bell size={14} />} iconClass="bg-sun-soft text-sun-ink" title="Leads à relancer" sub="103 en attente · à recontacter en priorité" />
              <div className="mt-3 flex items-center gap-3 rounded-[14px] bg-sun-soft/70 px-4 py-4 ring-1 ring-sun/30">
                <span className="grid size-9 place-items-center rounded-[10px] bg-white text-sun-ink ring-1 ring-sun/30">
                  <Bell size={15} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold">
                    103 <span className="text-[11px]">rappels planifiés</span>
                  </span>
                  <span className="block text-[9.5px] text-[#6b6860]">À contacter en priorité</span>
                </span>
              </div>
            </div>
            <div className="rounded-[20px] bg-white p-4 ring-1 ring-black/[0.07]">
              <CardTitle
                icon={<Trophy size={14} />}
                iconClass="bg-sun-soft text-sun-ink"
                title="Leaderboard RDV"
                sub="Sur la période"
                chip={<span className="rounded-full bg-mint-soft px-2 py-0.5 text-[9.5px] font-bold text-mint-ink">+62 %</span>}
              />
              <div className="mt-3 flex items-center gap-2.5 rounded-[14px] bg-mint-soft/60 px-3 py-2.5 ring-1 ring-mint/30">
                <span className="text-[11px] font-bold text-sun-ink">1</span>
                <span className="grid size-7 place-items-center rounded-lg bg-[#0b0b0c] text-[9px] font-bold text-white">SB</span>
                <span className="flex-1 text-[11.5px] font-bold">Sarah B.</span>
                <span className="text-[14px] font-bold">
                  17 <span className="text-[8.5px] text-[#6b6860]">RDV</span>
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2.5 px-3 py-2">
                <span className="text-[11px] font-bold text-[#6b6860]">2</span>
                <span className="grid size-7 place-items-center rounded-lg ring-1 ring-black/10 text-[9px] font-bold">HL</span>
                <span className="flex-1 text-[11.5px] font-bold">Hugo L.</span>
                <span className="text-[14px] font-bold">
                  13 <span className="text-[8.5px] text-[#6b6860]">RDV</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
