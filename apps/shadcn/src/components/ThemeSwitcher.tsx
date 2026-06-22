"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, PaletteIcon, DropletIcon, RadiusIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStyle } from "./StyleProvider";
import { useBaseColor } from "./BaseColorProvider";
import { useRadius } from "./RadiusProvider";
import { VISUAL_STYLES } from "@/lib/styles";
import { BASE_COLORS } from "@/lib/baseColors";
import { RADII } from "@/lib/radii";

/**
 * Header theme controls — the native shadcn analog of Bootswatch / MUI palettes:
 *  - a light/dark toggle (next-themes `setTheme`)
 *  - a visual-style dropdown that flips `data-shadcn-style` on <html> (geometry)
 *  - a base-color dropdown that flips `data-shadcn-base-color` on <html> (palette)
 *  - a radius dropdown that flips `data-shadcn-radius` on <html> (corner rounding)
 *
 * The style, base-color and radius axes are independent and compose freely. All
 * selections persist and re-apply before paint (next-themes + the layout's
 * inline script), so the whole shell re-themes with zero flash.
 */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const { style, setStyle } = useStyle();
  const { baseColor, setBaseColor } = useBaseColor();
  const { radius, setRadius } = useRadius();
  const [mounted, setMounted] = useState(false);

  // next-themes / localStorage are client-only — render a stable placeholder
  // until mounted to avoid a hydration mismatch.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-[140px]" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <PaletteIcon />
            <span className="hidden sm:inline">
              {VISUAL_STYLES.find((s) => s.id === style)?.label ?? "Style"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Visual style</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {VISUAL_STYLES.map((s) => (
            <DropdownMenuItem
              key={s.id}
              onSelect={() => setStyle(s.id)}
              className="justify-between"
            >
              {s.label}
              {s.id === style && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <DropletIcon />
            <span className="hidden sm:inline">
              {BASE_COLORS.find((c) => c.id === baseColor)?.label ?? "Base color"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Base color</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {BASE_COLORS.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onSelect={() => setBaseColor(c.id)}
              className="justify-between"
            >
              {c.label}
              {c.id === baseColor && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <RadiusIcon />
            <span className="hidden sm:inline">
              {RADII.find((r) => r.id === radius)?.label ?? "Radius"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Radius</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {RADII.map((r) => (
            <DropdownMenuItem
              key={r.id}
              onSelect={() => setRadius(r.id)}
              className="justify-between"
            >
              {r.label}
              {r.id === radius && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}
