import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}, la console d'exécution commerciale`,
    short_name: site.name,
    description: site.tagline,
    lang: "fr-FR",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#3355FF",
    icons: [{ src: "/brand/suzalink-app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
