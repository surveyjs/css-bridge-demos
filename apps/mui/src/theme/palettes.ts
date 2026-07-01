/**
 * App-local palette catalog for the MUI shell chrome.
 *
 * This is host chrome config (an allowed per-app concern), not shared model
 * state, so it lives in the app rather than `@adapter/schemas`.
 *
 * Two independent axes, both driven by MUI's NATIVE color-scheme system
 * (no hand-rolled data attributes):
 *  - mode    — light / dark, chosen via `useColorScheme().setMode`.
 *  - palette — a color preset, chosen via `useColorScheme().setColorScheme`
 *              picking that preset's { light, dark } scheme pair.
 *
 * Each preset contributes two MUI color schemes (a light + a dark variant) to
 * `createTheme({ colorSchemes })`. Encoding the palette into real color schemes
 * (rather than swapping the whole theme) is what lets MUI's InitColorSchemeScript
 * persist and re-apply the full selection BEFORE paint — no flash on either axis.
 */

import {
  amber,
  blue,
  deepOrange,
  deepPurple,
  indigo,
  pink,
  teal,
} from "@mui/material/colors";

export type SchemeMode = "light" | "dark";

/** Stable key of a single MUI color scheme (one mode of one palette). */
export type SchemeKey =
  | "light"
  | "dark"
  | "teal-light"
  | "teal-dark"
  | "violet-light"
  | "violet-dark"
  | "sunset-light"
  | "sunset-dark";

interface PaletteTones {
  readonly primary: string;
  readonly secondary: string;
}

export interface PalettePreset {
  /** Stable id, also used as a React key and persisted selection. */
  readonly id: string;
  /** Display label in the palette menu. */
  readonly label: string;
  /** One-line flavor text for the menu. */
  readonly description: string;
  /** Color scheme key applied when the resolved mode is light. */
  readonly lightKey: SchemeKey;
  /** Color scheme key applied when the resolved mode is dark. */
  readonly darkKey: SchemeKey;
  /** Tones used for the menu swatches and the generated color schemes. */
  readonly light: PaletteTones;
  readonly dark: PaletteTones;
}

/**
 * The default preset deliberately uses the canonical `light` / `dark` scheme
 * keys so MUI's mode resolution and InitColorSchemeScript defaults work without
 * extra configuration; the alternates use namespaced keys.
 */
export const palettes: readonly PalettePreset[] = [
  {
    id: "default",
    label: "Default",
    description: "MUI signature blue.",
    lightKey: "light",
    darkKey: "dark",
    light: { primary: blue[700], secondary: pink.A400 },
    dark: { primary: blue[300], secondary: pink.A200 },
  },
  {
    id: "teal",
    label: "Teal",
    description: "Calm teal & amber.",
    lightKey: "teal-light",
    darkKey: "teal-dark",
    light: { primary: teal[700], secondary: amber[800] },
    dark: { primary: teal[300], secondary: amber[500] },
  },
  {
    id: "violet",
    label: "Violet",
    description: "Deep purple & teal.",
    lightKey: "violet-light",
    darkKey: "violet-dark",
    light: { primary: deepPurple[500], secondary: teal[600] },
    dark: { primary: deepPurple[200], secondary: teal[300] },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Warm orange & indigo.",
    lightKey: "sunset-light",
    darkKey: "sunset-dark",
    light: { primary: deepOrange[600], secondary: indigo[500] },
    dark: { primary: deepOrange[300], secondary: indigo[200] },
  },
] as const;

export const DEFAULT_PALETTE_ID = "default";

/** The default preset, used as the fallback when none matches. */
export const defaultPalette: PalettePreset = palettes[0]!;

/** Find the preset whose light variant matches the active light color scheme. */
export function paletteForLightScheme(
  lightColorScheme: string | undefined,
): PalettePreset {
  return (
    palettes.find((p) => p.lightKey === lightColorScheme) ?? defaultPalette
  );
}
