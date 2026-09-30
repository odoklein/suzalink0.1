import { describe, expect, it } from "vitest";
import { localizePath } from "@/i18n/paths";
import { isPersonalEmail, scoreLead } from "./leads";

describe("isPersonalEmail", () => {
  it("flags consumer mailboxes, not company domains", () => {
    expect(isPersonalEmail("jean@gmail.com")).toBe(true);
    expect(isPersonalEmail("Jean@Orange.fr")).toBe(true);
    expect(isPersonalEmail("jean@suzaliconseil.com")).toBe(false);
  });
});

describe("scoreLead", () => {
  it("marks a 6–10 team with a pro email, phone and pricing visit as hot", () => {
    expect(scoreLead({ teamSize: "6-10", email: "a@acme.fr", phone: "0601020304", visitedPricing: true }).hot).toBe(true);
  });

  it("keeps a solo lead with a personal email in the nurture", () => {
    expect(scoreLead({ teamSize: "1", email: "a@gmail.com" }).hot).toBe(false);
  });
});

describe("localizePath", () => {
  it("keeps French at the root", () => {
    expect(localizePath("/")).toBe("/");
    expect(localizePath("/tarifs")).toBe("/tarifs");
    expect(localizePath({ pathname: "/sur-mesure", hash: "contact" })).toBe("/sur-mesure#contact");
    expect(localizePath({ pathname: "/accueil/[audience]", params: { audience: "agences" } })).toBe("/accueil/agences");
  });
});
