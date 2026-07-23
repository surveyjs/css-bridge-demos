/**
 * The shadcn SurveyJS adapter stylesheet, addressed as a plain URL.
 *
 * Each visual style has a self-contained adapter bundle (base + style deltas),
 * copied to `public/survey-adapters/<id>.css` by scripts/copy-survey-adapters.mjs.
 * Exactly one is active at a time; switching styles swaps the <link>'s href.
 *
 * App-local SurveyJS overrides (custom chrome the adapters cannot cover) live in
 * `public/survey-overrides/shadcn.css` (always on) plus optional
 * `public/survey-overrides/<id>.css` (swapped on the same visual-style id),
 * AFTER the adapter so host overrides win by source order.
 *
 * They are NOT webpack `import()`s: the active style is read from localStorage,
 * so a bundler-loaded stylesheet could not land until after hydration — the
 * survey painted with stock survey-core V3 styling and then re-skinned on every
 * hard refresh. A <link> created by the pre-paint script below is render-blocking
 * instead, so the adapter (and overrides) are in force at first paint.
 */
import { DEFAULT_STYLE_ID, STYLE_STORAGE_KEY, VISUAL_STYLES, type VisualStyleId } from "./styles";

export const SURVEY_ADAPTER_LINK_ID = "shadcn-survey-adapter-css";
export const SURVEY_OVERRIDES_SHARED_HREF = "/survey-overrides/shadcn.css";
export const SURVEY_OVERRIDES_SHARED_LINK_ID = "shadcn-survey-overrides-shared-css";
export const SURVEY_OVERRIDES_LINK_ID = "shadcn-survey-overrides-css";

export function surveyAdapterHref(style: VisualStyleId): string {
  return `/survey-adapters/${style}.css`;
}

export function surveyOverridesHref(style: VisualStyleId): string {
  return `/survey-overrides/${style}.css`;
}

/**
 * Pre-paint <link> bootstrap, inlined into <head> by the root layout. Reads the
 * persisted visual style and creates the adapter + shared overrides + per-style
 * overrides stylesheet <link>s while the document is still parsing — which is
 * what makes them render-blocking.
 *
 * The links are owned outside React (ShadcnSurveyAdapterStyles mutates the same
 * elements by id), so nothing is server-rendered for React to diff. Kept
 * dependency-free and defensive; mirrors the style/base-color/theme/radius
 * attribute script alongside it.
 */
export function surveyAdapterBootstrapScript(): string {
  const ids = VISUAL_STYLES.map((s) => s.id);
  return `(function(){try{
var ids=${JSON.stringify(ids)};
var s=localStorage.getItem(${JSON.stringify(STYLE_STORAGE_KEY)});
if(ids.indexOf(s)===-1)s=${JSON.stringify(DEFAULT_STYLE_ID)};
function link(id){var l=document.getElementById(id);if(!l){l=document.createElement("link");l.id=id;l.rel="stylesheet";document.head.appendChild(l);}return l;}
link(${JSON.stringify(SURVEY_ADAPTER_LINK_ID)}).setAttribute("href","/survey-adapters/"+s+".css");
link(${JSON.stringify(SURVEY_OVERRIDES_SHARED_LINK_ID)}).setAttribute("href",${JSON.stringify(SURVEY_OVERRIDES_SHARED_HREF)});
link(${JSON.stringify(SURVEY_OVERRIDES_LINK_ID)}).setAttribute("href","/survey-overrides/"+s+".css");
}catch(e){}})();`;
}
