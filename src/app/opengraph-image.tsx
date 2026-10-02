import { ImageResponse } from "next/og";

// Social card built in code (V11's layout: the line on the right, the title on the left).
// Swap the drawn line for the V11 file once it is generated.
export const alt = "Suzalink : moins d'onglets, plus de rendez-vous.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", position: "relative", fontFamily: "sans-serif" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
          <rect x="0" y="0" width="1200" height="630" fill="#ffffff" />
          <path d="M 700 520 C 820 520, 860 380, 960 400 S 1120 520, 1150 300 S 1040 120, 900 150" fill="none" stroke="#3355FF" strokeWidth="6" strokeLinecap="round" />
          <circle cx="700" cy="520" r="12" fill="#3355FF" />
          <rect x="850" y="100" width="110" height="100" rx="20" fill="#ffffff" stroke="#E5E7EB" strokeWidth="3" />
          <rect x="870" y="160" width="36" height="22" rx="6" fill="#3355FF" />
          <rect x="870" y="122" width="70" height="14" rx="7" fill="#EDF0F4" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#3355FF", display: "flex" }} />
            <div style={{ fontSize: 40, fontWeight: 700, color: "#0B1220", letterSpacing: -1 }}>Suzalink</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#0B1220", lineHeight: 1.05, letterSpacing: -2 }}>Moins d’onglets.</div>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#0B1220", lineHeight: 1.05, letterSpacing: -2 }}>Plus de rendez-vous.</div>
            <div style={{ fontSize: 28, color: "#5B6475", marginTop: 28 }}>La console d’exécution commerciale</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
