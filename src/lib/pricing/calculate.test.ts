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
  it("prices every annual plan at −20 %, rounded down to the euro", () => {
    for (const id of PLAN_ORDER) {
      const { price, extraSeat } = PLANS[id];
      const expected = Math.floor((price.monthly * 12 * (1 - ANNUAL_DISCOUNT)) / 100) * 100;
      expect(price.annual).toBe(expected);
      if (extraSeat) {
        expect(extraSeat.annual).toBe(Math.floor((extraSeat.monthly * 12 * (1 - ANNUAL_DISCOUNT)) / 100) * 100);
      }
    }
  });

  it("shows the PRD's annual per-month figures on the cards", () => {
    expect(planMonthlyDisplay("solo", "annual")).toBe(6_300);
    expect(planMonthlyDisplay("equipe", "annual")).toBe(19_900);
    expect(planMonthlyDisplay("agence", "annual")).toBe(39_900);
  });
});

describe("recommendPlan", () => {
  it("picks the cheapest plan that fits the team", () => {
    expect(recommendPlan(1, false)).toBe("solo");
    expect(recommendPlan(2, false)).toBe("equipe");
    expect(recommendPlan(10, false)).toBe("equipe");
    expect(recommendPlan(11, false)).toBe("agence");
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
  it("prices Solo monthly", () => {
    const q = calculate(base);
    expect(q.plan).toBe("solo");
    expect(q.monthlyTotal).toBe(7_900);
    expect(q.annualTotal).toBe(94_800);
    expect(q.firstInvoice).toBe(7_900);
    expect(q.vatOnFirstInvoice).toBe(1_580);
  });

  it("prices a 5-person team with add-ons on monthly billing", () => {
    const q = calculate({ ...base, users: 5, voipUsers: 5, sourcingPack: "2000", extraMailboxes: 7 });
    expect(q.plan).toBe("equipe");
    expect(q.extraSeats).toBe(2);
    // 249 + 2×69 + 5×49 + 89 + 39 + 2×9 = 778 €
    expect(q.monthlyRecurring).toBe(77_800);
    expect(q.monthlyTotal).toBe(77_800);
    expect(q.annualTotal).toBe(933_600);
    expect(q.firstInvoice).toBe(77_800);
  });

  it("bills plan and seats yearly and add-ons monthly on annual billing", () => {
    const q = calculate({ ...base, users: 5, voipUsers: 2, billing: "annual" });
    // plan 2 390 € + 2 seats × 662 € = 3 714 € a year; VoIP 2 × 49 € = 98 € a month
    expect(q.yearlyRecurring).toBe(371_400);
    expect(q.monthlyRecurring).toBe(9_800);
    expect(q.annualTotal).toBe(371_400 + 12 * 9_800);
    expect(q.firstInvoice).toBe(371_400 + 9_800);
    expect(q.monthlyTotal).toBe(Math.round((371_400 + 12 * 9_800) / 12));
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
