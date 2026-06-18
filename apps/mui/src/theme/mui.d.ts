import type {} from "@mui/material/styles";

/**
 * Register the alternate palette color schemes with MUI's type system so
 * `createTheme({ colorSchemes })` and `useColorScheme().setColorScheme(...)`
 * accept the namespaced keys (the canonical `light` / `dark` are built in).
 */
declare module "@mui/material/styles" {
  interface ColorSchemeOverrides {
    "teal-light": true;
    "teal-dark": true;
    "violet-light": true;
    "violet-dark": true;
    "sunset-light": true;
    "sunset-dark": true;
  }
}
