"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import {
  type Dictionary,
  type Locale,
  LOCALE_META,
  getDictionary,
  formatMoney,
} from "./dictionaries";

// ─────────────────────────────────────────────────────────────
// External store backed by localStorage — read via
// useSyncExternalStore so SSR + hydration stay consistent and no
// setState-in-effect is needed.
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "mypets-locale";
const listeners = new Set<() => void>();
let cached: Locale | null = null;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function isLocale(v: unknown): v is Locale {
  return v === "pt-PT" || v === "pt-BR" || v === "en";
}

function getSnapshot(): Locale {
  if (cached) return cached;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) {
      cached = stored;
      return cached;
    }
  } catch {
    /* storage unavailable */
  }
  return "pt-PT";
}

function getServerSnapshot(): Locale {
  return "pt-PT";
}

function setStoredLocale(l: Locale) {
  cached = l;
  try {
    window.localStorage.setItem(STORAGE_KEY, l);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((cb) => cb());
}

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (l: Locale) => void;
  /** format cents with the current locale's intl + given currency */
  money: (cents: number, currency: "EUR" | "BRL") => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // keep <html lang> in sync with the active locale (external system)
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setStoredLocale(l), []);

  const money = useCallback(
    (cents: number, currency: "EUR" | "BRL") =>
      formatMoney(cents, currency, LOCALE_META[locale].intl),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, dict: getDictionary(locale), setLocale, money }),
    [locale, setLocale, money]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}
