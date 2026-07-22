"use client";

import { useEffect } from "react";
import {
  SURVEY_ADAPTER_LINK_ID,
  SURVEY_OVERRIDES_LINK_ID,
  SURVEY_OVERRIDES_SHARED_LINK_ID,
  surveyAdapterHref,
  surveyOverridesHref,
} from "@/lib/surveyAdapterCss";
import { useStyle } from "./StyleProvider";

/**
 * Points the survey adapter + per-style overrides <link>s at the active visual
 * style's bundles. Each adapter bundle is self-contained (base + style deltas);
 * `shadcn.css` holds shared host tweaks (always on); `<id>.css` holds optional
 * per-style deltas. Switching the style swaps the adapter + per-style hrefs.
 *
 * The <link>s themselves are created before paint by the inline script in the
 * root layout — this only re-points them after a style change, so there is no
 * window in which the survey renders unadapted.
 */
export function ShadcnSurveyAdapterStyles() {
  const { style } = useStyle();

  useEffect(() => {
    const adapterLink = document.getElementById(SURVEY_ADAPTER_LINK_ID);
    if (adapterLink instanceof HTMLLinkElement) {
      adapterLink.setAttribute("href", surveyAdapterHref(style));
    }
    const sharedOverridesLink = document.getElementById(
      SURVEY_OVERRIDES_SHARED_LINK_ID,
    );
    const overridesLink = document.getElementById(SURVEY_OVERRIDES_LINK_ID);
    // Keep shared then per-style host overrides after the adapter sheet.
    if (sharedOverridesLink instanceof HTMLLinkElement) {
      document.head.appendChild(sharedOverridesLink);
    }
    if (overridesLink instanceof HTMLLinkElement) {
      overridesLink.setAttribute("href", surveyOverridesHref(style));
      document.head.appendChild(overridesLink);
    }
  }, [style]);

  return null;
}
