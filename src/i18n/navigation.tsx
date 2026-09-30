"use client";

import NextLink from "next/link";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { defaultLocale, type Locale } from "./config";
import { localizePath, type Href } from "./paths";

export { usePathname } from "next/navigation";
export type { Href } from "./paths";

const LocaleContext = createContext<Locale>(defaultLocale);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useSiteLocale(): Locale {
  return useContext(LocaleContext);
}

/**
 * Localized link. Takes an internal route ("/tarifs", or { pathname, hash })
 * and renders next/link with the public URL for the current locale. Keeps
 * next-intl out of the client bundle.
 */
export function Link({ href, locale, ...props }: Omit<ComponentProps<typeof NextLink>, "href" | "locale"> & { href: Href; locale?: Locale }) {
  const current = useContext(LocaleContext);
  return <NextLink href={localizePath(href, locale ?? current)} {...props} />;
}
