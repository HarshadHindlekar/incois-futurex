import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export const locales = [
  "en",
  "hi",
  "te",
  "ta",
  "kn",
  "mr",
  "or",
  "bn",
  "ml",
  "gu",
] as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  te: "తెలుగు",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
  mr: "मराठी",
  or: "ଓଡ଼ିଆ",
  bn: "বাংলা",
  ml: "മലയാളം",
  gu: "ગુજરાતી",
};

export const defaultLocale: Locale = "en";

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");

  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2))
      .find((lang) => locales.includes(lang as Locale));

    if (preferredLocale) {
      return preferredLocale as Locale;
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
