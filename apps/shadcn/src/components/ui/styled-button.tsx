"use client";

// GLUE: per-style <Button> for the comparison column (StyledButton). base-* buttons
// are @base-ui/react (no asChild) — chrome keeps the Radix <Button> from ./button.
import * as React from "react";
import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
import { Button as button_base_luma } from "./styles/base-luma/button";
import { Button as button_base_lyra } from "./styles/base-lyra/button";
import { Button as button_base_maia } from "./styles/base-maia/button";
import { Button as button_base_mira } from "./styles/base-mira/button";
import { Button as button_base_nova } from "./styles/base-nova/button";
import { Button as button_base_rhea } from "./styles/base-rhea/button";
import { Button as button_base_sera } from "./styles/base-sera/button";
import { Button as button_base_vega } from "./styles/base-vega/button";
import { Button as button_default } from "./styles/default/button";
import { Button as button_new_york } from "./styles/new-york/button";

const BUTTONS: Record<VisualStyleId, React.ComponentType<any>> = {
  "base-luma": button_base_luma,
  "base-lyra": button_base_lyra,
  "base-maia": button_base_maia,
  "base-mira": button_base_mira,
  "base-nova": button_base_nova,
  "base-rhea": button_base_rhea,
  "base-sera": button_base_sera,
  "base-vega": button_base_vega,
  "default": button_default,
  "new-york": button_new_york,
};

type Props = React.ComponentProps<"button"> & { variant?: string; size?: string };

export function StyledButton(props: Props) {
  const { style } = useStyle();
  const Impl = (BUTTONS[style] ?? button_base_luma) as React.ComponentType<Props>;
  return <Impl {...props} />;
}
