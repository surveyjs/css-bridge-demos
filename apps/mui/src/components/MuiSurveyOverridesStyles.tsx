"use client";

import { useEffect } from "react";
import { useColorScheme } from "@mui/material/styles";
import {
  SURVEY_OVERRIDES_LINK_ID,
  paletteIdForLightScheme,
  surveyOverridesHref,
} from "@/lib/surveyOverridesCss";

/**
 * Points the app-local survey overrides <link> at the active palette's sheet.
 * The MUI adapter itself is a single import; only host overrides swap per palette.
 *
 * The <link> is created before paint by the inline script in the root layout —
 * this only re-points it after a palette change.
 */
export function MuiSurveyOverridesStyles() {
  const { lightColorScheme } = useColorScheme();
  const paletteId = paletteIdForLightScheme(lightColorScheme);

  useEffect(() => {
    const link = document.getElementById(SURVEY_OVERRIDES_LINK_ID);
    if (link instanceof HTMLLinkElement) {
      link.setAttribute("href", surveyOverridesHref(paletteId));
      // Keep host overrides after the webpack-imported MUI adapter in the cascade.
      document.head.appendChild(link);
    }
  }, [paletteId]);

  return null;
}
