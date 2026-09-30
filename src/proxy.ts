import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { isAudience } from "./config/audiences";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * `/?utm_audience=agences|equipes|solo` is rewritten to a pre-rendered home
 * variant, so the swapped hero line ships in the HTML (no flicker, no CLS).
 * The visitor's URL does not change.
 */
export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const audience = searchParams.get("utm_audience");

  if (pathname === "/" && isAudience(audience)) {
    const url = request.nextUrl.clone();
    url.pathname = `/accueil/${audience}`;
    return intl(new NextRequest(url, request));
  }

  return intl(request);
}

export const config = {
  // Skip API routes, Next internals, Vercel internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
