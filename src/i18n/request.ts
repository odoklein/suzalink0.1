import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Page copy lives in typed modules under src/content/<locale>, not in JSON
// messages, so next-intl only handles the locale, routing and formats here.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return { locale, messages: {}, timeZone: "Europe/Paris" };
});
