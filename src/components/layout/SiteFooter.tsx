import { MapPin } from "lucide-react";
import { getLocale } from "next-intl/server";
import { isShown } from "@/config/claims";
import { site } from "@/config/site";
import { getContent, MODULE_ORDER, resolveText, SOLUTION_ORDER } from "@/content";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { Logo } from "./Logo";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-small font-semibold text-ink">{title}</p>
      <ul className="mt-4 space-y-2.5 text-small text-muted">{children}</ul>
    </div>
  );
}

const linkCls = "rounded hover:text-ink";

export async function SiteFooter() {
  const locale = (await getLocale()) as "fr";
  const { ui, modules, solutions } = getContent(locale);
  const f = ui.footer;
  const hosted = resolveText(f.hosted);

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-site py-16 md:py-20">
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
                  {modules[slug].name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={f.solutions}>
            {SOLUTION_ORDER.map((slug) => (
              <li key={slug}>
                <Link href={solutions[slug].path} className={linkCls}>
                  {solutions[slug].name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sur-mesure" className={linkCls}>
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

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-small text-muted md:flex-row md:items-center md:justify-between">
          <p>{f.rights}</p>
          <div className="flex items-center gap-6">
            {/* The status page ships with dependency #15, same as the uptime claim. */}
            {isShown("uptime-99") ? (
              <a href={site.statusUrl} className={`inline-flex items-center gap-2 ${linkCls}`}>
                <span aria-hidden className="size-2 rounded-full bg-success" />
                {f.status}
              </a>
            ) : null}
            <a href={site.linkedinUrl} className={linkCls} rel="noopener">
              {f.linkedin}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
