"use client";

import { NextIntlClientProvider } from "next-intl";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "en" | "hi" | "te" | "ta" | "kn" | "mr" | "or" | "bn" | "ml" | "gu";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useAppLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useAppLocale must be used within ClientIntlProvider");
  }
  return ctx;
}

async function loadMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

export function ClientIntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("locale");
    if (
      stored === "en" ||
      stored === "hi" ||
      stored === "te" ||
      stored === "ta" ||
      stored === "kn" ||
      stored === "mr" ||
      stored === "or" ||
      stored === "bn" ||
      stored === "ml" ||
      stored === "gu"
    ) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadMessages(locale).then((nextMessages) => {
      if (cancelled) return;
      setMessages(nextMessages as Record<string, unknown>);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const ctxValue = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (nextLocale) => {
        setLocaleState(nextLocale);
        window.localStorage.setItem("locale", nextLocale);
      },
    }),
    [locale]
  );

  if (!messages) return null;

  return (
    <LocaleContext.Provider value={ctxValue}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
