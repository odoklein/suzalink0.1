import { getLocale } from "next-intl/server";
import { getContent, MODULE_ORDER, SOLUTION_ORDER } from "@/content";
import type { StaticPathname } from "@/i18n/routing";
import { Icon } from "../ui/Icon";
import { HeaderClient, type NavItem } from "./HeaderClient";

export async function SiteHeader() {
  const locale = (await getLocale()) as "fr";
  const { ui, modules, solutions } = getContent(locale);

  const features: NavItem[] = MODULE_ORDER.map((slug) => ({
    href: modules[slug].path,
    label: modules[slug].name,
    blurb: modules[slug].navBlurb,
    icon: <Icon name={modules[slug].icon} className="size-[18px]" />,
  }));

  const solutionItems: NavItem[] = [
    ...SOLUTION_ORDER.map((slug) => ({
      href: solutions[slug].path,
      label: solutions[slug].name,
      blurb: solutions[slug].navBlurb,
      icon: <Icon name={solutions[slug].icon} className="size-[18px]" />,
    })),
  ];

  const resources: NavItem[] = ui.header.resourcesItems.map((item, i) => ({
    href: item.href as StaticPathname,
    label: item.label,
    blurb: item.blurb,
    icon: <Icon name={(["flag", "plug", "shield", "building"] as const)[i]} className="size-[18px]" />,
  }));

  return (
    <HeaderClient
      features={features}
      solutions={solutionItems}
      resources={resources}
      labels={{
        skip: ui.header.skip,
        home: ui.header.home,
        features: ui.header.features,
        featuresAll: ui.header.featuresAll,
        featuresAllBlurb: ui.header.featuresAllBlurb,
        integrations: ui.header.integrations,
        solutions: ui.header.solutions,
        pricing: ui.header.pricing,
        surMesure: ui.header.surMesure,
        resources: ui.header.resources,
        resourcesSoon: ui.header.resourcesSoon,
        soon: ui.badges.soon,
        menu: ui.header.menu,
        closeMenu: ui.header.closeMenu,
        login: ui.cta.login,
        demo: ui.cta.demo,
        trial: ui.cta.trialShort,
        trialLong: ui.cta.trial,
      }}
    />
  );
}
