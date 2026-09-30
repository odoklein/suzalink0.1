import { describe, expect, it } from "vitest";
import { typo, typoDeep } from "./typo";

const NBSP = String.fromCharCode(0xa0);
const NNBSP = String.fromCharCode(0x202f);

describe("typo", () => {
  it("puts a thin no-break space before ; ! ?", () => {
    expect(typo("Pas le temps de prospecter ?")).toBe(`Pas le temps de prospecter${NNBSP}?`);
    expect(typo("Oui ! Et non ;")).toBe(`Oui${NNBSP}! Et non${NNBSP};`);
  });

  it("puts a no-break space before a colon", () => {
    expect(typo("Appel, email, relance : tout part")).toBe(`Appel, email, relance${NBSP}: tout part`);
  });

  it("uses the typographic apostrophe between letters", () => {
    expect(typo("l'IA d'aujourd'hui")).toBe("l’IA d’aujourd’hui");
  });

  it("handles guillemets with or without spaces", () => {
    expect(typo("« Moins d'onglets »")).toBe(`«${NNBSP}Moins d’onglets${NNBSP}»`);
    expect(typo("«Recommandé»")).toBe(`«${NNBSP}Recommandé${NNBSP}»`);
  });

  it("binds units and groups thousands", () => {
    expect(typo("79 € par mois")).toBe(`79${NBSP}€ par mois`);
    expect(typo("99 % de disponibilité")).toBe(`99${NBSP}% de disponibilité`);
    expect(typo("60 000 appels")).toBe(`60${NNBSP}000 appels`);
    expect(typo("1 000 000 de contacts")).toBe(`1${NNBSP}000${NNBSP}000 de contacts`);
    expect(typo("30 min avec un expert")).toBe(`30${NBSP}min avec un expert`);
  });

  it("leaves URLs, times and query strings alone", () => {
    expect(typo("https://app.suzalink.com/inscription?plan=solo")).toBe(
      "https://app.suzalink.com/inscription?plan=solo",
    );
    expect(typo("9:00–18:00")).toBe("9:00–18:00");
  });

  it("does not merge two separate small numbers", () => {
    expect(typo("de 2 à 10")).toBe("de 2 à 10");
  });

  it("keeps compound words on one line, but not hyphens in URLs", () => {
    const WJ = String.fromCharCode(0x2060);
    expect(typo("Plus de rendez-vous.")).toBe(`Plus de rendez-${WJ}vous.`);
    expect(typo("Jean-François et c'est-à-dire")).toBe(`Jean-${WJ}François et c’est-${WJ}à-${WJ}dire`);
    expect(typo("Voir /fonctionnalites/rendez-vous")).toBe("Voir /fonctionnalites/rendez-vous");
    expect(typo(typo("rendez-vous"))).toBe(`rendez-${WJ}vous`);
  });
});

describe("typoDeep", () => {
  it("walks objects and arrays but skips href, id and slug", () => {
    const out = typoDeep({ id: "a b ?", href: "/x ?y", title: "Prêt ?", list: ["Oui !"] });
    expect(out).toEqual({ id: "a b ?", href: "/x ?y", title: `Prêt${NNBSP}?`, list: [`Oui${NNBSP}!`] });
  });

  it("leaves kebab-case identifiers alone so lookups keep working", () => {
    const out = typoDeep({ module: "rendez-vous", start: "demo-then-trial", title: "Le rendez-vous pris" });
    expect(out).toEqual({
      module: "rendez-vous",
      start: "demo-then-trial",
      title: `Le rendez-${String.fromCharCode(0x2060)}vous pris`,
    });
  });
});
