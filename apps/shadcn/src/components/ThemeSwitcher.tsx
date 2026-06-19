"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, PaletteIcon, CheckIcon } from "lucide-react";
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
import { VISUAL_STYLES } from "@/lib/styles";

/**
 * Header theme controls — the native shadcn analog of Bootswatch / MUI palettes:
 *  - a light/dark toggle (next-themes `setTheme`)
 *  - a visual-style dropdown that flips `data-shadcn-style` on <html>
 *
 * Both selections persist and re-apply before paint (next-themes + the layout's
 * inline style script), so the whole shell re-themes with zero flash.
 */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const { style, setStyle } = useStyle();
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
