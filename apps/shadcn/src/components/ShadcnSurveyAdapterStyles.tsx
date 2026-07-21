"use client";

import { useEffect } from "react";
import {
  SURVEY_ADAPTER_LINK_ID,
  SURVEY_OVERRIDES_LINK_ID,
  surveyAdapterHref,
  surveyOverridesHref,
} from "@/lib/surveyAdapterCss";
import { useStyle } from "./StyleProvider";

/**
 * Points the survey adapter + app-local overrides <link>s at the active visual
 * style's bundles. Each adapter bundle is self-contained (base + style deltas);
 * overrides hold host-only SurveyJS tweaks the adapter cannot cover. Switching
 * the style is just an href swap on both links.
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
    const overridesLink = document.getElementById(SURVEY_OVERRIDES_LINK_ID);
    if (overridesLink instanceof HTMLLinkElement) {
      overridesLink.setAttribute("href", surveyOverridesHref(style));
      // Keep host overrides after the adapter sheet in the cascade.
      document.head.appendChild(overridesLink);
    }
  }, [style]);

  return null;
}
