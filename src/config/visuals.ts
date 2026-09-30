/**
 * Generated visuals (V) and product screenshots (S). Until a file is
 * delivered, `src` stays null and the page renders a labelled placeholder.
 * Prompts and file names are logged in public/visuals/README.md.
 *
 * To add one: put the largest export (AVIF, WebP or PNG) in public/visuals
 * (or public/screenshots), then set `src` and its real width/height here.
 * next/image serves AVIF/WebP at every width.
 */
export type VisualId =
  | "V1" | "V2" | "V3a" | "V3b" | "V3c" | "V3d" | "V4" | "V5" | "V6" | "V7"
  | "V8a" | "V8b" | "V8c" | "V10" | "V11" | "V12" | "V13" | "V14";

export type ScreenshotId = "S1" | "S2" | "S3" | "S4" | "S5" | "S6";

type Asset = {
  /** French alt text. Empty string for decorative images. */
  alt: string;
  width: number;
  height: number;
  src: string | null;
  /** Short label shown on the placeholder. */
  label: string;
};

export const VISUALS: Record<VisualId, Asset> = {
  V1: { label: "Fond du hero", alt: "", width: 1536, height: 1024, src: "/visuals/v1-hero.webp" },
  V2: {
    label: "Outils éparpillés",
    alt: "Cinq outils éparpillés, puis réunis dans un seul panneau relié par une ligne bleue.",
    width: 1536,
    height: 1024,
    src: "/visuals/v2-outils.webp",
  },
  V3a: { label: "Importez", alt: "", width: 340, height: 340, src: "/visuals/v3a-importez.webp" },
  V3b: { label: "Appelez et écrivez", alt: "", width: 340, height: 340, src: "/visuals/v3b-appelez.webp" },
  V3c: { label: "Décrochez le rendez-vous", alt: "", width: 340, height: 340, src: "/visuals/v3c-rendez-vous.webp" },
  V3d: { label: "Prouvez les résultats", alt: "", width: 340, height: 340, src: "/visuals/v3d-resultats.webp" },
  V4: { label: "Appels", alt: "Un casque d'appel relié à une touche de clavier bleue.", width: 1254, height: 1254, src: "/visuals/v4-appels.webp" },
  V5: { label: "Emails", alt: "Trois enveloppes en arc et une jauge de préchauffage bleue.", width: 1254, height: 1254, src: "/visuals/v5-emails.webp" },
  V6: { label: "IA", alt: "Une boussole dont l'aiguille bleue désigne la prochaine action.", width: 1536, height: 1024, src: "/visuals/v6-ia.webp" },
  V7: { label: "Reporting partagé", alt: "Un rapport partagé entre deux écrans.", width: 1536, height: 1024, src: "/visuals/v7-reporting.webp" },
  V8a: { label: "Solo", alt: "Un bureau rangé avec un casque et un agenda.", width: 1536, height: 1024, src: "/visuals/v8a-solo.webp" },
  V8b: { label: "Équipe", alt: "Quatre bureaux reliés à un tableau de bord central.", width: 1536, height: 1024, src: "/visuals/v8b-equipe.webp" },
  V8c: { label: "Agence", alt: "Une agence centrale reliée à cinq clients.", width: 1536, height: 1024, src: "/visuals/v8c-agence.webp" },
  V10: { label: "Sur-mesure", alt: "Une rangée de casques menant à un agenda rempli.", width: 1437, height: 1024, src: "/visuals/v10-sur-mesure.webp" },
  V11: { label: "Partage social", alt: "", width: 1536, height: 1024, src: null },
  V12: { label: "Page introuvable", alt: "Un combiné décroché et un fil bleu emmêlé.", width: 1536, height: 1024, src: "/visuals/v12-404.webp" },
  V13: { label: "Couverture de guide", alt: "", width: 1024, height: 1536, src: null },
  V14: { label: "Bientôt", alt: "", width: 844, height: 844, src: "/visuals/v14-bientot.webp" },
};

export const SCREENSHOTS: Record<ScreenshotId, Asset> = {
  S1: {
    label: "Espace d'appel : file et script",
    alt: "L'espace d'appel de Suzalink avec la file des prochains contacts et le script d'appel.",
    width: 1600,
    height: 1000,
    src: null,
  },
  S2: {
    label: "Email Hub : éditeur de séquence",
    alt: "L'éditeur de séquences de l'Email Hub avec une variante A/B.",
    width: 1600,
    height: 1000,
    src: null,
  },
  S3: {
    label: "Réservation et fiche RDV",
    alt: "La prise de rendez-vous et la fiche RDV rédigée par l'IA.",
    width: 1600,
    height: 1000,
    src: null,
  },
  S4: {
    label: "Tableau de bord et classement",
    alt: "Le tableau de bord d'équipe et le classement des commerciaux.",
    width: 1600,
    height: 1000,
    src: null,
  },
  S5: {
    label: "Analyse IA Stratégique",
    alt: "L'Analyse IA Stratégique avec ses recommandations classées par priorité.",
    width: 1600,
    height: 1000,
    src: null,
  },
  S6: {
    label: "Portail client : rapport",
    alt: "Un rapport de campagne dans le portail client.",
    width: 1600,
    height: 1000,
    src: null,
  },
};
