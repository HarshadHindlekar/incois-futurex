import { getRequestConfig } from "next-intl/server";

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

export default getRequestConfig(async () => {
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
