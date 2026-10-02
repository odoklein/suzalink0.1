import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  Database,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Shared pieces for the coded product mocks (S1–S6). Same language as the
 * hero DashboardMock: dark sidebar, white workspace, 18 px cards, tinted
 * chips. Mocks are drawn at MOCK_W × MOCK_H and scaled by <FitBox>. Invented
 * demo data only, and only features the copy already claims.
 */
export const MOCK_W = 1200;
export const MOCK_H = 750;

export type Tone = "accent" | "mint" | "sun" | "coral" | "rose" | "violet" | "azure" | "gray";

/** Tinted chip / tile classes per tone (light UI). */
export const TONE: Record<Tone, { soft: string; text: string; solid: string; ring: string }> = {
  accent: { soft: "bg-accent-tint", text: "text-accent", solid: "bg-accent", ring: "ring-accent/25" },
  mint: { soft: "bg-mint-soft", text: "text-mint-ink", solid: "bg-mint", ring: "ring-mint/30" },
  sun: { soft: "bg-sun-soft", text: "text-sun-ink", solid: "bg-sun", ring: "ring-sun/35" },
  coral: { soft: "bg-coral-soft", text: "text-coral-ink", solid: "bg-coral", ring: "ring-coral/30" },
  rose: { soft: "bg-rose-soft", text: "text-rose-ink", solid: "bg-rose", ring: "ring-rose/30" },
  violet: { soft: "bg-violet-soft", text: "text-violet-ink", solid: "bg-violet", ring: "ring-violet/30" },
  azure: { soft: "bg-azure-soft", text: "text-azure-ink", solid: "bg-azure", ring: "ring-azure/30" },
  gray: { soft: "bg-[#f1f3f6]", text: "text-[#5b6475]", solid: "bg-[#9aa3b2]", ring: "ring-black/10" },
};

type NavEntry = { label: string; icon: ReactNode; badge?: string; chev?: boolean };
type NavGroup = { group?: string; items: NavEntry[] };

const NAV_MANAGER: NavGroup[] = [
  { items: [{ label: "Messagerie", icon: <MessageSquare size={15} /> }, { label: "Email", icon: <Mail size={15} />, chev: true }] },
  {
    group: "Pilotage commercial",
    items: [
      { label: "Cockpit", icon: <Activity size={15} /> },
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

const NAV_SDR: NavGroup[] = [
  { items: [{ label: "Messagerie", icon: <MessageSquare size={15} /> }, { label: "Email", icon: <Mail size={15} />, chev: true }] },
  {
    group: "Ma prospection",
    items: [
      { label: "Espace d'appel", icon: <Phone size={15} />, badge: "48" },
      { label: "Rendez-vous", icon: <CalendarDays size={15} /> },
      { label: "Listes", icon: <Database size={15} /> },
      { label: "Missions", icon: <Target size={15} /> },
    ],
  },
  {
    group: "Suivi",
    items: [
      { label: "Performance", icon: <BarChart3 size={15} /> },
      { label: "Analyse IA", icon: <Sparkles size={15} /> },
    ],
  },
];

/** The dark Suzalink sidebar. `active` is the label to highlight. */
export function MockSidebar({ variant = "manager", active, user = { initials: "CR", name: "Camille R.", role: "Manager" } }: {
  variant?: "manager" | "sdr";
  active: string;
  user?: { initials: string; name: string; role: string };
}) {
  const nav = variant === "sdr" ? NAV_SDR : NAV_MANAGER;
  return (
    <aside className="flex w-[190px] shrink-0 flex-col bg-[#0b0f1a] px-3 py-4 text-white/80">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/suzalink-logo-white.svg" alt="" className="mb-4 ml-1 h-6 w-auto self-start" />
      <div className="mb-2 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300">
        <Sparkles size={12} /> Analyse IA
      </div>
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] text-white/60 ring-1 ring-white/10">
        <Search size={12} /> Rechercher… <span className="ml-auto text-[9px]">⌘K</span>
      </div>
      {nav.map((g, i) => (
        <div key={i} className="mb-2">
          {g.group ? <p className="mb-1 mt-2 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.group}</p> : null}
          {g.items.map((it) => {
            const on = it.label === active;
            return (
              <div key={it.label} className={cn("relative flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[12px]", on && "bg-white/10 text-white")}>
                {on ? <span className="absolute -left-3 top-1.5 h-[calc(100%-12px)] w-[3px] rounded-r bg-accent" /> : null}
                {it.icon}
                {it.label}
                {it.badge ? <span className="ml-auto rounded-full bg-accent px-1.5 text-[9px] font-semibold text-white">{it.badge}</span> : null}
                {it.chev ? <ChevronRight size={12} className="ml-auto opacity-50" /> : null}
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-auto flex items-center gap-2 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10">
        <span className="grid size-7 place-items-center rounded-full bg-accent text-[10px] font-semibold text-white">{user.initials}</span>
        <div className="text-[11px] leading-tight">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="text-[9px] uppercase text-white/40">{user.role}</p>
        </div>
      </div>
    </aside>
  );
}

/** Top bar of the workspace: breadcrumb on the left, actions on the right. */
export function MockTopBar({ crumb, page, right }: { crumb: string; page: string; right?: ReactNode }) {
  return (
    <div className="flex h-11 shrink-0 items-center justify-between border-b border-black/5 px-5 text-[11px] text-[#6b7280]">
      <span className="font-mono">
        {crumb} / <span className="text-[#0b1220]">{page}</span>
      </span>
      <span className="flex items-center gap-2">
        {right}
        <span className="rounded-lg px-2 py-1 ring-1 ring-black/10">✦ Assistant</span>
        <span className="grid size-6 place-items-center rounded-lg ring-1 ring-black/10">
          <Bell size={12} />
        </span>
      </span>
    </div>
  );
}

/** Full app frame: sidebar + top bar + workspace. */
export function MockShell({
  children,
  active,
  variant,
  crumb,
  page,
  right,
  user,
}: {
  children: ReactNode;
  active: string;
  variant?: "manager" | "sdr";
  crumb: string;
  page: string;
  right?: ReactNode;
  user?: { initials: string; name: string; role: string };
}) {
  return (
    <div aria-hidden className="flex overflow-hidden bg-white font-sans text-[#0b1220]" style={{ width: MOCK_W, height: MOCK_H }}>
      <MockSidebar variant={variant} active={active} user={user} />
      <main className="flex min-w-0 flex-1 flex-col bg-white">
        <MockTopBar crumb={crumb} page={page} right={right} />
        <div className="min-h-0 flex-1">{children}</div>
      </main>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[18px] bg-white p-4 ring-1 ring-black/[0.06]", className)}>{children}</div>;
}

export function PanelTitle({ icon, tone = "accent", title, sub, right }: { icon: ReactNode; tone?: Tone; title: string; sub?: string; right?: ReactNode }) {
  const t = TONE[tone];
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-2.5">
        <span className={cn("grid size-8 place-items-center rounded-xl", t.soft, t.text)}>{icon}</span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold">{title}</span>
          {sub ? <span className="block text-[10px] text-[#6b7280]">{sub}</span> : null}
        </span>
      </p>
      {right}
    </div>
  );
}

export function Chip({ tone = "gray", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  const t = TONE[tone];
  return <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold", t.soft, t.text, className)}>{children}</span>;
}

const AVATAR_TONES = [
  "from-[#5b7cff] to-[#7a5cff]",
  "from-[#ff8a65] to-[#f7468a]",
  "from-[#2fc6a0] to-[#1f93ff]",
  "from-[#ffc24b] to-[#ff6847]",
  "from-[#7a5cff] to-[#f7468a]",
  "from-[#1f93ff] to-[#10b981]",
];

/** Initials on a gradient disc; `seed` picks the gradient. */
export function Avatar({ initials, seed = 0, size = 32, className }: { initials: string; seed?: number; size?: number; className?: string }) {
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-semibold text-white", AVATAR_TONES[seed % AVATAR_TONES.length], className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  );
}

/** A keyboard key cap; `down` shows it pressed. */
export function MockKey({ children, down, tone = "gray", className }: { children: ReactNode; down?: boolean; tone?: Tone; className?: string }) {
  const t = TONE[tone];
  return (
    <span
      className={cn(
        "inline-grid size-7 place-items-center rounded-[8px] bg-white text-[12px] font-bold ring-1 transition-[translate,box-shadow,background-color] duration-150",
        down ? cn("translate-y-[2px] shadow-none", t.soft, t.text, t.ring) : "text-[#0b1220] shadow-[0_2px_0_#d4d8df] ring-[#d4d8df]",
        className,
      )}
    >
      {children}
    </span>
  );
}
