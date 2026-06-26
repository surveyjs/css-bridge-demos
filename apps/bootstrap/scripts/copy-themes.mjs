/**
 * Copies the Bootstrap + Bootswatch stylesheets the theme switcher swaps between
 * into `public/themes/<id>.css`, so they can be loaded as plain <link> hrefs and
 * swapped at runtime (and set before paint by the no-flash inline script).
 *
 * Run automatically via the `predev`/`prebuild` npm scripts. Keeping the source
 * files in node_modules (not committed copies) means an `npm update` of Bootstrap
 * / Bootswatch flows straight through.
 */
import { createRequire } from "node:module";
import { mkdirSync, copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "public", "themes");

// id -> resolvable stylesheet in node_modules. `default` is vanilla Bootstrap;
// the rest are Bootswatch color themes (all support `data-bs-theme=dark`).
const sources = {
  default: "bootstrap/dist/css/bootstrap.min.css",
  zephyr: "bootswatch/dist/zephyr/bootstrap.min.css",
  cosmo: "bootswatch/dist/cosmo/bootstrap.min.css",
  morph: "bootswatch/dist/morph/bootstrap.min.css",
};

mkdirSync(outDir, { recursive: true });

for (const [id, spec] of Object.entries(sources)) {
  const from = require.resolve(spec);
  const to = resolve(outDir, `${id}.css`);
  copyFileSync(from, to);
  console.log(`themes: ${id} <- ${spec}`);
}
