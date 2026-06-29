"use client";

// Dispatcher: renders the active visual style's vendored <Input>
// (one set per style in ./styles/<id>/). See ui/button.tsx for the rationale.
import * as React from "react";

import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
import { Input as Input_default } from "./styles/default/input";
import { Input as Input_new_york } from "./styles/new-york/input";
import { Input as Input_base_nova } from "./styles/base-nova/input";
import { Input as Input_base_vega } from "./styles/base-vega/input";
import { Input as Input_base_maia } from "./styles/base-maia/input";
import { Input as Input_base_lyra } from "./styles/base-lyra/input";
import { Input as Input_base_mira } from "./styles/base-mira/input";
import { Input as Input_base_luma } from "./styles/base-luma/input";
import { Input as Input_base_sera } from "./styles/base-sera/input";
import { Input as Input_base_rhea } from "./styles/base-rhea/input";

const INPUTS: Record<VisualStyleId, typeof Input_default> = {
  "default": Input_default,
  "new-york": Input_new_york,
  "base-nova": Input_base_nova,
  "base-vega": Input_base_vega,
  "base-maia": Input_base_maia,
  "base-lyra": Input_base_lyra,
  "base-mira": Input_base_mira,
  "base-luma": Input_base_luma,
  "base-sera": Input_base_sera,
  "base-rhea": Input_base_rhea,
};

function Input(props: React.ComponentProps<typeof Input_default>) {
  const { style } = useStyle();
  const Impl = INPUTS[style] ?? Input_default;
  return <Impl {...props} />;
}

export { Input };
