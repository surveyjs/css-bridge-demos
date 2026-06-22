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
  DEFAULT_RADIUS,
  RADIUS_STORAGE_KEY,
  isRadiusId,
  type RadiusId,
} from "@/lib/radii";

/**
 * Radius state — the third, independent shadcn theming axis, for the
 * `data-shadcn-radius` attribute on <html> (the corner-rounding axis). The
 * attribute is applied before paint by the inline script in the root layout;
 * this provider keeps React state in sync and writes the attribute + localStorage
 * on change. Mirrors StyleProvider / BaseColorProvider exactly.
 */
interface RadiusContextValue {
  radius: RadiusId;
  setRadius: (radius: RadiusId) => void;
}

const RadiusContext = createContext<RadiusContextValue | null>(null);

function applyRadius(radius: RadiusId) {
  document.documentElement.setAttribute("data-shadcn-radius", radius);
}

export function RadiusProvider({ children }: { children: ReactNode }) {
  // SSR/first-paint default avoids a hydration mismatch; the real value is
  // hydrated from localStorage in the effect below (the inline script already
  // applied the correct attribute, so there is no visual flash).
  const [radius, setRadiusState] = useState<RadiusId>(DEFAULT_RADIUS);

  useEffect(() => {
    const stored = window.localStorage.getItem(RADIUS_STORAGE_KEY);
    if (isRadiusId(stored)) {
      setRadiusState(stored);
      applyRadius(stored);
    }
  }, []);

  const setRadius = useCallback((next: RadiusId) => {
    setRadiusState(next);
    applyRadius(next);
    try {
      window.localStorage.setItem(RADIUS_STORAGE_KEY, next);
    } catch {
      /* storage unavailable — attribute still applied for this session */
    }
  }, []);

  return (
    <RadiusContext.Provider value={{ radius, setRadius }}>
      {children}
    </RadiusContext.Provider>
  );
}

export function useRadius(): RadiusContextValue {
  const ctx = useContext(RadiusContext);
  if (!ctx) throw new Error("useRadius must be used within <RadiusProvider>");
  return ctx;
}
