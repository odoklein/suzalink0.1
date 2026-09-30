import type { VisualId } from "@/config/visuals";

/*
 * Placeholder art for the generated visuals (V1–V14), drawn in the same
 * language as the prompt pack: soft white objects on light grey, joined by
 * one accent line. Deterministic per id, replaced when the real file lands.
 */

type Variant = "wide" | "square" | "portrait" | "icon" | "hero";

function variantOf(id: VisualId): Variant {
  if (id === "V1") return "hero";
  if (id.startsWith("V3") || id === "V14") return "icon";
  if (id === "V13") return "portrait";
  if (["V2", "V8a", "V8b", "V8c", "V10", "V11"].includes(id)) return "wide";
  return "square";
}

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10_000) / 10_000;
  };
}

type Obj = { x: number; y: number; w: number; h: number; kind: "slab" | "disc" | "stack"; accent: boolean };

/** Smooth path through points (Catmull-Rom converted to cubic Béziers). */
function smooth(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function layout(id: VisualId, variant: Variant, W: number, H: number): { objects: Obj[]; line: [number, number][] } {
  const r = rng(id);
  const kinds: Obj["kind"][] = ["slab", "disc", "stack"];

  if (variant === "icon") {
    const size = W * 0.34;
    const obj: Obj = { x: W / 2 - size / 2, y: H / 2 - size / 2, w: size, h: size * 0.82, kind: kinds[Math.floor(r() * 3)], accent: true };
    return { objects: [obj], line: [[0, H / 2 + 40], [W / 2, H / 2 + 60], [W, H / 2 + 40]] };
  }

  if (variant === "hero") {
    const objects: Obj[] = [
      { x: W * 0.06, y: H * 0.64, w: 150, h: 120, kind: "disc", accent: false },
      { x: W * 0.24, y: H * 0.8, w: 170, h: 110, kind: "stack", accent: false },
      { x: W * 0.84, y: H * 0.1, w: 150, h: 130, kind: "slab", accent: true },
      { x: W * 0.88, y: H * 0.72, w: 130, h: 110, kind: "disc", accent: false },
    ];
    return {
      objects,
      line: [
        [W * 0.06 + 75, H * 0.64 + 60],
        [W * 0.24 + 85, H * 0.8 + 55],
        [W * 0.5, H * 0.72],
        [W * 0.88 + 65, H * 0.72 + 55],
        [W * 0.84 + 75, H * 0.1 + 65],
      ],
    };
  }

  const count = variant === "wide" ? 5 : variant === "portrait" ? 3 : 3;
  const objects: Obj[] = [];
  const line: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const base = variant === "portrait" ? Math.min(W, H) * 0.34 : Math.min(W, H) * (variant === "wide" ? 0.2 : 0.28);
    const w = base * (0.85 + r() * 0.4);
    const h = w * (0.7 + r() * 0.35);
    const cx = variant === "portrait" ? W * (0.3 + 0.4 * ((i % 2) * 1)) : W * (0.12 + t * 0.76);
    const cy =
      variant === "portrait"
        ? H * (0.48 + i * 0.16)
        : H * (0.5 + Math.sin(t * Math.PI * 2 + r() * 1.5) * 0.14);
    objects.push({ x: cx - w / 2, y: cy - h / 2, w, h, kind: kinds[Math.floor(r() * 3)], accent: i === Math.floor(count / 2) });
    line.push([Math.round(cx), Math.round(cy + h * 0.18)]);
  }
  return { objects, line };
}

function Shape({ o, filter }: { o: Obj; filter: string }) {
  const stroke = "#e6e9ef";
  if (o.kind === "disc") {
    const rx = o.w / 2;
    return (
      <g filter={filter}>
        <ellipse cx={o.x + rx} cy={o.y + o.h / 2} rx={rx} ry={o.h / 2} fill="#ffffff" stroke={stroke} strokeWidth={2} />
        {o.accent ? <circle cx={o.x + rx} cy={o.y + o.h / 2} r={Math.min(rx, o.h / 2) * 0.28} fill="#3355ff" /> : null}
      </g>
    );
  }
  if (o.kind === "stack") {
    return (
      <g filter={filter}>
        <rect x={o.x + o.w * 0.08} y={o.y - o.h * 0.14} width={o.w * 0.84} height={o.h} rx={o.w * 0.12} fill="#fbfbfc" stroke={stroke} strokeWidth={2} />
        <rect x={o.x} y={o.y} width={o.w} height={o.h} rx={o.w * 0.12} fill="#ffffff" stroke={stroke} strokeWidth={2} />
        {o.accent ? <rect x={o.x + o.w * 0.14} y={o.y + o.h * 0.2} width={o.w * 0.32} height={o.h * 0.14} rx={o.h * 0.07} fill="#3355ff" /> : null}
      </g>
    );
  }
  return (
    <g filter={filter}>
      <rect x={o.x} y={o.y} width={o.w} height={o.h} rx={o.w * 0.14} fill="#ffffff" stroke={stroke} strokeWidth={2} />
      <rect x={o.x + o.w * 0.14} y={o.y + o.h * 0.22} width={o.w * 0.5} height={o.h * 0.1} rx={o.h * 0.05} fill="#edf0f4" />
      <rect x={o.x + o.w * 0.14} y={o.y + o.h * 0.42} width={o.w * 0.34} height={o.h * 0.1} rx={o.h * 0.05} fill="#edf0f4" />
      {o.accent ? <rect x={o.x + o.w * 0.14} y={o.y + o.h * 0.62} width={o.w * 0.22} height={o.h * 0.16} rx={o.h * 0.05} fill="#3355ff" /> : null}
    </g>
  );
}

export function VisualArt({ id, width, height, transparent }: { id: VisualId; width: number; height: number; transparent?: boolean }) {
  const variant = variantOf(id);
  const { objects, line } = layout(id, variant, width, height);
  const filterId = `soft-${id}`;
  const path = smooth(line);
  const [start, end] = [line[0], line[line.length - 1]];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="block h-full w-full" aria-hidden focusable="false" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy={height * 0.012} stdDeviation={height * 0.018} floodColor="#0b1220" floodOpacity="0.1" />
        </filter>
      </defs>
      {transparent || variant === "icon" ? null : <rect width={width} height={height} fill="#f6f7f9" />}
      <path d={path} fill="none" stroke="#3355ff" strokeWidth={Math.max(3, width * 0.004)} strokeLinecap="round" />
      {objects.map((o, i) => (
        <Shape key={i} o={o} filter={`url(#${filterId})`} />
      ))}
      {variant === "icon" ? null : (
        <>
          <circle cx={start[0]} cy={start[1]} r={width * 0.007} fill="#3355ff" />
          <circle cx={end[0]} cy={end[1]} r={width * 0.007} fill="#3355ff" />
        </>
      )}
    </svg>
  );
}
