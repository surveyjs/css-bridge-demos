/**
 * App-local SurveyJS overrides for the MUI demo, addressed as a plain URL.
 *
 * The MUI SurveyJS adapter is a single package stylesheet (`mui.min.css`) that
 * remaps `--sjs2-*` onto `--mui-*` for every palette. Custom app components that
 * have no stock MUI counterpart still need host CSS; those live in
 * `public/survey-overrides/<palette-id>.css` and swap when the active palette
 * changes. Loaded AFTER the adapter so host overrides win by source order.
 *
 * Not a webpack `import()`: the active palette is read from MUI's persisted
 * color-scheme keys, so a bundler-loaded sheet would arrive after hydration.
 * A <link> created by the pre-paint script below is render-blocking instead.
 */
import {
  DEFAULT_PALETTE_ID,
  palettes,
  type PalettePreset,
} from "@/theme/palettes";

/** MUI Material defaultConfig.colorSchemeStorageKey (see InitColorSchemeScript). */
export const MUI_COLOR_SCHEME_STORAGE_KEY = "mui-color-scheme";

export const SURVEY_OVERRIDES_LINK_ID = "mui-survey-overrides-css";

export function surveyOverridesHref(paletteId: string): string {
  return `/survey-overrides/${paletteId}.css`;
}

/** Map a persisted light color-scheme key back to a palette id. */
export function paletteIdForLightScheme(
  lightColorScheme: string | undefined,
): string {
  return (
    palettes.find((p: PalettePreset) => p.lightKey === lightColorScheme)?.id ??
    DEFAULT_PALETTE_ID
  );
}

/**
 * Pre-paint <link> bootstrap, inlined into <head> by the root layout. Reads the
 * persisted light color scheme (palette axis) and creates the overrides
 * stylesheet <link> while the document is still parsing.
 *
 * The link is owned outside React (MuiSurveyOverridesStyles mutates the same
 * element by id). Kept dependency-free and defensive.
 */
export function surveyOverridesBootstrapScript(): string {
  const mapping = Object.fromEntries(
    palettes.map((p) => [p.lightKey, p.id]),
  ) as Record<string, string>;
  return `(function(){try{
var map=${JSON.stringify(mapping)};
var light=localStorage.getItem(${JSON.stringify(MUI_COLOR_SCHEME_STORAGE_KEY + "-light")});
var id=map[light]||${JSON.stringify(DEFAULT_PALETTE_ID)};
var l=document.getElementById(${JSON.stringify(SURVEY_OVERRIDES_LINK_ID)});
if(!l){l=document.createElement("link");l.id=${JSON.stringify(SURVEY_OVERRIDES_LINK_ID)};l.rel="stylesheet";document.head.appendChild(l);}
l.setAttribute("href","/survey-overrides/"+id+".css");
}catch(e){}})();`;
}
