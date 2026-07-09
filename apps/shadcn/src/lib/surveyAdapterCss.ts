/**
 * The shadcn SurveyJS adapter stylesheet, addressed as a plain URL.
 *
 * Each visual style has a self-contained adapter bundle (base + style deltas),
 * copied to `public/survey-adapters/<id>.css` by scripts/copy-survey-adapters.mjs.
 * Exactly one is active at a time; switching styles swaps the <link>'s href.
 *
 * They are NOT webpack `import()`s: the active style is read from localStorage,
 * so a bundler-loaded stylesheet could not land until after hydration — the
 * survey painted with stock survey-core V3 styling and then re-skinned on every
 * hard refresh. A <link> created by the pre-paint script below is render-blocking
 * instead, so the adapter is in force at first paint.
 */
import { DEFAULT_STYLE_ID, STYLE_STORAGE_KEY, VISUAL_STYLES, type VisualStyleId } from "./styles";

export const SURVEY_ADAPTER_LINK_ID = "shadcn-survey-adapter-css";

export function surveyAdapterHref(style: VisualStyleId): string {
  return `/survey-adapters/${style}.css`;
}

/**
 * Pre-paint <link> bootstrap, inlined into <head> by the root layout. Reads the
 * persisted visual style and creates the adapter stylesheet <link> while the
 * document is still parsing — which is what makes it render-blocking.
 *
 * The link is owned outside React (ShadcnSurveyAdapterStyles mutates the same
 * element by id), so nothing is server-rendered for React to diff. Kept
 * dependency-free and defensive; mirrors the style/base-color/theme/radius
 * attribute script alongside it.
 */
export function surveyAdapterBootstrapScript(): string {
  const ids = VISUAL_STYLES.map((s) => s.id);
  return `(function(){try{
var ids=${JSON.stringify(ids)};
var s=localStorage.getItem(${JSON.stringify(STYLE_STORAGE_KEY)});
if(ids.indexOf(s)===-1)s=${JSON.stringify(DEFAULT_STYLE_ID)};
var l=document.getElementById(${JSON.stringify(SURVEY_ADAPTER_LINK_ID)});
if(!l){l=document.createElement("link");l.id=${JSON.stringify(SURVEY_ADAPTER_LINK_ID)};l.rel="stylesheet";document.head.appendChild(l);}
l.setAttribute("href","/survey-adapters/"+s+".css");
}catch(e){}})();`;
}
