#!/usr/bin/env node
// Propagate the LOCAL SurveyJS V3 build location (root env: SURVEYJS_LIBV3)
// into every app + the schemas package, rewriting their `survey-*` `file:`
// dependency paths. This is the single root command that "overrides" all
// per-app dependency config from one root variable.
//
// npm cannot read env vars from package.json dependency specs, so the env
// value is the source of truth and this script writes the resolved paths
// into each manifest (where npm can actually resolve them).
//
// Resolution order for SURVEYJS_LIBV3 (highest first):
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
const LIB_PATHS = {
  "survey-core": `${libv3}/survey-library/packages/survey-core/build`,
  "survey-react-ui": `${libv3}/survey-library/packages/survey-react-ui/build`,
  "survey-creator-core": `${libv3}/survey-creator/packages/survey-creator-core/build`,
  "survey-creator-react": `${libv3}/survey-creator/packages/survey-creator-react/build`,
};

// Every workspace that declares any of the libs above. We only rewrite a
// lib an app already declares, so each app keeps its own dependency set
// (schemas -> survey-core only; apps -> all four).
const TARGETS = [
  "apps/bootstrap/package.json",
  "apps/mui/package.json",
  "apps/shadcn/package.json",
  "packages/schemas/package.json",
];

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
    for (const [name, dir] of Object.entries(LIB_PATHS)) {
      if (name in deps) {
        const spec = `file:${dir}`;
        if (deps[name] !== spec) {
          deps[name] = spec;
          touched = true;
        }
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
  `\nSURVEYJS_LIBV3=${libv3}\nSynced survey-* paths in ${changed} file(s).`
);
