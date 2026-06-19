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
  DEFAULT_BASE_COLOR,
  BASE_COLOR_STORAGE_KEY,
  isBaseColorId,
  type BaseColorId,
} from "@/lib/baseColors";

/**
 * Base-color state — the second, independent shadcn theming axis, for the
 * `data-shadcn-base-color` attribute on <html> (the pure-color palette axis).
 * The attribute is applied before paint by the inline script in the root layout;
 * this provider keeps React state in sync and writes the attribute + localStorage
 * on change. Mirrors StyleProvider exactly.
 */
interface BaseColorContextValue {
  baseColor: BaseColorId;
  setBaseColor: (baseColor: BaseColorId) => void;
}

const BaseColorContext = createContext<BaseColorContextValue | null>(null);

function applyBaseColor(baseColor: BaseColorId) {
  document.documentElement.setAttribute("data-shadcn-base-color", baseColor);
}

export function BaseColorProvider({ children }: { children: ReactNode }) {
  // SSR/first-paint default avoids a hydration mismatch; the real value is
  // hydrated from localStorage in the effect below (the inline script already
  // applied the correct attribute, so there is no visual flash).
  const [baseColor, setBaseColorState] =
    useState<BaseColorId>(DEFAULT_BASE_COLOR);

  useEffect(() => {
    const stored = window.localStorage.getItem(BASE_COLOR_STORAGE_KEY);
    if (isBaseColorId(stored)) {
      setBaseColorState(stored);
      applyBaseColor(stored);
    }
  }, []);

  const setBaseColor = useCallback((next: BaseColorId) => {
    setBaseColorState(next);
    applyBaseColor(next);
    try {
      window.localStorage.setItem(BASE_COLOR_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — attribute still applied for this session */
    }
  }, []);

  return (
    <BaseColorContext.Provider value={{ baseColor, setBaseColor }}>
      {children}
    </BaseColorContext.Provider>
  );
}

export function useBaseColor(): BaseColorContextValue {
  const ctx = useContext(BaseColorContext);
  if (!ctx) throw new Error("useBaseColor must be used within <BaseColorProvider>");
  return ctx;
}
