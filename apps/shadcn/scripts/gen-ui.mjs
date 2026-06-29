import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UI = "C:/survey.js/Examples/css-bridge-demos/apps/shadcn/src/components/ui";

// Per-style geometry, DERIVED FROM the survey-core shadcn adapters
// (--sjs2-shadcn-input-height N → Tailwind h-N; flat = adapter's flat formbox).
const STYLES = {
  "default":   { h: "h-10", flat: false },
  "new-york":  { h: "h-9",  flat: false },
  "base-nova": { h: "h-8",  flat: false },
  "base-vega": { h: "h-9",  flat: false },
  "base-maia": { h: "h-9",  flat: false },
  "base-lyra": { h: "h-8",  flat: true  },
  "base-mira": { h: "h-7",  flat: false },
  "base-luma": { h: "h-9",  flat: false },
  "base-sera": { h: "h-10", flat: true  },
  "base-rhea": { h: "h-8",  flat: false },
};

// Components that DON'T vary per style (geometry rides the shared --radius);
// each style folder re-exports them so the folder is a complete ui surface.
const SHARED = ["badge","card","dialog","dropdown-menu","label","separator","sheet","switch","table","textarea"];

const sh = (flat, cls) => flat ? cls.replaceAll("shadow-xs", "shadow-none") : cls;

const buttonTpl = (id, { h, flat }) => `// AUTO-GENERATED per-style component set (visual style: ${id}).
// Source of truth: scripts/gen-ui.mjs — geometry from the survey-core shadcn
// adapter for "${id}". Vendored like shadcn: edit freely to customize THIS style.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "${sh(flat, "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90")}",
        destructive:
          "${sh(flat, "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60")}",
        outline:
          "${sh(flat, "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50")}",
        secondary:
          "${sh(flat, "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80")}",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // "${id}" default-size height (sm/lg/icon keep fixed sizes).
        default: "${h} px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
`;

const inputTpl = (id, { h, flat }) => `// AUTO-GENERATED per-style component set (visual style: ${id}).
// Source of truth: scripts/gen-ui.mjs. Vendored like shadcn: edit freely.
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "${sh(flat, "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex " + h + " w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm")}",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
`;

const indexTpl = (id) => `// Complete ui surface for visual style "${id}": this style's own
// Button/Input plus the style-invariant primitives (geometry rides --radius).
export { Button, buttonVariants } from "./button";
export { Input } from "./input";
${SHARED.map((c) => `export * from "@/components/ui/${c}";`).join("\n")}
`;

const ids = Object.keys(STYLES);

// Per-style folders
for (const id of ids) {
  const dir = join(UI, "styles", id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "button.tsx"), buttonTpl(id, STYLES[id]));
  writeFileSync(join(dir, "input.tsx"), inputTpl(id, STYLES[id]));
  writeFileSync(join(dir, "index.ts"), indexTpl(id));
}

// geometry.ts — for raw elements that aren't React components (native <select>)
const geom = `import type { VisualStyleId } from "@/lib/styles";

/** Per-style control geometry for raw elements (the native <select>) that can't
 *  use the vendored component sets. Mirrors styles/<id>/input.tsx. */
export const STYLE_GEOMETRY: Record<VisualStyleId, { control: string }> = {
${ids.map((id) => `  "${id}": { control: "${STYLES[id].h}${STYLES[id].flat ? " shadow-none" : ""}" },`).join("\n")}
};
`;
writeFileSync(join(UI, "styles", "geometry.ts"), geom);

// Dispatchers — public ui/button.tsx & ui/input.tsx select the active style's set.
const importLines = (comp) => ids.map((id) => `import { ${comp} as ${comp}_${id.replace(/-/g, "_")} } from "./styles/${id}/${comp.toLowerCase()}";`).join("\n");
const mapLines = (comp) => ids.map((id) => `  "${id}": ${comp}_${id.replace(/-/g, "_")},`).join("\n");

const buttonDispatcher = `"use client";

// Dispatcher: renders the active visual style's vendored <Button> (one full
// component set per style lives in ./styles/<id>/). Call sites import from here
// unchanged. Selecting the set in JS means a cold-load flash for a persisted
// non-default style (corners, via --radius, stay flash-free).
import * as React from "react";

import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
${importLines("Button")}
export { buttonVariants } from "./styles/default/button";

const BUTTONS: Record<VisualStyleId, typeof Button_default> = {
${mapLines("Button")}
};

function Button(props: React.ComponentProps<typeof Button_default>) {
  const { style } = useStyle();
  const Impl = BUTTONS[style] ?? Button_default;
  return <Impl {...props} />;
}

export { Button };
`;
writeFileSync(join(UI, "button.tsx"), buttonDispatcher);

const inputDispatcher = `"use client";

// Dispatcher: renders the active visual style's vendored <Input>
// (one set per style in ./styles/<id>/). See ui/button.tsx for the rationale.
import * as React from "react";

import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
${importLines("Input")}

const INPUTS: Record<VisualStyleId, typeof Input_default> = {
${mapLines("Input")}
};

function Input(props: React.ComponentProps<typeof Input_default>) {
  const { style } = useStyle();
  const Impl = INPUTS[style] ?? Input_default;
  return <Impl {...props} />;
}

export { Input };
`;
writeFileSync(join(UI, "input.tsx"), inputDispatcher);

console.log("Generated", ids.length, "per-style ui sets + dispatchers + geometry.ts");
