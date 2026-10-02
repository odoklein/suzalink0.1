import { ArrowUpRight, MapPin } from "lucide-react";
import { getLocale } from "next-intl/server";
import { isShown } from "@/config/claims";
import { HUE, MODULE_HUE, SOLUTION_HUE } from "@/config/hues";
import { site } from "@/config/site";
import { getContent, MODULE_ORDER, resolveText, SOLUTION_ORDER } from "@/content";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Logo, Wordmark } from "./Logo";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{title}</p>
      <ul className="mt-5 space-y-3 text-small text-muted">{children}</ul>
    </div>
  );
}

const linkCls = "group/link inline-flex items-center gap-2 rounded transition-colors duration-200 hover:text-ink";

/** A footer link led by its module's colour dot, which grows on hover. */
function Dot({ className }: { className: string }) {
  return <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full transition-transform duration-300 ease-spring group-hover/link:scale-150", className)} />;
}

export async function SiteFooter() {
  const locale = (await getLocale()) as "fr";
  const { ui, modules, solutions } = getContent(locale);
  const f = ui.footer;
  const hosted = resolveText(f.hosted);

  return (
    <footer className="relative overflow-clip border-t border-line bg-white">
      {/* The thread, running along the top edge */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#3355ff_20%,#7a5cff_50%,#ff8a65_80%,transparent)] opacity-60" />
      <div className="container-site relative pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link href="/" aria-label={ui.header.home} className="inline-block rounded-lg">
              <Logo />
            </Link>
            <p className="mt-4 text-small text-muted">{f.pitch}</p>
            {hosted ? (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-small font-medium text-ink ring-1 ring-line">
                <MapPin aria-hidden className="size-4 text-accent" />
                {hosted.text}
              </p>
            ) : null}
          </div>

          <Column title={f.modules}>
            {MODULE_ORDER.map((slug) => (
              <li key={slug}>
                <Link href={modules[slug].path} className={linkCls}>
                  <Dot className={HUE[MODULE_HUE[slug]].bg} />
                  {modules[slug].name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={f.solutions}>
            {SOLUTION_ORDER.map((slug) => (
              <li key={slug}>
                <Link href={solutions[slug].path} className={linkCls}>
                  <Dot className={HUE[SOLUTION_HUE[slug]].bg} />
                  {solutions[slug].name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sur-mesure" className={linkCls}>
                <Dot className="bg-ink" />
                {ui.header.surMesure}
              </Link>
            </li>
          </Column>

          <Column title={f.company}>
            {f.companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href as StaticPathname} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={f.legal}>
            {f.legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href as StaticPathname} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className={linkCls}>{f.cookieSettings}</CookieSettingsButton>
            </li>
          </Column>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-small text-muted md:flex-row md:items-center md:justify-between">
          <p>{f.rights}</p>
          <div className="flex items-center gap-6">
            {/* The status page ships with dependency #15, same as the uptime claim. */}
            {isShown("uptime-99") ? (
              <a href={site.statusUrl} className={cn(linkCls, "rounded-full bg-mint-soft px-3 py-1 font-medium text-mint-ink hover:text-mint-ink")}>
                <span aria-hidden className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping-soft rounded-full bg-mint" />
                  <span className="relative size-2 rounded-full bg-mint" />
                </span>
                {f.status}
              </a>
            ) : null}
            <a href={site.linkedinUrl} className={linkCls} rel="noopener">
              {f.linkedin}
              <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* The name at poster size, sinking below the fold of the page */}
      <div aria-hidden className="pointer-events-none relative -mb-[3.2vw] select-none px-[2vw]">
        <svg className="absolute size-0">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#3355ff" />
              <stop offset="0.5" stopColor="#7a5cff" />
              <stop offset="1" stopColor="#ff8a65" />
            </linearGradient>
          </defs>
        </svg>
        <Wordmark
          fill="url(#footer-wordmark)"
          className="block h-auto w-full opacity-[0.16] [mask-image:linear-gradient(to_bottom,#000_30%,transparent_95%)]"
        />
      </div>
    </footer>
  );
}
