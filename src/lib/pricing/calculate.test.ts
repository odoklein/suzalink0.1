import { describe, expect, it } from "vitest";
import { ANNUAL_DISCOUNT, PLANS, PLAN_ORDER } from "@/config/pricing.config";
import { calculate, recommendPlan, splitMailboxes, type CalculatorInput } from "./calculate";
import { planMonthlyDisplay } from "./format";

const base: CalculatorInput = {
  users: 1,
  voipUsers: 0,
  sourcingPack: "none",
  extraMailboxes: 0,
  billing: "monthly",
  multiClient: false,
};

describe("pricing config", () => {
  it("shows the strategy's annual per-month figures on the cards", () => {
    expect(planMonthlyDisplay("solo", "annual")).toBe(5_900);
    expect(planMonthlyDisplay("equipe", "annual")).toBe(18_900);
    expect(planMonthlyDisplay("agence", "annual")).toBe(41_900);
  });
});

describe("recommendPlan", () => {
  it("picks the cheapest plan that fits the team", () => {
    expect(recommendPlan(1, false)).toBe("solo");
    expect(recommendPlan(2, false)).toBe("equipe");
    expect(recommendPlan(7, false)).toBe("equipe");
    expect(recommendPlan(8, false)).toBe("agence");
    expect(recommendPlan(30, false)).toBe("agence");
  });

  it("forces Agence for multi-client work", () => {
    expect(recommendPlan(1, true)).toBe("agence");
  });
});

describe("splitMailboxes", () => {
  it("uses a 5-pack once singles would cost more", () => {
    expect(splitMailboxes(3)).toEqual({ packs: 0, singles: 3 }); // 27 € < 39 €
    expect(splitMailboxes(4)).toEqual({ packs: 0, singles: 4 }); // 36 € < 39 €
    expect(splitMailboxes(5)).toEqual({ packs: 1, singles: 0 });
    expect(splitMailboxes(7)).toEqual({ packs: 1, singles: 2 });
    expect(splitMailboxes(9)).toEqual({ packs: 1, singles: 4 });
    expect(splitMailboxes(20)).toEqual({ packs: 4, singles: 0 });
  });
});

describe("calculate", () => {
  it("prices Indépendant monthly", () => {
    const q = calculate(base);
    expect(q.plan).toBe("solo");
    expect(q.monthlyTotal).toBe(6_900);
    expect(q.annualTotal).toBe(82_800);
    expect(q.firstInvoice).toBe(6_900);
    expect(q.vatOnFirstInvoice).toBe(1_380);
  });

  it("prices a 5-person team with add-ons on monthly billing", () => {
    const q = calculate({ ...base, users: 5, voipUsers: 5, sourcingPack: "2000", extraMailboxes: 7 });
    expect(q.plan).toBe("equipe");
    expect(q.extraSeats).toBe(2);
    // 229 + 2×49 + 5×49 + 89 + 39 + 2×9 = 718 €
    expect(q.monthlyRecurring).toBe(71_800);
    expect(q.monthlyTotal).toBe(71_800);
    expect(q.annualTotal).toBe(861_600);
    expect(q.firstInvoice).toBe(71_800);
  });

  it("bills plan and seats yearly and add-ons monthly on annual billing", () => {
    const q = calculate({ ...base, users: 5, voipUsers: 2, billing: "annual" });
    // plan 2 268 € + 2 seats × 470 € = 3 208 € a year; VoIP 2 × 49 € = 98 € a month
    expect(q.yearlyRecurring).toBe(320_800);
    expect(q.monthlyRecurring).toBe(9_800);
    expect(q.annualTotal).toBe(320_800 + 12 * 9_800);
    expect(q.firstInvoice).toBe(320_800 + 9_800);
    expect(q.monthlyTotal).toBe(Math.round((320_800 + 12 * 9_800) / 12));
  });

  it("never covers more telephony users than the team has", () => {
    const q = calculate({ ...base, users: 2, voipUsers: 9 });
    expect(q.lines.find((l) => l.id === "voip")?.quantity).toBe(2);
  });

  it("clamps users to the calculator range", () => {
    expect(calculate({ ...base, users: 99 }).users).toBe(30);
    expect(calculate({ ...base, users: 0 }).users).toBe(1);
  });

  it("sums line items exactly", () => {
    const q = calculate({ ...base, users: 12, voipUsers: 12, sourcingPack: "5000", extraMailboxes: 13, billing: "annual" });
    const byInterval = (i: "month" | "year") => q.lines.filter((l) => l.interval === i).reduce((s, l) => s + l.quantity * l.unitAmount, 0);
    expect(q.monthlyRecurring).toBe(byInterval("month"));
    expect(q.yearlyRecurring).toBe(byInterval("year"));
  });
});
