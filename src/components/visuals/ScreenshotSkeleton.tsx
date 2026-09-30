import type { ReactNode } from "react";
import type { ScreenshotId } from "@/config/visuals";

/*
 * Wireframe stand-ins for the real product screenshots (S1–S6). They carry no
 * readable content on purpose and are replaced as soon as a capture lands.
 */

const C = {
  bg: "#ffffff",
  panel: "#fbfbfc",
  surface: "#f6f7f9",
  line: "#e5e7eb",
  bar: "#e8ebf0",
  barDark: "#cfd5de",
  ink: "#0b1220",
  accent: "#3355ff",
  tint: "#eff1ff",
  success: "#16a34a",
  successTint: "#ecfdf3",
};

const Bar = ({ x, y, w, h = 14, fill = C.bar, r = 7 }: { x: number; y: number; w: number; h?: number; fill?: string; r?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} />
);

const Card = ({ x, y, w, h, fill = C.bg, stroke = C.line, r = 16 }: { x: number; y: number; w: number; h: number; fill?: string; stroke?: string; r?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={2} />
);

const Avatar = ({ cx, cy, r = 18, fill = C.barDark }: { cx: number; cy: number; r?: number; fill?: string }) => <circle cx={cx} cy={cy} r={r} fill={fill} />;

function Sidebar() {
  return (
    <g>
      <rect x={0} y={0} width={80} height={1000} fill={C.panel} />
      <line x1={80} y1={0} x2={80} y2={1000} stroke={C.line} strokeWidth={2} />
      <rect x={22} y={24} width={36} height={36} rx={10} fill={C.accent} />
      {[120, 180, 240, 300, 360].map((y, i) => (
        <rect key={y} x={26} y={y} width={28} height={28} rx={8} fill={i === 0 ? C.tint : C.bar} />
      ))}
    </g>
  );
}

function S1() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return (
    <g>
      <Sidebar />
      {/* Queue */}
      <rect x={80} y={0} width={380} height={1000} fill={C.bg} />
      <Bar x={112} y={40} w={150} h={20} fill={C.barDark} />
      <Bar x={112} y={78} w={300} h={36} r={10} fill={C.surface} />
      {Array.from({ length: 8 }, (_, i) => {
        const y = 140 + i * 96;
        const active = i === 0;
        return (
          <g key={i}>
            {active ? <rect x={96} y={y - 8} width={348} height={84} rx={14} fill={C.tint} /> : null}
            {active ? <rect x={96} y={y + 8} width={4} height={52} rx={2} fill={C.accent} /> : null}
            <Avatar cx={140} cy={y + 34} fill={active ? "#b9c4ff" : C.barDark} />
            <Bar x={172} y={y + 16} w={active ? 170 : 150 - (i % 3) * 20} fill={active ? "#c7cffc" : C.bar} />
            <Bar x={172} y={y + 42} w={110 + (i % 2) * 40} h={10} fill={C.bar} />
          </g>
        );
      })}
      <line x1={460} y1={0} x2={460} y2={1000} stroke={C.line} strokeWidth={2} />
      {/* Contact card */}
      <Avatar cx={530} cy={84} r={32} />
      <Bar x={580} y={62} w={260} h={24} fill={C.barDark} />
      <Bar x={580} y={98} w={180} h={14} />
      <rect x={990} y={64} width={140} height={44} rx={12} fill={C.accent} />
      <rect x={1030} y={80} width={60} height={12} rx={6} fill="#ffffff" opacity={0.9} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <Bar x={500 + (i % 3) * 210} y={160 + Math.floor(i / 3) * 64} w={80} h={10} />
          <Bar x={500 + (i % 3) * 210} y={180 + Math.floor(i / 3) * 64} w={150} h={14} fill={C.barDark} />
        </g>
      ))}
      <Card x={496} y={310} w={634} h={620} fill={C.panel} />
      <Bar x={528} y={344} w={120} h={18} fill={C.barDark} />
      {["Accroche", "Découverte", "Objections", "Conclusion"].map((_, i) => (
        <g key={i}>
          <rect x={528 + i * 146} y={384} width={130} height={34} rx={17} fill={i === 0 ? C.accent : C.bg} stroke={i === 0 ? C.accent : C.line} strokeWidth={2} />
          <Bar x={552 + i * 146} y={395} w={82} h={12} fill={i === 0 ? "#ffffff" : C.bar} />
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Bar key={i} x={528} y={452 + i * 44} w={[560, 520, 540, 380, 560, 500, 440, 530, 300][i]} />
      ))}
      <line x1={1160} y1={0} x2={1160} y2={1000} stroke={C.line} strokeWidth={2} />
      {/* Outcomes */}
      <Bar x={1192} y={40} w={140} h={20} fill={C.barDark} />
      {keys.map((k, i) => {
        const x = 1192 + (i % 3) * 132;
        const y = 90 + Math.floor(i / 3) * 104;
        const booked = i === 0;
        return (
          <g key={k}>
            <rect x={x} y={y} width={120} height={88} rx={14} fill={booked ? C.successTint : C.bg} stroke={booked ? "#9ad9b0" : C.line} strokeWidth={2} />
            <rect x={x + 14} y={y + 14} width={30} height={30} rx={8} fill={C.bg} stroke={C.barDark} strokeWidth={2} />
            <text x={x + 29} y={y + 35} textAnchor="middle" fontSize={16} fontWeight={600} fill={C.ink} fontFamily="system-ui, sans-serif">
              {k}
            </text>
            <Bar x={x + 14} y={y + 58} w={booked ? 70 : 60 + (i % 3) * 10} h={10} fill={booked ? "#86d19f" : C.bar} />
          </g>
        );
      })}
      <Bar x={1192} y={440} w={120} h={14} />
      <Card x={1192} y={470} w={380} h={220} fill={C.panel} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={1216} y={500 + i * 40} w={[300, 260, 320, 180][i]} />
      ))}
      <rect x={1192} y={720} width={380} height={56} rx={14} fill={C.accent} />
      <rect x={1330} y={742} width={104} height={12} rx={6} fill="#ffffff" opacity={0.9} />
    </g>
  );
}

function S2() {
  return (
    <g>
      <Sidebar />
      <rect x={80} y={0} width={340} height={1000} fill={C.panel} />
      <Bar x={112} y={40} w={160} h={20} fill={C.barDark} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          {i === 1 ? <rect x={96} y={96 + i * 76} width={308} height={62} rx={12} fill={C.tint} /> : null}
          <Bar x={116} y={112 + i * 76} w={170 - (i % 3) * 20} fill={i === 1 ? "#c7cffc" : C.bar} />
          <Bar x={116} y={136 + i * 76} w={90} h={10} />
        </g>
      ))}
      <line x1={420} y1={0} x2={420} y2={1000} stroke={C.line} strokeWidth={2} />
      {/* Timeline */}
      <path d="M 520 170 L 520 850" stroke={C.accent} strokeWidth={3} fill="none" />
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 130 + i * 150;
        const wait = i % 2 === 1;
        return (
          <g key={i}>
            <circle cx={520} cy={y + 40} r={12} fill={wait ? C.bg : C.accent} stroke={C.accent} strokeWidth={3} />
            {wait ? (
              <g>
                <rect x={560} y={y + 20} width={220} height={40} rx={20} fill={C.surface} stroke={C.line} strokeWidth={2} />
                <Bar x={584} y={y + 34} w={150} h={12} />
              </g>
            ) : (
              <g>
                <Card x={560} y={y} w={500} h={100} />
                <Bar x={588} y={y + 24} w={200} h={18} fill={C.barDark} />
                <Bar x={588} y={y + 58} w={380} h={12} />
              </g>
            )}
          </g>
        );
      })}
      <line x1={1110} y1={0} x2={1110} y2={1000} stroke={C.line} strokeWidth={2} />
      {/* Editor */}
      <Bar x={1140} y={40} w={180} h={20} fill={C.barDark} />
      {["A", "B"].map((t, i) => (
        <g key={t}>
          <rect x={1140 + i * 96} y={84} width={84} height={36} rx={10} fill={i === 0 ? C.ink : C.bg} stroke={i === 0 ? C.ink : C.line} strokeWidth={2} />
          <text x={1182 + i * 96} y={108} textAnchor="middle" fontSize={16} fontWeight={600} fill={i === 0 ? "#ffffff" : C.ink} fontFamily="system-ui, sans-serif">
            {t}
          </text>
        </g>
      ))}
      <Card x={1140} y={146} w={430} h={56} r={12} />
      <Bar x={1164} y={168} w={260} h={12} />
      <Card x={1140} y={222} w={430} h={560} r={12} />
      {Array.from({ length: 10 }, (_, i) => (
        <Bar key={i} x={1164} y={252 + i * 44} w={[360, 340, 380, 200, 360, 320, 370, 280, 350, 160][i]} h={12} />
      ))}
      <rect x={1140} y={810} width={180} height={50} rx={12} fill={C.accent} />
    </g>
  );
}

function S3() {
  return (
    <g>
      <Sidebar />
      <Bar x={120} y={44} w={220} h={24} fill={C.barDark} />
      <Card x={120} y={100} w={820} h={620} />
      {Array.from({ length: 7 }, (_, c) => (
        <Bar key={c} x={160 + c * 110} y={136} w={50} h={12} />
      ))}
      {Array.from({ length: 35 }, (_, i) => {
        const c = i % 7;
        const r = Math.floor(i / 7);
        const x = 150 + c * 110;
        const y = 176 + r * 104;
        const booked = i === 17;
        return (
          <g key={i}>
            <rect x={x} y={y} width={94} height={88} rx={12} fill={booked ? C.accent : c > 4 ? C.panel : C.bg} stroke={booked ? C.accent : C.line} strokeWidth={2} />
            <rect x={x + 12} y={y + 12} width={22} height={12} rx={6} fill={booked ? "#ffffff" : C.bar} opacity={booked ? 0.9 : 1} />
          </g>
        );
      })}
      <Card x={120} y={750} w={820} h={200} fill={C.panel} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={150 + i * 196} y={790} width={176} height={52} rx={12} fill={i === 1 ? C.tint : C.bg} stroke={i === 1 ? C.accent : C.line} strokeWidth={2} />
      ))}
      <Bar x={150} y={876} w={420} h={14} />
      {/* Brief */}
      <Card x={980} y={100} w={590} h={850} />
      <rect x={1010} y={132} width={110} height={30} rx={15} fill={C.successTint} stroke="#9ad9b0" strokeWidth={2} />
      <Bar x={1030} y={141} w={70} h={12} fill="#86d19f" />
      <Bar x={1010} y={190} w={320} h={24} fill={C.barDark} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={1010} y={250 + i * 136} width={28} height={28} rx={8} fill={C.tint} />
          <Bar x={1054} y={256 + i * 136} w={180} h={16} fill={C.barDark} />
          <Bar x={1054} y={290 + i * 136} w={460} h={12} />
          <Bar x={1054} y={316 + i * 136} w={380 - i * 30} h={12} />
        </g>
      ))}
    </g>
  );
}

function S4() {
  const bars = [0.55, 0.72, 0.48, 0.86, 0.64, 0.92, 0.7, 0.58, 0.8, 0.66, 0.88, 0.76];
  return (
    <g>
      <Sidebar />
      <Bar x={120} y={44} w={240} h={24} fill={C.barDark} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Card x={120 + i * 366} y={100} w={346} h={150} />
          <Bar x={148 + i * 366} y={130} w={120} h={12} />
          <Bar x={148 + i * 366} y={166} w={140} h={36} r={10} fill={i === 0 ? C.accent : C.barDark} />
          <Bar x={148 + i * 366} y={218} w={80} h={10} fill={i === 1 ? "#86d19f" : C.bar} />
        </g>
      ))}
      <Card x={120} y={280} w={900} h={660} />
      <Bar x={152} y={314} w={200} h={18} fill={C.barDark} />
      {bars.map((h, i) => {
        const height = h * 440;
        return <rect key={i} x={170 + i * 70} y={880 - height} width={40} height={height} rx={8} fill={i === 9 ? C.accent : "#c9d2ff"} />;
      })}
      <line x1={152} y1={882} x2={990} y2={882} stroke={C.line} strokeWidth={2} />
      <Card x={1050} y={280} w={520} h={660} />
      <Bar x={1080} y={314} w={160} h={18} fill={C.barDark} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <text x={1090} y={392 + i * 76} fontSize={16} fontWeight={600} fill={i === 0 ? C.accent : "#8a93a3"} fontFamily="system-ui, sans-serif">
            {i + 1}
          </text>
          <Avatar cx={1134} cy={386 + i * 76} r={18} fill={i === 0 ? "#b9c4ff" : C.barDark} />
          <Bar x={1166} y={372 + i * 76} w={120} h={12} fill={C.barDark} />
          <Bar x={1166} y={394 + i * 76} w={360 - i * 42} h={10} fill={i === 0 ? C.accent : "#dfe4ff"} />
        </g>
      ))}
    </g>
  );
}

function S5() {
  return (
    <g>
      <Sidebar />
      <Bar x={120} y={44} w={300} h={24} fill={C.barDark} />
      <Bar x={120} y={84} w={420} h={14} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <Card x={120} y={140 + i * 200} w={940} h={176} fill={i === 0 ? C.tint : C.bg} stroke={i === 0 ? "#c7cffc" : C.line} />
          <rect x={150} y={172 + i * 200} width={44} height={44} rx={12} fill={i === 0 ? C.accent : C.bg} stroke={i === 0 ? C.accent : C.barDark} strokeWidth={2} />
          <text x={172} y={201 + i * 200} textAnchor="middle" fontSize={18} fontWeight={700} fill={i === 0 ? "#ffffff" : C.ink} fontFamily="system-ui, sans-serif">
            {i + 1}
          </text>
          <Bar x={220} y={178 + i * 200} w={360 - i * 30} h={20} fill={C.barDark} />
          <Bar x={220} y={218 + i * 200} w={760} h={12} />
          <Bar x={220} y={244 + i * 200} w={640 - i * 60} h={12} />
          <rect x={220} y={274 + i * 200} width={120} height={24} rx={12} fill={C.bg} stroke={C.line} strokeWidth={2} />
        </g>
      ))}
      <Card x={1100} y={140} w={470} h={776} />
      <Bar x={1130} y={176} w={180} h={18} fill={C.barDark} />
      <circle cx={1335} cy={390} r={130} fill="none" stroke={C.surface} strokeWidth={44} />
      <circle cx={1335} cy={390} r={130} fill="none" stroke={C.accent} strokeWidth={44} strokeDasharray="520 900" transform="rotate(-90 1335 390)" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={1130} y={580 + i * 62} width={16} height={16} rx={4} fill={i === 0 ? C.accent : C.barDark} />
          <Bar x={1160} y={582 + i * 62} w={220 - i * 20} h={12} />
          <Bar x={1470} y={582 + i * 62} w={60} h={12} fill={C.barDark} />
        </g>
      ))}
    </g>
  );
}

function S6() {
  return (
    <g>
      <rect x={0} y={0} width={1600} height={88} fill={C.bg} />
      <line x1={0} y1={88} x2={1600} y2={88} stroke={C.line} strokeWidth={2} />
      <circle cx={64} cy={44} r={20} fill={C.barDark} />
      <Bar x={100} y={36} w={180} h={16} fill={C.barDark} />
      {[0, 1, 2, 3].map((i) => (
        <Bar key={i} x={760 + i * 170} y={38} w={120} h={12} fill={i === 1 ? C.accent : C.bar} />
      ))}
      <Bar x={64} y={134} w={380} h={28} fill={C.barDark} />
      <Bar x={64} y={178} w={260} h={14} />
      <rect x={1330} y={130} width={206} height={48} rx={12} fill={C.bg} stroke={C.line} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Card x={64 + i * 500} y={230} w={472} h={150} />
          <Bar x={96 + i * 500} y={262} w={140} h={12} />
          <Bar x={96 + i * 500} y={296} w={150} h={40} r={10} fill={i === 1 ? C.success : C.barDark} />
        </g>
      ))}
      <Card x={64} y={410} w={900} h={530} />
      <Bar x={96} y={444} w={220} h={18} fill={C.barDark} />
      {[520, 620, 720, 820].map((y) => (
        <line key={y} x1={96} y1={y} x2={930} y2={y} stroke={C.surface} strokeWidth={2} />
      ))}
      <path
        d="M 100 860 C 190 820, 240 800, 320 760 S 460 700, 540 690 S 690 600, 760 580 S 880 520, 930 500"
        fill="none"
        stroke={C.accent}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <circle cx={930} cy={500} r={9} fill={C.accent} />
      <Card x={994} y={410} w={542} h={530} />
      <Bar x={1026} y={444} w={200} h={18} fill={C.barDark} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <circle cx={1040} cy={514 + i * 70} r={7} fill={i < 4 ? C.success : C.barDark} />
          <Bar x={1062} y={500 + i * 70} w={200} h={12} fill={C.barDark} />
          <Bar x={1062} y={522 + i * 70} w={130} h={10} />
          <Bar x={1410} y={508 + i * 70} w={96} h={12} />
        </g>
      ))}
    </g>
  );
}

const SCENES: Record<ScreenshotId, () => ReactNode> = { S1, S2, S3, S4, S5, S6 };

export function ScreenshotSkeleton({ id }: { id: ScreenshotId }) {
  const Scene = SCENES[id];
  return (
    <svg viewBox="0 0 1600 1000" className="block h-auto w-full" aria-hidden focusable="false">
      <rect width={1600} height={1000} fill={C.bg} />
      <Scene />
    </svg>
  );
}
