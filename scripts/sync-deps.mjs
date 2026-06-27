#!/usr/bin/env node
// Sync every app + the schemas package to one of two SurveyJS V3 dependency
// sources, selected by the root env var SurveyJS_LIB_USE_PATH:
//
//   SurveyJS_LIB_USE_PATH=true  (default) — use the LOCAL build.
//     Propagate the local build location (root env: SURVEYJS_LIBV3) into
//     every workspace, rewriting their `survey-*` deps to `file:` paths.
//     This is the single root command that "overrides" all per-app
//     dependency config from one root variable. npm cannot read env vars
//     from package.json dependency specs, so the env value is the source of
//     truth and this script writes the resolved paths into each manifest.
//
//   SurveyJS_LIB_USE_PATH=false — use the published npm packages.
//     Rewrite the same `survey-*` deps to a semver range pulled from the
//     npm registry (the version of the local build, so the published
//     packages match what's being demoed).
//
// Resolution order for env vars (highest first):
//   process.env  >  .env.local  >  .env
//
// Usage:  node scripts/sync-deps.mjs   (or: npm run sync:deps)

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// --- minimal .env parser (no dependency) ---
function loadEnvFile(file) {
  const out = {};
  if (!existsSync(file)) return out;
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[m[1]] = val;
  }
  return out;
}

const fromEnv = {
  ...loadEnvFile(join(root, ".env")),
  ...loadEnvFile(join(root, ".env.local")),
  ...process.env,
};

// SurveyJS_LIB_USE_PATH: true (default) -> local `file:` builds; false -> npm.
function asBool(v, dflt) {
  if (v == null || v === "") return dflt;
  return !/^(false|0|no|off)$/i.test(String(v).trim());
}
const USE_PATH = asBool(fromEnv.SurveyJS_LIB_USE_PATH, true);

const LIB_NAMES = [
  "survey-core",
  "survey-react-ui",
  "survey-creator-core",
  "survey-creator-react",
];

// Every workspace that declares any of the libs above. We only rewrite a
// lib an app already declares, so each app keeps its own dependency set
// (schemas -> survey-core only; apps -> all four).
const TARGETS = [
  "apps/bootstrap/package.json",
  "apps/mui/package.json",
  "apps/shadcn/package.json",
  "packages/schemas/package.json",
];

// Build the desired dependency spec for each lib, depending on the mode.
// PATH mode: `file:` path to the local build (needs SURVEYJS_LIBV3).
// NPM  mode: a `^<version>` range read from the local build's package.json
//   (so the published packages match what's being demoed), falling back to
//   "*" when the local build isn't available.
const SPECS = {};

if (USE_PATH) {
  const LIBV3 = fromEnv.SURVEYJS_LIBV3;
  if (!LIBV3) {
    // Don't hard-fail: a missing env shouldn't block an install whose
    // package.json paths are already valid. Warn and leave files untouched.
    console.warn(
      "⚠ SURVEYJS_LIBV3 is not set (.env / .env.local / process.env). " +
        "Skipping dependency sync — existing package.json paths left as-is."
    );
    process.exit(0);
  }
  const libv3 = LIBV3.replace(/\\/g, "/").replace(/\/+$/, "");
  // package name -> build dir, derived from the single root variable.
  const dirs = {
    "survey-core": `${libv3}/survey-library/packages/survey-core/build`,
    "survey-react-ui": `${libv3}/survey-library/packages/survey-react-ui/build`,
    "survey-creator-core": `${libv3}/survey-creator/packages/survey-creator-core/build`,
    "survey-creator-react": `${libv3}/survey-creator/packages/survey-creator-react/build`,
  };
  for (const name of LIB_NAMES) SPECS[name] = `file:${dirs[name]}`;
} else {
  const libv3raw = fromEnv.SURVEYJS_LIBV3;
  const libv3 = libv3raw
    ? libv3raw.replace(/\\/g, "/").replace(/\/+$/, "")
    : null;
  const buildDirs = libv3 && {
    "survey-core": `${libv3}/survey-library/packages/survey-core/build`,
    "survey-react-ui": `${libv3}/survey-library/packages/survey-react-ui/build`,
    "survey-creator-core": `${libv3}/survey-creator/packages/survey-creator-core/build`,
    "survey-creator-react": `${libv3}/survey-creator/packages/survey-creator-react/build`,
  };
  for (const name of LIB_NAMES) {
    let version = null;
    const buildPkg = buildDirs && join(buildDirs[name], "package.json");
    if (buildPkg && existsSync(buildPkg)) {
      try {
        version = JSON.parse(readFileSync(buildPkg, "utf8")).version || null;
      } catch {
        /* fall through to wildcard */
      }
    }
    SPECS[name] = version ? `^${version}` : "*";
  }
}

let changed = 0;
for (const rel of TARGETS) {
  const file = join(root, rel);
  if (!existsSync(file)) {
    console.warn(`⚠ skip (not found): ${rel}`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  let touched = false;
  for (const section of ["dependencies", "devDependencies"]) {
    const deps = pkg[section];
    if (!deps) continue;
    for (const [name, spec] of Object.entries(SPECS)) {
      if (name in deps && deps[name] !== spec) {
        deps[name] = spec;
        touched = true;
      }
    }
  }
  if (touched) {
    writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    changed++;
    console.log(`✓ updated ${rel}`);
  } else {
    console.log(`· in sync   ${rel}`);
  }
}

console.log(
  `\nSurveyJS_LIB_USE_PATH=${USE_PATH} (${USE_PATH ? "local file: builds" : "npm packages"})` +
    `\nSynced survey-* deps in ${changed} file(s).`
);
