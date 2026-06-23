"use client";

import { useEffect } from "react";
import { SURVEY_ADAPTER_STYLE_LOADERS } from "@/lib/surveyAdapterCss";
import type { VisualStyleId } from "@/lib/styles";
import { useStyle } from "./StyleProvider";

const LOADED_LINKS = new Map<VisualStyleId, HTMLLinkElement>();

function setActiveAdapterStyle(style: VisualStyleId) {
  for (const [id, link] of LOADED_LINKS) {
    link.disabled = id !== style;
  }
}

/**
 * Loads exactly one shadcn survey adapter stylesheet from survey-core at a time.
 * Each adapter bundle is self-contained (base + style deltas), so switching the
 * visual style swaps which bundle is enabled.
 */
export function ShadcnSurveyAdapterStyles() {
  const { style } = useStyle();

  useEffect(() => {
    const cached = LOADED_LINKS.get(style);
    if (cached) {
      setActiveAdapterStyle(style);
      return;
    }

    const knownLinks = new Set(
      Array.from(document.querySelectorAll('link[rel="stylesheet"]')),
    );

    let cancelled = false;
    void SURVEY_ADAPTER_STYLE_LOADERS[style]().then(() => {
      if (cancelled) return;

      const newLink = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]'),
      ).find((link) => !knownLinks.has(link));

      if (newLink instanceof HTMLLinkElement) {
        newLink.dataset.shadcnSurveyAdapter = style;
        LOADED_LINKS.set(style, newLink);
      }

      setActiveAdapterStyle(style);
    });

    return () => {
      cancelled = true;
    };
  }, [style]);

  return null;
}
