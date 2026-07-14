"use client";

// GLUE (not a shadcn component): renders the active visual style's CLI-generated
// <Input> from styles/<id>/. Re-run `npm run install:ui` to regenerate.
import * as React from "react";
import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
import { Input as input_base_luma } from "./styles/base-luma/input";
import { Input as input_base_lyra } from "./styles/base-lyra/input";
import { Input as input_base_maia } from "./styles/base-maia/input";
import { Input as input_base_mira } from "./styles/base-mira/input";
import { Input as input_base_nova } from "./styles/base-nova/input";
import { Input as input_base_rhea } from "./styles/base-rhea/input";
import { Input as input_base_sera } from "./styles/base-sera/input";
import { Input as input_base_vega } from "./styles/base-vega/input";
import { Input as input_default } from "./styles/default/input";
import { Input as input_new_york } from "./styles/new-york/input";

const IMPLS: Record<VisualStyleId, React.ComponentType<any>> = {
  "base-luma": input_base_luma,
  "base-lyra": input_base_lyra,
  "base-maia": input_base_maia,
  "base-mira": input_base_mira,
  "base-nova": input_base_nova,
  "base-rhea": input_base_rhea,
  "base-sera": input_base_sera,
  "base-vega": input_base_vega,
  "default": input_default,
  "new-york": input_new_york,
};

export function Input(props: React.ComponentProps<"input">) {
  const { style } = useStyle();
  const Impl = (IMPLS[style] ?? input_base_luma) as React.ComponentType<
    React.ComponentProps<"input">
  >;
  return <Impl {...props} />;
}
