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
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODE_STORAGE_KEY,
  THEME_LINK_ID,
  THEME_STORAGE_KEY,
  themeHref,
  type ColorMode,
  type ColorThemeId,
} from "@/lib/themes";

interface ThemeContextValue {
  theme: ColorThemeId;
  mode: ColorMode;
  setTheme: (theme: ColorThemeId) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Bridges the pre-paint inline script (which already applied the persisted theme
 * to the DOM) with React state. We seed from the defaults for a stable SSR/first
 * render, then read the real values from the DOM/storage after mount to avoid a
 * hydration mismatch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorThemeId>(DEFAULT_THEME);
  const [mode, setModeState] = useState<ColorMode>(DEFAULT_MODE);

  // Sync state from what the inline script already applied (post-hydration).
  useEffect(() => {
    const link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    const current = link?.getAttribute("href")?.match(/\/themes\/(.+)\.css$/)?.[1];
    if (current) setThemeState(current as ColorThemeId);

    const domMode = document.documentElement.getAttribute("data-bs-theme");
    if (domMode === "light" || domMode === "dark") setModeState(domMode);
  }, []);

  const setTheme = useCallback((next: ColorThemeId) => {
    setThemeState(next);
    const link = document.getElementById(THEME_LINK_ID) as HTMLLinkElement | null;
    if (link) link.setAttribute("href", themeHref(next));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — runtime swap still applies */
    }
  }, []);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    document.documentElement.setAttribute("data-bs-theme", next);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
