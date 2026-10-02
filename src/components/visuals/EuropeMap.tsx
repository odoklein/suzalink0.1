import { MAP_HEIGHT, MAP_SRC, MAP_WIDTH, NODES } from "./europe-map-data";

/**
 * V9, drawn in code from Natural Earth data: France is the main node, Germany
 * and Spain the backup nodes, joined by the accent line. The country shapes
 * are a cached static SVG; the line and labels are inline so they can draw on
 * scroll and stay readable to screen readers. Sparks of data travel along the
 * routes and France pings (both stop under reduced motion).
 */
export function EuropeMap({
  labels,
  className,
}: {
  labels: { france: string; germany: string; spain: string; primary: string; backup: string };
  className?: string;
}) {
  const [fx, fy] = NODES.FR;
  const [dx, dy] = NODES.DE;
  const [sx, sy] = NODES.ES;
  const toGermany = `M ${fx} ${fy} Q ${(fx + dx) / 2 - 10} ${Math.min(fy, dy) - 60} ${dx} ${dy}`;
  const toSpain = `M ${fx} ${fy} Q ${(fx + sx) / 2 - 70} ${(fy + sy) / 2 - 10} ${sx} ${sy}`;

  return (
    <div className={`relative ${className ?? ""}`} style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation needed */}
      <img src={MAP_SRC} alt="" width={MAP_WIDTH} height={MAP_HEIGHT} loading="lazy" decoding="async" className="absolute inset-0 size-full" />
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="absolute inset-0 size-full"
        role="img"
        aria-label={`${labels.primary} : ${labels.france}. ${labels.backup} : ${labels.germany}, ${labels.spain}.`}
      >
        <defs>
          <filter id="map-spark" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>
        {/* Drawn on scroll when a parent carries .thread-draw */}
        <g fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round">
          <path data-draw pathLength={1} d={toGermany} />
          <path data-draw pathLength={1} d={toSpain} />
        </g>
        {/* Backups flowing out of France */}
        <g fill="none" strokeLinecap="round" className="motion-only">
          {[toGermany, toSpain].map((d, i) => (
            <g key={d}>
              <path
                d={d}
                pathLength={1}
                stroke="#7fb6ff"
                strokeWidth={7}
                strokeDasharray="0.1 1.2"
                filter="url(#map-spark)"
                className="animate-comet"
                style={{ animationDelay: `${1.2 + i * 1.6}s` }}
              />
              <path d={d} pathLength={1} stroke="#ffffff" strokeWidth={2.5} strokeDasharray="0.06 1.2" className="animate-comet" style={{ animationDelay: `${1.2 + i * 1.6}s` }} />
            </g>
          ))}
        </g>
        <Node x={dx} y={dy} label={labels.germany} sub={labels.backup} />
        <Node x={sx} y={sy} label={labels.spain} sub={labels.backup} />
        <Node x={fx} y={fy} label={labels.france} sub={labels.primary} primary />
      </svg>
    </div>
  );
}

function Node({ x, y, label, sub, primary }: { x: number; y: number; label: string; sub: string; primary?: boolean }) {
  const w = Math.max(label.length, sub.length) * 7.6 + 26;
  return (
    <g>
      {primary ? (
        <>
          <circle cx={x} cy={y} r={22} fill="var(--color-accent)" opacity={0.14} />
          <circle cx={x} cy={y} r={16} fill="var(--color-accent)" opacity={0.35} className="motion-only animate-ping-soft origin-center [transform-box:fill-box]" />
        </>
      ) : null}
      <circle cx={x} cy={y} r={primary ? 9 : 7} fill={primary ? "var(--color-accent)" : "#ffffff"} stroke="var(--color-accent)" strokeWidth={3} />
      <g transform={`translate(${x + 16} ${y - 44})`}>
        <rect width={w} height={40} rx={10} fill="#ffffff" stroke="var(--color-line)" />
        <text x={12} y={17} fontSize={13} fontWeight={600} fill="var(--color-ink)" fontFamily="var(--font-sans)">
          {label}
        </text>
        <text x={12} y={32} fontSize={11} fill="var(--color-muted)" fontFamily="var(--font-sans)">
          {sub}
        </text>
      </g>
    </g>
  );
}
