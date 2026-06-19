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
  DEFAULT_STYLE_ID,
  STYLE_STORAGE_KEY,
  isVisualStyleId,
  type VisualStyleId,
} from "@/lib/styles";

/**
 * Visual-style state — the shadcn analog of next-themes' light/dark, but for the
 * `data-shadcn-style` attribute on <html> (the token-preset axis). The attribute
 * is applied before paint by the inline script in the root layout; this provider
 * keeps React state in sync and writes the attribute + localStorage on change.
 */
interface StyleContextValue {
  style: VisualStyleId;
  setStyle: (style: VisualStyleId) => void;
}

const StyleContext = createContext<StyleContextValue | null>(null);

function applyStyle(style: VisualStyleId) {
  document.documentElement.setAttribute("data-shadcn-style", style);
}

export function StyleProvider({ children }: { children: ReactNode }) {
  // SSR/first-paint default avoids a hydration mismatch; the real value is
  // hydrated from localStorage in the effect below (the inline script already
  // applied the correct attribute, so there is no visual flash).
  const [style, setStyleState] = useState<VisualStyleId>(DEFAULT_STYLE_ID);

  useEffect(() => {
    const stored = window.localStorage.getItem(STYLE_STORAGE_KEY);
    if (isVisualStyleId(stored)) {
      setStyleState(stored);
      applyStyle(stored);
    }
  }, []);

  const setStyle = useCallback((next: VisualStyleId) => {
    setStyleState(next);
    applyStyle(next);
    try {
      window.localStorage.setItem(STYLE_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — attribute still applied for this session */
    }
  }, []);

  return (
    <StyleContext.Provider value={{ style, setStyle }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyle(): StyleContextValue {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyle must be used within <StyleProvider>");
  return ctx;
}
