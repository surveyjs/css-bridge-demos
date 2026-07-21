/**
 * App-local theme catalog for the Bootstrap shell chrome.
 *
 * This is host chrome config (an allowed per-app concern), not shared model
 * state, so it lives in the app rather than `@adapter/schemas`.
 *
 * Two independent axes:
 *  - `mode`  — light / dark, applied via `data-bs-theme` on <html>.
 *  - `theme` — color palette, applied by swapping the active stylesheet
 *              (vanilla Bootstrap or a Bootswatch theme). All ship `data-bs-theme=dark`
 *              variants, so a color theme and light/dark compose cleanly.
 *
 * Each theme is paired with a dedicated SurveyJS adapter bundle (`bootstrap-<id>`),
 * mirroring the shadcn app: swapping the theme swaps BOTH the Bootswatch chrome
 * stylesheet AND the matching survey adapter, keyed to the same id.
 *
 * Chrome stylesheets are emitted to /public/themes/<id>.css by scripts/copy-themes.mjs;
 * adapter bundles to /public/survey-adapters/<id>.css by scripts/copy-survey-adapters.mjs.
 * App-local SurveyJS overrides (custom chrome the adapters cannot cover) live in
 * /public/survey-overrides/<id>.css and swap on the same theme id.
 */

export type ColorThemeId =
  | "default"
  | "zephyr"
  | "cosmo"
  | "morph"
  | "flatly"
  | "darkly"
  | "lux"
  | "litera";
export type ColorMode = "light" | "dark";

export interface ColorTheme {
  readonly id: ColorThemeId;
  readonly label: string;
  /** One-line flavor text for the dropdown. */
  readonly description: string;
}

// Ordered by popularity: stock Bootstrap first (the baseline / default theme),
// then Bootswatch themes by how widely they're used.
export const colorThemes: readonly ColorTheme[] = [
  { id: "default", label: "Bootstrap", description: "Stock Bootstrap 5 palette." },
  { id: "flatly", label: "Flatly", description: "Flat, friendly teal." },
  { id: "darkly", label: "Darkly", description: "Bold dark slate." },
  { id: "cosmo", label: "Cosmo", description: "Flat, ordered ocean blue." },
  { id: "litera", label: "Litera", description: "Clean, readable neutral." },
  { id: "lux", label: "Lux", description: "Minimal, premium serif." },
  { id: "zephyr", label: "Zephyr", description: "Crisp, modern blue." },
  { id: "morph", label: "Morph", description: "Soft neumorphic purple." },
] as const;

export const DEFAULT_THEME: ColorThemeId = "default";
export const DEFAULT_MODE: ColorMode = "light";

export const THEME_STORAGE_KEY = "adapter:theme";
export const MODE_STORAGE_KEY = "adapter:mode";

const themeIds = colorThemes.map((t) => t.id);

export function isColorThemeId(value: unknown): value is ColorThemeId {
  return typeof value === "string" && (themeIds as string[]).includes(value);
}

export function isColorMode(value: unknown): value is ColorMode {
  return value === "light" || value === "dark";
}

export function themeHref(id: ColorThemeId): string {
  return `/themes/${id}.css`;
}

export const THEME_LINK_ID = "adapter-theme-css";

/**
 * The SurveyJS adapter bundle for a theme. Each theme ships its own
 * `bootstrap-<id>` adapter (base + theme deltas), copied to
 * /public/survey-adapters/<id>.css by scripts/copy-survey-adapters.mjs. Exactly
 * one is active at a time; switching themes swaps this <link>'s href in tandem
 * with the chrome stylesheet.
 */
export const SURVEY_ADAPTER_LINK_ID = "adapter-survey-css";

export function surveyAdapterHref(id: ColorThemeId): string {
  return `/survey-adapters/${id}.css`;
}

/**
 * App-local SurveyJS CSS for adapting the form to custom app components that
 * have no stock Bootstrap counterpart. Lives in /public/survey-overrides/<id>.css
 * (hand-authored; never overwritten by copy-survey-adapters). Loaded AFTER the
 * adapter so host overrides win by source order.
 */
export const SURVEY_OVERRIDES_LINK_ID = "adapter-survey-overrides-css";

export function surveyOverridesHref(id: ColorThemeId): string {
  return `/survey-overrides/${id}.css`;
}

/**
 * Inline script that reads the persisted theme + mode from localStorage and
 * applies them, preventing a flash of the wrong theme.
 *
 * It *creates* the stylesheet <link> imperatively rather than having React render
 * it. The link is owned entirely outside React (the ThemeProvider mutates the
 * same element by id), so there is no SSR/client markup for React to diff — which
 * avoids hydration mismatches around Next's auto-injected <head> tags. Kept
 * dependency-free and defensive.
 *
 * MUST be emitted as a raw parser-blocking <script> in <head> (see layout.tsx),
 * never via next/script: a <link> appended while the document is still loading is
 * render-blocking, which is what keeps `--bs-*` defined at first paint — and the
 * Bootstrap adapter is nothing but a mapping onto those tokens.
 *
 * It manages THREE links keyed to the same theme id: the Bootswatch chrome
 * stylesheet, the matching SurveyJS adapter bundle, and the app-local survey
 * overrides sheet — all in force at first paint (no unadapted flash of stock
 * survey-core V3 styling).
 */
export function themeBootstrapScript(): string {
  return `(function(){try{
var ids=${JSON.stringify(themeIds)};
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(ids.indexOf(t)===-1)t=${JSON.stringify(DEFAULT_THEME)};
var m=localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});
if(m!=="light"&&m!=="dark")m=${JSON.stringify(DEFAULT_MODE)};
document.documentElement.setAttribute("data-bs-theme",m);
function link(id){var l=document.getElementById(id);if(!l){l=document.createElement("link");l.id=id;l.rel="stylesheet";document.head.appendChild(l);}return l;}
link(${JSON.stringify(THEME_LINK_ID)}).setAttribute("href","/themes/"+t+".css");
link(${JSON.stringify(SURVEY_ADAPTER_LINK_ID)}).setAttribute("href","/survey-adapters/"+t+".css");
link(${JSON.stringify(SURVEY_OVERRIDES_LINK_ID)}).setAttribute("href","/survey-overrides/"+t+".css");
}catch(e){}})();`;
}
