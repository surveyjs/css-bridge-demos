// Generates the per-style shadcn component sets using the SHADCN CLI, then writes
// the minimal switching glue (shadcn has no runtime style switch).
//
//   node scripts/gen-ui.mjs --cli   → (re)generate components via `npx shadcn add`
//   node scripts/gen-ui.mjs         → just rewrite the glue from existing files
//
// Components per style live in src/components/ui/styles/<id>/ (input.tsx, button.tsx)
// and are the EXACT files `shadcn add` writes (base-* use @base-ui/react; default/
// new-york are Radix). The chrome <Button> (src/components/ui/button.tsx) is shadcn
// new-york (Radix, supports asChild for Sheet/DropdownMenu/Dialog triggers).
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const ROOT = "C:/survey.js/Examples/css-bridge-demos/apps/shadcn";
const UI = join(ROOT, "src/components/ui");
const REG = "https://ui.shadcn.com/r/styles";
const ids = ["default","new-york","base-nova","base-vega","base-maia","base-lyra","base-mira","base-luma","base-sera","base-rhea"];

if (process.argv.includes("--cli")) {
  for (const id of ids) {
    execSync(`npx --yes shadcn@latest add "${REG}/${id}/input.json" "${REG}/${id}/button.json" --path src/components/ui/styles/${id} --overwrite --yes --silent`, { cwd: ROOT, stdio: "inherit" });
  }
  // Chrome button: shadcn new-york (Radix / asChild) at src/components/ui/button.tsx
  execSync(`npx --yes shadcn@latest add "${REG}/new-york/button.json" --path src/components/ui --overwrite --yes --silent`, { cwd: ROOT, stdio: "inherit" });
}

// ── Glue (the only hand-written code) ────────────────────────────────────────
const slug = (id) => id.replace(/-/g, "_");
const importLines = (Comp) => ids.map((id) => `import { ${Comp} as ${Comp}_${slug(id)} } from "./styles/${id}/${Comp.toLowerCase()}";`).join("\n");
const mapLines = (Comp) => ids.map((id) => `  "${id}": ${Comp}_${slug(id)},`).join("\n");

// Per-style input className (for the native <select>, which can't be a vendored <Input>).
const inputClass = (id) => {
  const m = readFileSync(join(UI, "styles", id, "input.tsx"), "utf8").match(/cn\(\s*"([^"]+)"/);
  return m ? m[1] : "";
};
writeFileSync(join(UI, "styles", "style-input-class.ts"),
`import type { VisualStyleId } from "@/lib/styles";

// shadcn's real per-style input className (extracted from the CLI-generated
// styles/<id>/input.tsx) for the native <select> in NativeControls.
export const STYLE_INPUT_CLASS: Record<VisualStyleId, string> = {
${ids.map((id) => `  "${id}": "${inputClass(id)}",`).join("\n")}
};
`);

writeFileSync(join(UI, "input.tsx"),
`"use client";

// GLUE (not a shadcn component): renders the active visual style's CLI-generated
// <Input> from styles/<id>/. shadcn has no runtime style switch, so this selector
// is hand-written. Re-run scripts/gen-ui.mjs to regenerate.
import * as React from "react";
import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
${importLines("Input")}

const INPUTS: Record<VisualStyleId, React.ComponentType<any>> = {
${mapLines("Input")}
};

export function Input(props: React.ComponentProps<"input">) {
  const { style } = useStyle();
  const Impl = (INPUTS[style] ?? Input_default) as React.ComponentType<
    React.ComponentProps<"input">
  >;
  return <Impl {...props} />;
}
`);

writeFileSync(join(UI, "styled-button.tsx"),
`"use client";

// GLUE: per-style <Button> for the comparison column (StyledButton). base-* buttons
// are @base-ui/react (no asChild) — chrome keeps the Radix <Button> from ./button.
import * as React from "react";
import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
${importLines("Button")}

const BUTTONS: Record<VisualStyleId, React.ComponentType<any>> = {
${mapLines("Button")}
};

type Props = React.ComponentProps<"button"> & { variant?: string; size?: string };

export function StyledButton(props: Props) {
  const { style } = useStyle();
  const Impl = (BUTTONS[style] ?? Button_default) as React.ComponentType<Props>;
  return <Impl {...props} />;
}
`);

console.log("Glue written (input dispatcher, styled-button dispatcher, select class map).");
