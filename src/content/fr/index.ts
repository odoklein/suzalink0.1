import { home } from "./home";
import { integrationCategories, integrations } from "./integrations";
import { modules } from "./modules";
import {
  about,
  changelog,
  demo,
  featuresOverview,
  integrationsPage,
  legalCommon,
  legalMeta,
  security,
  surMesure,
  trustTexts,
} from "./pages";
import { pricing } from "./pricing";
import { solutions } from "./solutions";
import { ui } from "./ui";

const fr = {
  ui,
  home,
  pricing,
  modules,
  solutions,
  featuresOverview,
  surMesure,
  integrationsPage,
  integrations,
  integrationCategories,
  security,
  about,
  demo,
  changelog,
  legalCommon,
  legalMeta,
  trustTexts,
};

export default fr;
export type Dictionary = typeof fr;
