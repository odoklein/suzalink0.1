import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  History,
  LayoutGrid,
  LifeBuoy,
  ListChecks,
  ListTodo,
  Mail,
  MessagesSquare,
  Phone,
  PhoneCall,
  Radar,
  Receipt,
  RefreshCw,
  Search,
  Users,
  Wand2,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Shared pieces for the coded product mocks (S1–S6 and the hero dashboard),
 * drawn after the real app: near-black sidebar with the Captain AI button and
 * the Production / Gestion / Outils groups (lib/navigation/config.ts in the
 * CRM), a white top bar with the section's tabs, a warm canvas, white 20 px
 * cards, black primary buttons. Mocks are drawn at MOCK_W × MOCK_H and scaled
 * by <FitBox>. Invented demo data only, and only features the copy already claims.
 */
export const MOCK_W = 1200;
export const MOCK_H = 750;

/** The app's warm canvas and its black primary button. */
export const CANVAS = "bg-[#f6f5f2]";
export const INK_BUTTON = "bg-[#0b0b0c] text-white";

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
  gray: { soft: "bg-[#f1f0ec]", text: "text-[#5f5d57]", solid: "bg-[#9a978f]", ring: "ring-black/10" },
};

type NavEntry = { label: string; icon: ReactNode; badge?: string; sub?: string[] };
type NavGroup = { group?: string; items: NavEntry[] };

const I = 15;

const NAV_MANAGER: NavGroup[] = [
  { items: [{ label: "Accueil", icon: <LayoutGrid size={I} /> }, { label: "Tâches", icon: <ListChecks size={I} /> }] },
  {
    group: "Production",
    items: [
      { label: "Prospection", icon: <Radar size={I} />, sub: ["Listes", "Sourcing", "Appels", "BlackList"] },
      { label: "Rendez-vous", icon: <CalendarDays size={I} />, sub: ["SAS RDV", "Signalements absents"] },
      { label: "Clients", icon: <Building2 size={I} />, sub: ["Clients", "Dashboard projet"] },
      { label: "Communication", icon: <MessagesSquare size={I} />, sub: ["Email Hub", "Broadcasts"] },
    ],
  },
  {
    group: "Gestion",
    items: [
      { label: "RH", icon: <Users size={I} />, sub: ["Planning", "Utilisateurs & accès", "Paie"] },
      { label: "Pilotage", icon: <BarChart3 size={I} />, sub: ["Statistiques", "Analyse IA"] },
      { label: "Facturation", icon: <Receipt size={I} />, sub: ["Vue d’ensemble", "Factures"] },
    ],
  },
  {
    group: "Outils",
    items: [
      { label: "Support technique", icon: <LifeBuoy size={I} /> },
      { label: "Organisation", icon: <FolderKanban size={I} />, sub: ["Projets", "Fichiers"] },
    ],
  },
];

const NAV_SDR: NavGroup[] = [
  { items: [{ label: "Accueil", icon: <LayoutGrid size={I} /> }] },
  {
    group: "Activité",
    items: [
      { label: "Appeler", icon: <PhoneCall size={I} />, badge: "48" },
      { label: "Rappels", icon: <Phone size={I} /> },
      { label: "Mes RDV", icon: <CalendarDays size={I} /> },
      { label: "Calendrier", icon: <CalendarDays size={I} /> },
      { label: "Historique", icon: <History size={I} /> },
    ],
  },
  {
    group: "Espace de travail",
    items: [
      { label: "Email Hub", icon: <Mail size={I} /> },
      { label: "Planning", icon: <CalendarDays size={I} /> },
      { label: "Tâches", icon: <ListChecks size={I} /> },
      { label: "Support technique", icon: <LifeBuoy size={I} /> },
    ],
  },
];

/**
 * The app's sidebar. `active` is the item to highlight; `activeSub` opens that
 * item's sub-menu with the given entry selected, as the app does.
 */
export function MockSidebar({
  variant = "manager",
  active,
  activeSub,
  user = { initials: "CR", name: "Camille R.", role: "Manager" },
}: {
  variant?: "manager" | "sdr";
  active: string;
  activeSub?: string;
  user?: { initials: string; name: string; role: string };
}) {
  const nav = variant === "sdr" ? NAV_SDR : NAV_MANAGER;
  return (
    <aside className="flex w-[196px] shrink-0 flex-col bg-[#0b0b0c] px-2.5 pb-3 pt-4 text-white/75">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/suzalink-logo-white.svg" alt="" className="mb-4 ml-1.5 h-[22px] w-auto self-start" />
      <div className="mb-2 flex items-center gap-2 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[11px] text-white/55 ring-1 ring-white/10">
        <Search size={12} /> Rechercher… <span className="ml-auto rounded bg-white/10 px-1 text-[9px]">⌘K</span>
      </div>
      <div className="mb-3 flex items-center gap-2 rounded-lg bg-accent px-2.5 py-2 text-[11.5px] font-semibold text-white shadow-[0_6px_16px_-8px_rgb(51_85_255/0.9)]">
        <Wand2 size={13} /> Captain AI
      </div>
      {nav.map((g, i) => (
        <div key={i} className={cn("pb-1.5", i > 0 && "border-t border-white/[0.07] pt-1.5")}>
          {g.group ? <p className="mb-0.5 mt-1 px-2 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-white/55">{g.group}</p> : null}
          {g.items.map((it) => {
            const on = it.label === active;
            const open = on && activeSub && it.sub;
            return (
              <div key={it.label}>
                <div className={cn("relative flex items-center gap-2.5 rounded-lg px-2.5 py-[6px] text-[11.5px]", on && "bg-white/[0.09] font-semibold text-white")}>
                  {on && !open ? <span className="absolute -left-2.5 top-1.5 h-[calc(100%-12px)] w-[3px] rounded-r bg-accent" /> : null}
                  {it.icon}
                  {it.label}
                  {it.badge ? <span className="ml-auto rounded-full bg-accent px-1.5 text-[9px] font-semibold text-white">{it.badge}</span> : null}
                  {it.sub ? (
                    open ? <ChevronDown size={11} className="ml-auto opacity-60" /> : <ChevronRight size={11} className="ml-auto opacity-40" />
                  ) : null}
                </div>
                {open ? (
                  <div className="mb-1 ml-[18px] mt-0.5 border-l border-white/10 pl-2">
                    {it.sub?.map((s) => (
                      <p key={s} className={cn("relative rounded-md px-2 py-[4px] text-[10.5px]", s === activeSub ? "bg-white/[0.09] font-semibold text-white" : "text-white/55")}>
                        {s === activeSub ? <span className="absolute -left-[9px] top-1 h-[calc(100%-8px)] w-[2px] rounded bg-accent" /> : null}
                        {s}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-auto flex items-center gap-2 border-t border-white/[0.07] px-1.5 pt-3">
        <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#5b7cff] to-[#7a5cff] text-[10px] font-semibold text-white">{user.initials}</span>
        <div className="min-w-0 flex-1 text-[11px] leading-tight">
          <p className="truncate font-semibold text-white">{user.name}</p>
          <p className="text-[9.5px] text-white/60">{user.role}</p>
        </div>
        <ChevronDown size={11} className="opacity-50" />
      </div>
    </aside>
  );
}

/**
 * The app's top bar: the section (icon + name) and its tabs on the left, the
 * day's tasks, refresh and notifications on the right.
 */
export function MockTopBar({ crumb, page, tabs, right }: { crumb: string; page: string; tabs?: string[]; right?: ReactNode }) {
  const list = tabs ?? [page];
  return (
    <div className="flex h-[46px] shrink-0 items-stretch justify-between border-b border-black/[0.07] bg-white px-4 text-[11.5px]">
      <span className="flex items-stretch gap-1">
        <span className="flex items-center gap-2 pr-1 font-semibold text-[#0b0b0c]">
          <span className="grid size-6 place-items-center rounded-md bg-[#f1f0ec] text-[#5f5d57]">
            <BarChart3 size={12} />
          </span>
          {crumb}
          <span className="ml-2 h-4 w-px bg-black/10" />
        </span>
        {list.map((t) => (
          <span key={t} className={cn("relative flex items-center px-2.5", t === page ? "font-semibold text-[#0b0b0c]" : "text-[#6b6860]")}>
            {t}
            {t === page ? <span className="absolute inset-x-1.5 bottom-0 h-[2px] rounded-full bg-[#0b0b0c]" /> : null}
          </span>
        ))}
      </span>
      <span className="flex items-center gap-2">
        {right}
        <span className="flex items-center gap-1.5 rounded-lg bg-[#1d3a8a] px-2.5 py-1.5 text-[10.5px] font-semibold text-white">
          <ListTodo size={12} /> Tâches d’aujourd’hui <span className="rounded bg-white/20 px-1 text-[9px]">2</span>
        </span>
        <span className="grid size-7 place-items-center rounded-lg text-[#5f5d57] ring-1 ring-black/10">
          <RefreshCw size={12} />
        </span>
        <span className="grid size-7 place-items-center rounded-lg text-[#5f5d57] ring-1 ring-black/10">
          <Bell size={12} />
        </span>
      </span>
    </div>
  );
}

/** Full app frame: sidebar + top bar + warm workspace. */
export function MockShell({
  children,
  active,
  activeSub,
  variant,
  crumb,
  page,
  tabs,
  right,
  user,
}: {
  children: ReactNode;
  active: string;
  activeSub?: string;
  variant?: "manager" | "sdr";
  crumb: string;
  page: string;
  tabs?: string[];
  right?: ReactNode;
  user?: { initials: string; name: string; role: string };
}) {
  return (
    <div aria-hidden className="flex overflow-hidden bg-white font-sans text-[#0b0b0c]" style={{ width: MOCK_W, height: MOCK_H }}>
      <MockSidebar variant={variant} active={active} activeSub={activeSub} user={user} />
      <div className={cn("flex min-w-0 flex-1 flex-col", CANVAS)}>
        <MockTopBar crumb={crumb} page={page} tabs={tabs} right={right} />
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[20px] bg-white p-4 ring-1 ring-black/[0.07]", className)}>{children}</div>;
}

export function PanelTitle({ icon, tone = "accent", title, sub, right }: { icon: ReactNode; tone?: Tone; title: string; sub?: string; right?: ReactNode }) {
  const t = TONE[tone];
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="flex items-center gap-2.5">
        <span className={cn("grid size-8 place-items-center rounded-xl", t.soft, t.text)}>{icon}</span>
        <span className="leading-tight">
          <span className="block text-[13px] font-semibold">{title}</span>
          {sub ? <span className="block text-[10px] text-[#6b6860]">{sub}</span> : null}
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
        down ? cn("translate-y-[2px] shadow-none", t.soft, t.text, t.ring) : "text-[#0b0b0c] shadow-[0_2px_0_#d6d3cc] ring-[#d6d3cc]",
        className,
      )}
    >
      {children}
    </span>
  );
}
