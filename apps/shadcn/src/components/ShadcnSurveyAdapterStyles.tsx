"use client";

import { useEffect } from "react";
import { SURVEY_ADAPTER_LINK_ID, surveyAdapterHref } from "@/lib/surveyAdapterCss";
import { useStyle } from "./StyleProvider";

/**
 * Points the survey adapter <link> at the active visual style's bundle. Each
 * bundle is self-contained (base + style deltas), so switching the style is just
 * an href swap.
 *
 * The <link> itself is created before paint by the inline script in the root
 * layout — this only re-points it after a style change, so there is no window in
 * which the survey renders unadapted.
 */
export function ShadcnSurveyAdapterStyles() {
  const { style } = useStyle();

  useEffect(() => {
    const link = document.getElementById(SURVEY_ADAPTER_LINK_ID);
    if (link instanceof HTMLLinkElement) {
      link.setAttribute("href", surveyAdapterHref(style));
    }
  }, [style]);

  return null;
}
