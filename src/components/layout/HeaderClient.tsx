"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { appLinks } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { ButtonLink } from "../ui/Button";
import { CtaLink } from "../ui/CtaLink";
import { Logo } from "./Logo";

export type NavItem = { href: StaticPathname; label: string; blurb: string; icon: ReactNode };

type Labels = {
  skip: string;
  home: string;
  features: string;
  featuresAll: string;
  featuresAllBlurb: string;
  integrations: string;
  solutions: string;
  pricing: string;
  surMesure: string;
  resources: string;
  resourcesSoon: string;
  soon: string;
  menu: string;
  closeMenu: string;
  login: string;
  demo: string;
  trial: string;
  trialLong: string;
};

type MenuKey = "features" | "solutions" | "resources";

function MenuLink({ item, compact }: { item: NavItem; compact?: boolean }) {
  return (
    <Link
      href={item.href}
      className="group flex gap-3 rounded-[12px] p-3 transition-colors duration-150 hover:bg-surface focus-visible:bg-surface"
    >
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-tint text-accent ring-1 ring-inset ring-accent/10">
        {item.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-6 text-ink">{item.label}</span>
        {compact ? null : <span className="block text-sm leading-5 text-muted">{item.blurb}</span>}
      </span>
    </Link>
  );
}

export function HeaderClient({
  features,
  solutions,
  resources,
  labels,
}: {
  features: NavItem[];
  solutions: NavItem[];
  resources: NavItem[];
  labels: Labels;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close every menu when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      setMobileOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (open && navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, mobileOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const hoverOpen = (key: MenuKey | null) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(key), key ? 60 : 140);
  };

  const trigger = (key: MenuKey, label: string) => (
    <button
      type="button"
      aria-expanded={open === key}
      aria-controls={`menu-${key}`}
      onClick={() => setOpen(open === key ? null : key)}
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-[10px] px-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink",
        open === key && "bg-surface text-ink",
      )}
    >
      {label}
      <ChevronDown aria-hidden className={cn("size-4 text-muted transition-transform duration-200", open === key && "rotate-180")} />
    </button>
  );

  const panel = (key: MenuKey, className: string, children: ReactNode) => (
    <div
      id={`menu-${key}`}
      hidden={open !== key}
      className={cn("absolute top-full pt-3", className)}
      onMouseEnter={() => hoverOpen(key)}
      onMouseLeave={() => hoverOpen(null)}
    >
      <div className="rounded-[20px] bg-white p-3 shadow-[var(--shadow-lift)] ring-1 ring-line">{children}</div>
    </div>
  );

  return (
    <header data-scrolled={scrolled || undefined} className="sticky top-0 z-50">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        {labels.skip}
      </a>
      <div className="header-bar border-b border-transparent bg-white/80 py-4 backdrop-blur-md transition-[padding,box-shadow,background-color] duration-200">
        <div ref={navRef} className="container-site flex items-center gap-6">
          <Link href="/" aria-label={labels.home} className="shrink-0 rounded-lg">
            <Logo />
          </Link>

          <nav aria-label="Principale" className="hidden flex-1 items-center gap-0.5 lg:flex">
            <div className="relative" onMouseEnter={() => hoverOpen("features")} onMouseLeave={() => hoverOpen(null)}>
              {trigger("features", labels.features)}
              {panel(
                "features",
                "-left-4 w-[760px]",
                <div className="grid grid-cols-[1fr_220px] gap-3">
                  <div className="grid grid-cols-2 gap-0.5">
                    {features.map((item) => (
                      <MenuLink key={item.href} item={item} />
                    ))}
                  </div>
                  <div className="flex flex-col justify-between rounded-[14px] bg-surface p-4">
                    <div>
                      <p className="text-[15px] font-semibold text-ink">{labels.featuresAll}</p>
                      <p className="mt-1 text-sm text-muted">{labels.featuresAllBlurb}</p>
                    </div>
                    <div className="mt-6 space-y-2">
                      <Link href="/fonctionnalites" className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                        {labels.featuresAll} <ArrowRight aria-hidden className="size-4" />
                      </Link>
                      <Link href="/integrations" className="flex items-center gap-1.5 text-sm font-semibold text-ink hover:underline">
                        {labels.integrations} <ArrowRight aria-hidden className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>,
              )}
            </div>

            <div className="relative" onMouseEnter={() => hoverOpen("solutions")} onMouseLeave={() => hoverOpen(null)}>
              {trigger("solutions", labels.solutions)}
              {panel(
                "solutions",
                "left-1/2 w-[380px] -translate-x-1/2",
                <div className="grid gap-0.5">
                  {solutions.map((item) => (
                    <MenuLink key={item.href} item={item} />
                  ))}
                </div>,
              )}
            </div>

            <Link href="/tarifs" className="inline-flex h-9 items-center rounded-[10px] px-3 text-[15px] font-medium text-ink-soft hover:bg-surface hover:text-ink">
              {labels.pricing}
            </Link>
            <Link href="/sur-mesure" className="inline-flex h-9 items-center rounded-[10px] px-3 text-[15px] font-medium text-ink-soft hover:bg-surface hover:text-ink">
              {labels.surMesure}
            </Link>

            <div className="relative" onMouseEnter={() => hoverOpen("resources")} onMouseLeave={() => hoverOpen(null)}>
              {trigger("resources", labels.resources)}
              {panel(
                "resources",
                "left-1/2 w-[360px] -translate-x-1/2",
                <div className="grid gap-0.5">
                  {resources.map((item) => (
                    <MenuLink key={item.href} item={item} />
                  ))}
                  <p className="mx-3 mt-1 flex items-center justify-between border-t border-line pb-1 pt-3 text-sm text-muted">
                    {labels.resourcesSoon}
                    <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium ring-1 ring-line">{labels.soon}</span>
                  </p>
                </div>,
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a href={appLinks.login} className="hidden h-9 items-center rounded-[10px] px-3 text-[15px] font-medium text-ink-soft hover:bg-surface hover:text-ink lg:inline-flex">
              {labels.login}
            </a>
            <span className="hidden lg:contents">
              <CtaLink cta={{ kind: "demo" }} label={labels.demo} section="header" variant="secondary" size="sm" />
            </span>
            <CtaLink cta={{ kind: "trial" }} label={labels.trial} section="header" size="sm" variant="dark" />
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              aria-label={mobileOpen ? labels.closeMenu : labels.menu}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex size-9 items-center justify-center rounded-[10px] text-ink ring-1 ring-inset ring-line hover:bg-surface lg:hidden"
            >
              {mobileOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full h-[calc(100dvh-56px)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden"
      >
        <div className="container-site space-y-8 py-6">
          <MobileGroup title={labels.features}>
            {features.map((item) => (
              <MenuLink key={item.href} item={item} compact />
            ))}
            <Link href="/fonctionnalites" className="block px-3 py-2 text-sm font-semibold text-accent">
              {labels.featuresAll}
            </Link>
          </MobileGroup>
          <MobileGroup title={labels.solutions}>
            {solutions.map((item) => (
              <MenuLink key={item.href} item={item} compact />
            ))}
          </MobileGroup>
          <MobileGroup title={labels.resources}>
            <Link href="/tarifs" className="block rounded-[12px] px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-surface">
              {labels.pricing}
            </Link>
            <Link href="/sur-mesure" className="block rounded-[12px] px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-surface">
              {labels.surMesure}
            </Link>
            {resources.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-[12px] px-3 py-2.5 text-[15px] font-semibold text-ink hover:bg-surface">
                {item.label}
              </Link>
            ))}
          </MobileGroup>
          <div className="grid gap-3 border-t border-line pt-6">
            <CtaLink cta={{ kind: "trial" }} label={labels.trialLong} section="mobile_menu" size="lg" />
            <CtaLink cta={{ kind: "demo" }} label={labels.demo} section="mobile_menu" variant="secondary" size="lg" />
            <ButtonLink external={appLinks.login} variant="ghost" size="lg">
              {labels.login}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 px-3 text-small font-medium text-muted">{title}</p>
      <div className="grid gap-0.5">{children}</div>
    </div>
  );
}
