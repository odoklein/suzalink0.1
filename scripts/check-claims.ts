// Lists the claims that still block the public launch. Exits 1 if any remain.
// Run with: npm run check:claims
import { CLAIMS } from "../src/config/claims.ts";

const pending = Object.entries(CLAIMS).filter(([, c]) => !c.verified);

if (pending.length === 0) {
  console.log("All site claims are verified.");
  process.exit(0);
}

console.log(`${pending.length} claim(s) not verified yet:\n`);
for (const [id, c] of pending) {
  const fallback = c.whenUnverified === "soon" ? "shown as « Bientôt »" : "hidden";
  const dep = c.dependency ? `dependency #${c.dependency}` : "not in the PRD list";
  console.log(`  - ${id} (${dep}, ${fallback} in production)\n    ${c.statement}`);
}
process.exit(1);
