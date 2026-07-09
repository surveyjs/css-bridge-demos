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
 * Stylesheets are emitted to /public/themes/<id>.css by scripts/copy-themes.mjs.
 */

export type ColorThemeId = "default" | "zephyr" | "cosmo" | "morph";
export type ColorMode = "light" | "dark";

export interface ColorTheme {
  readonly id: ColorThemeId;
  readonly label: string;
  /** One-line flavor text for the dropdown. */
  readonly description: string;
}

export const colorThemes: readonly ColorTheme[] = [
  { id: "default", label: "Bootstrap", description: "Stock Bootstrap 5 palette." },
  { id: "zephyr", label: "Zephyr", description: "Crisp, modern blue." },
  { id: "cosmo", label: "Cosmo", description: "Flat, ordered ocean blue." },
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
 */
export function themeBootstrapScript(): string {
  return `(function(){try{
var ids=${JSON.stringify(themeIds)};
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(ids.indexOf(t)===-1)t=${JSON.stringify(DEFAULT_THEME)};
var m=localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)});
if(m!=="light"&&m!=="dark")m=${JSON.stringify(DEFAULT_MODE)};
document.documentElement.setAttribute("data-bs-theme",m);
var l=document.getElementById(${JSON.stringify(THEME_LINK_ID)});
if(!l){l=document.createElement("link");l.id=${JSON.stringify(THEME_LINK_ID)};l.rel="stylesheet";document.head.appendChild(l);}
l.setAttribute("href","/themes/"+t+".css");
}catch(e){}})();`;
}
