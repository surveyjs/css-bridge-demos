"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME_ID,
  THEME_STORAGE_KEY,
  isThemeId,
  type ThemeId,
} from "@/lib/themes";

/**
 * Theme (accent) state — the fourth, independent shadcn theming axis, for the
 * `data-shadcn-theme` attribute on <html> (the chromatic accent axis: the
 * `--primary` / `--ring` family). The attribute is applied before paint by the
 * inline script in the root layout; this provider keeps React state in sync and
 * writes the attribute + localStorage on change. Mirrors BaseColorProvider /
 * RadiusProvider exactly.
 */
interface ThemeColorContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeColorContext = createContext<ThemeColorContextValue | null>(null);

function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute("data-shadcn-theme", theme);
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  // SSR/first-paint default avoids a hydration mismatch; the real value is
  // hydrated from localStorage in the effect below (the inline script already
  // applied the correct attribute, so there is no visual flash).
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME_ID);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) {
      setThemeState(stored);
      applyTheme(stored);
    }
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — attribute still applied for this session */
    }
  }, []);

  return (
    <ThemeColorContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor(): ThemeColorContextValue {
  const ctx = useContext(ThemeColorContext);
  if (!ctx)
    throw new Error("useThemeColor must be used within <ThemeColorProvider>");
  return ctx;
}
