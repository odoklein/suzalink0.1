import { isShown } from "@/config/claims";
import { dict } from "@/content";

/**
 * Subprocessors and their regions. Shared by /securite and the DPA. Regions
 * stay « À confirmer » until dependency #10 is verified; in strict mode the
 * list is hidden until then.
 */
export async function Subprocessors() {
  if (!isShown("hosting-fr")) return null;
  const { security } = await dict();
  const s = security.subprocessors;
  return (
    <div className="rounded-[20px] bg-white ring-1 ring-line">
      <div className="flex items-baseline justify-between gap-4 border-b border-line p-5">
        <p className="font-display text-lg font-normal text-ink">{s.title}</p>
        <p className="text-xs text-muted">{s.note}</p>
      </div>
      <dl className="divide-y divide-line">
        {s.rows.map((row) => (
          <div key={row.purpose} className="grid grid-cols-[1.2fr_1fr_0.8fr] gap-3 px-5 py-3 text-sm">
            <dt className="text-ink-soft">{row.purpose}</dt>
            <dd className="text-ink">{row.provider ?? <span className="text-muted">{s.pending}</span>}</dd>
            <dd className="text-right text-muted">{row.region ?? s.pending}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
