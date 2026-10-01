import { describe, expect, it } from "vitest";
import { PEOPLE, personSlug } from "./visuals";

describe("personSlug", () => {
  it("drops accents and joins words with hyphens", () => {
    expect(personSlug("Jean-François Manier")).toBe("jean-francois-manier");
    expect(personSlug("Odo Klein")).toBe("odo-klein");
  });

  it("matches a portrait key for everyone named on the site", () => {
    for (const name of ["Hichem Hammouche", "Amine Hallab", "Odo Klein"]) {
      expect(Object.keys(PEOPLE)).toContain(personSlug(name));
    }
  });
});
