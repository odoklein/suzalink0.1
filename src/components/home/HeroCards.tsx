import { CalendarCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { typo } from "@/lib/typo";

/*
 * Product moments floating around the hero dashboard (invented demo data).
 * They sit in the ScrollReveal overlay: `.reveal-float` slides them in as the
 * product stands up, `animate-float` keeps them breathing. Decorative only.
 */

export function BookedCard({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("reveal-float", className)} style={vars({ "--fx": "60px", "--fy": "-20px" })}>
      <div className="w-[248px] animate-float rounded-2xl bg-white/95 p-3.5 shadow-[var(--shadow-float)] ring-1 ring-ink/[0.07] backdrop-blur">
        <div className="flex items-center gap-2.5">
          <span className="relative grid size-9 place-items-center rounded-xl bg-mint-soft text-mint-ink">
            <CalendarCheck className="size-[18px]" strokeWidth={2} />
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-mint ring-2 ring-white" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-ink">RDV confirmé</p>
            <p className="truncate text-xs text-muted">{typo("Transports Lemaire · mar. 10:30")}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-surface px-2.5 py-2">
          <span className="flex -space-x-1.5">
            {["from-[#5b7cff] to-[#7a5cff]", "from-[#ff8a65] to-[#f7468a]", "from-[#2fc6a0] to-[#1f93ff]"].map((g, i) => (
              <span key={g} className={cn("grid size-6 place-items-center rounded-full bg-gradient-to-br text-[9px] font-bold text-white ring-2 ring-white", g)}>
                {["CV", "CR", "HD"][i]}
              </span>
            ))}
          </span>
          <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-semibold text-mint-ink">Client prévenu</span>
        </div>
      </div>
    </div>
  );
}

export function NextActionCard({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("reveal-float", className)} style={vars({ "--fx": "50px", "--fy": "60px" })}>
      <div className="w-[264px] animate-float rounded-2xl bg-white/95 p-3.5 shadow-[var(--shadow-float)] ring-1 ring-ink/[0.07] backdrop-blur [animation-delay:-3.5s]">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-ink">
          <span className="grid size-6 place-items-center rounded-lg bg-[linear-gradient(135deg,#7a5cff,#3355ff)] text-white shadow-[0_6px_14px_-6px_#7a5cff]">
            <Sparkles className="size-3.5" />
          </span>
          Prochaine action
        </p>
        <p className="mt-2.5 text-[13.5px] font-medium leading-snug text-ink">{typo("Rappeler les 3 leads chauds avant midi : ils ont ouvert votre email ce matin.")}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_6px_14px_-8px_#3355ff]">Lancer la file</span>
          <span className="text-[11px] font-medium text-muted">Plus tard</span>
        </div>
      </div>
    </div>
  );
}
