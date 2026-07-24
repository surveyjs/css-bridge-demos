"use client";

import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { colorThemes } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";
import "./ThemeSwitcher.css";

/**
 * Header theme controls, built entirely from react-bootstrap:
 *  - a light/dark toggle (sets `data-bs-theme` on <html>)
 *  - a color-theme dropdown (swaps the active Bootstrap/Bootswatch stylesheet)
 */
export function ThemeSwitcher() {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const activeLabel =
    colorThemes.find((t) => t.id === theme)?.label ?? "Theme";

  return (
    <ButtonGroup className="theme-switcher">
      <Button
        variant="outline-secondary"
        onClick={toggleMode}
        title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
        aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
      >
        {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
      </Button>

      <Dropdown as={ButtonGroup} align="end">
        <Dropdown.Toggle variant="outline-secondary" id="theme-dropdown">
          <span className="me-1">🎨</span>
          {activeLabel}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>Color theme</Dropdown.Header>
          {colorThemes.map((t) => (
            <Dropdown.Item
              key={t.id}
              active={t.id === theme}
              onClick={() => setTheme(t.id)}
            >
              <div className="fw-medium">{t.label}</div>
              <small className="opacity-75">{t.description}</small>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
}
