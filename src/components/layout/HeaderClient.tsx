"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { appLinks } from "@/config/site";
import { HUE, type Hue } from "@/config/hues";
import { MASCOT } from "@/config/visuals";
import { Link, usePathname } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { vars } from "@/lib/style";
import { ButtonLink } from "../ui/Button";
import { CtaLink } from "../ui/CtaLink";
import { Logo } from "./Logo";

export type NavItem = { href: StaticPathname; label: string; blurb: string; icon: ReactNode; hue?: Hue };

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

function MenuLink({ item, compact, index = 0, open }: { item: NavItem; compact?: boolean; index?: number; open?: boolean }) {
  const h = HUE[item.hue ?? "accent"];
  return (
    <Link
      href={item.href}
      style={vars({ "--d": `${60 + index * 28}ms` })}
      className={cn(
        "group flex gap-3 rounded-[14px] p-3 transition-[background-color,opacity,translate] duration-500 ease-out-expo [transition-delay:0ms,var(--d),var(--d)] hover:bg-surface focus-visible:bg-surface",
        open === false ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
      )}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] ring-1 ring-inset transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:-rotate-6",
          h.soft,
          h.text,
          h.ring,
        )}
      >
        {item.icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-[15px] font-semibold leading-6 text-ink">
          {item.label}
          <ArrowRight aria-hidden className="size-3.5 -translate-x-1 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </span>
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
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });
  const navRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close every menu when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    hoverTimer.current = setTimeout(() => setOpen(key), key ? 60 : 160);
  };

  // The hover highlight glides to whichever top-level item the pointer is on.
  const glide = (el: HTMLElement) => setPill({ x: el.offsetLeft, w: el.offsetWidth, on: true });

  const trigger = (key: MenuKey, label: string) => (
    <button
      type="button"
      aria-expanded={open === key}
      aria-controls={`menu-${key}`}
      onClick={() => setOpen(open === key ? null : key)}
      onMouseEnter={(e) => glide(e.currentTarget)}
      onFocus={(e) => glide(e.currentTarget)}
      className={cn(
        "relative z-10 inline-flex h-9 items-center gap-1 rounded-[10px] px-3 text-[15px] font-medium transition-colors duration-200",
        open === key ? "text-ink" : "text-ink-soft hover:text-ink",
      )}
    >
      {label}
      <ChevronDown aria-hidden className={cn("size-4 text-muted transition-transform duration-300 ease-out-expo", open === key && "rotate-180 text-accent")} />
    </button>
  );

  const navLink = (href: StaticPathname, label: string) => (
    <Link
      href={href}
      onMouseEnter={(e) => glide(e.currentTarget)}
      onFocus={(e) => glide(e.currentTarget)}
      aria-current={pathname === href ? "page" : undefined}
      className="relative z-10 inline-flex h-9 items-center rounded-[10px] px-3 text-[15px] font-medium text-ink-soft transition-colors duration-200 hover:text-ink aria-[current=page]:text-accent"
    >
      {label}
    </Link>
  );

  const panel = (key: MenuKey, className: string, children: ReactNode) => (
    <div
      id={`menu-${key}`}
      inert={open !== key}
      className={cn(
        "absolute top-full origin-top pt-3 transition-[opacity,translate,scale,visibility] duration-300 ease-out-expo",
        open === key ? "visible translate-y-0 scale-100 opacity-100" : "pointer-events-none invisible -translate-y-1.5 scale-[0.985] opacity-0",
        className,
      )}
      onMouseEnter={() => hoverOpen(key)}
      onMouseLeave={() => hoverOpen(null)}
    >
      <div className="rounded-[22px] bg-white/95 p-3 shadow-[0_2px_4px_rgb(11_18_32/0.04),0_24px_60px_-20px_rgb(11_18_32/0.32)] ring-1 ring-ink/[0.07] backdrop-blur-xl">
        {children}
      </div>
    </div>
  );

  return (
    <header data-scrolled={scrolled || undefined} className="sticky top-0 z-50 [view-transition-name:site-header]">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        {labels.skip}
      </a>
      <div className={cn("transition-[padding] duration-500 ease-out-expo", scrolled ? "px-3 pt-2.5" : "px-0 pt-0")}>
        <div
          className={cn(
            "mx-auto transition-[max-width,padding,background-color,box-shadow,border-radius] duration-500 ease-out-expo",
            scrolled || mobileOpen
              ? "max-w-[1120px] rounded-[20px] bg-white/75 px-2 py-2 shadow-[0_1px_0_rgb(255_255_255/0.6)_inset,0_0_0_1px_rgb(11_18_32/0.07),0_18px_40px_-18px_rgb(11_18_32/0.28)] backdrop-blur-xl backdrop-saturate-150 sm:px-3"
              : "max-w-[1248px] rounded-none bg-transparent px-0 py-4",
          )}
        >
          <div ref={navRef} className={cn("flex items-center gap-6 transition-[padding] duration-500", scrolled || mobileOpen ? "px-2" : "px-6")}>
            <Link href="/" aria-label={labels.home} className="group shrink-0 rounded-lg">
              <Logo className="transition-transform duration-500 ease-spring group-hover:scale-[1.04]" />
            </Link>

            <nav
              aria-label="Principale"
              className="relative hidden flex-1 items-center gap-0.5 lg:flex"
              onMouseLeave={() => setPill((p) => ({ ...p, on: false }))}
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-9 rounded-[10px] bg-ink/[0.055] transition-[transform,width,opacity] duration-300 ease-out-expo"
                style={{ width: pill.w, transform: `translateX(${pill.x}px)`, opacity: pill.on || open ? 1 : 0 }}
              />
              <div className="relative" onMouseEnter={() => hoverOpen("features")} onMouseLeave={() => hoverOpen(null)}>
                {trigger("features", labels.features)}
                {panel(
                  "features",
                  "-left-4 w-[780px]",
                  <div className="grid grid-cols-[1fr_236px] gap-3">
                    <div className="grid grid-cols-2 gap-0.5">
                      {features.map((item, i) => (
                        <MenuLink key={item.href} item={item} index={i} open={open === "features"} />
                      ))}
                    </div>
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,#eef2ff_0%,#e9e3ff_48%,#ffe9df_100%)] p-5 ring-1 ring-inset ring-white/60">
                      <svg aria-hidden viewBox="-50 -50 100 100" className="pointer-events-none absolute -right-10 -top-8 size-44 text-accent/15">
                        <path
                          d="M35.72 -23.5 A36.5 36.5 0 0 0 -36.5 -16 C-36.5 0 -14 28.5 0 28.5 A11.5 11.5 0 0 0 11.5 17 C11.5 5 -11.5 -5 -11.5 -17 A11.5 11.5 0 0 1 0 -28.5 C14 -28.5 36.5 0 36.5 16 A36.5 36.5 0 0 1 -35.72 23.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={6}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="relative">
                        <p className="text-[15px] font-semibold text-ink">{labels.featuresAll}</p>
                        <p className="mt-1 text-sm text-muted">{labels.featuresAllBlurb}</p>
                      </div>
                      <Image
                        src={MASCOT.wave.src}
                        alt=""
                        width={MASCOT.wave.width}
                        height={MASCOT.wave.height}
                        sizes="72px"
                        className="pointer-events-none absolute -bottom-3 right-2 h-auto w-[72px] drop-shadow-[0_10px_14px_rgb(51_85_255/0.25)]"
                      />
                      <div className="relative mt-10 space-y-2">
                        <Link href="/fonctionnalites" className="group flex items-center gap-1.5 text-sm font-semibold text-accent">
                          {labels.featuresAll} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link href="/integrations" className="group flex items-center gap-1.5 text-sm font-semibold text-ink">
                          {labels.integrations} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
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
                  "left-1/2 w-[390px] -translate-x-1/2",
                  <div className="grid gap-0.5">
                    {solutions.map((item, i) => (
                      <MenuLink key={item.href} item={item} index={i} open={open === "solutions"} />
                    ))}
                  </div>,
                )}
              </div>

              {navLink("/tarifs", labels.pricing)}
              {navLink("/sur-mesure", labels.surMesure)}

              <div className="relative" onMouseEnter={() => hoverOpen("resources")} onMouseLeave={() => hoverOpen(null)}>
                {trigger("resources", labels.resources)}
                {panel(
                  "resources",
                  "left-1/2 w-[370px] -translate-x-1/2",
                  <div className="grid gap-0.5">
                    {resources.map((item, i) => (
                      <MenuLink key={item.href} item={item} index={i} open={open === "resources"} />
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
              <a
                href={appLinks.login}
                className="hidden h-9 items-center rounded-[10px] px-3 text-[15px] font-medium text-ink-soft transition-colors hover:bg-ink/[0.05] hover:text-ink lg:inline-flex"
              >
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
                className="relative inline-flex size-9 items-center justify-center rounded-[10px] text-ink ring-1 ring-inset ring-line transition-colors hover:bg-surface lg:hidden"
              >
                <span aria-hidden className="relative block h-3 w-4">
                  <span
                    className={cn(
                      "absolute left-0 h-[1.75px] w-4 rounded-full bg-current transition-[top,transform] duration-300 ease-out-expo",
                      mobileOpen ? "top-[5px] rotate-45" : "top-0.5",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 h-[1.75px] w-4 rounded-full bg-current transition-[top,transform] duration-300 ease-out-expo",
                      mobileOpen ? "top-[5px] -rotate-45" : "top-[8.5px]",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="menu-mobile"
        inert={!mobileOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 top-0 -z-10 overflow-y-auto overscroll-contain bg-white/90 pt-20 backdrop-blur-2xl transition-[opacity,visibility] duration-300 lg:hidden",
          mobileOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="container-site space-y-8 pb-10 pt-4">
          <MobileGroup title={labels.features} open={mobileOpen} index={0}>
            {features.map((item) => (
              <MenuLink key={item.href} item={item} compact />
            ))}
            <Link href="/fonctionnalites" className="block px-3 py-2 text-sm font-semibold text-accent">
              {labels.featuresAll}
            </Link>
          </MobileGroup>
          <MobileGroup title={labels.solutions} open={mobileOpen} index={1}>
            {solutions.map((item) => (
              <MenuLink key={item.href} item={item} compact />
            ))}
          </MobileGroup>
          <MobileGroup title={labels.resources} open={mobileOpen} index={2}>
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

function MobileGroup({ title, children, open, index }: { title: string; children: ReactNode; open: boolean; index: number }) {
  return (
    <div
      style={vars({ "--d": `${80 + index * 70}ms` })}
      className={cn(
        "transition-[opacity,translate] duration-500 ease-out-expo [transition-delay:var(--d)]",
        open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{title}</p>
      <div className="grid gap-0.5">{children}</div>
    </div>
  );
}
