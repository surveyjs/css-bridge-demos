"use client";

// Dispatcher: renders the active visual style's vendored <Button> (one full
// component set per style lives in ./styles/<id>/). Call sites import from here
// unchanged. Selecting the set in JS means a cold-load flash for a persisted
// non-default style (corners, via --radius, stay flash-free).
import * as React from "react";

import { useStyle } from "@/components/StyleProvider";
import type { VisualStyleId } from "@/lib/styles";
import { Button as Button_default } from "./styles/default/button";
import { Button as Button_new_york } from "./styles/new-york/button";
import { Button as Button_base_nova } from "./styles/base-nova/button";
import { Button as Button_base_vega } from "./styles/base-vega/button";
import { Button as Button_base_maia } from "./styles/base-maia/button";
import { Button as Button_base_lyra } from "./styles/base-lyra/button";
import { Button as Button_base_mira } from "./styles/base-mira/button";
import { Button as Button_base_luma } from "./styles/base-luma/button";
import { Button as Button_base_sera } from "./styles/base-sera/button";
import { Button as Button_base_rhea } from "./styles/base-rhea/button";
export { buttonVariants } from "./styles/default/button";

const BUTTONS: Record<VisualStyleId, typeof Button_default> = {
  "default": Button_default,
  "new-york": Button_new_york,
  "base-nova": Button_base_nova,
  "base-vega": Button_base_vega,
  "base-maia": Button_base_maia,
  "base-lyra": Button_base_lyra,
  "base-mira": Button_base_mira,
  "base-luma": Button_base_luma,
  "base-sera": Button_base_sera,
  "base-rhea": Button_base_rhea,
};

function Button(props: React.ComponentProps<typeof Button_default>) {
  const { style } = useStyle();
  const Impl = BUTTONS[style] ?? Button_default;
  return <Impl {...props} />;
}

export { Button };
