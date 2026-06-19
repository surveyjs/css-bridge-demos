import type { ReactNode } from "react";
import { HardHatIcon } from "lucide-react";

/**
 * Shared scaffold for a route's content this stage. apps/shadcn ships only the
 * native shadcn/ui chrome — the SurveyJS form that will live in `children`
 * arrives in a later prompt. Pure shadcn tokens, so it re-themes with the shell.
 *
 * No title/description header band (see CLAUDE.md "No per-route page header") —
 * the sidebar already shows where you are, and each survey renders its own title.
 */
export function PagePlaceholder({ children }: { children?: ReactNode }) {
  return (
    <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-16 text-center">
      <HardHatIcon className="size-7" aria-hidden />
      <p className="text-foreground font-medium">Native shadcn/ui chrome only</p>
      <p className="text-sm">
        The SurveyJS form for this route is wired up in a later stage.
      </p>
      {children}
    </div>
  );
}
