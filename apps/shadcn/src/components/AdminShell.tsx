"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@adapter/schemas";
import { MenuIcon, LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AllQuestionsToggle } from "./AllQuestionsToggle";
import { BorderlessToggle } from "./BorderlessToggle";

/**
 * Classic shadcn/ui admin layout, native chrome only — no SurveyJS yet.
 *  - a sticky top header (brand + visual-style + light/dark controls)
 *  - a permanent sidebar on lg+ screens; a Sheet drawer on smaller screens
 *  - a scrolling content area
 *
 * Everything reads the shadcn sidebar/background/border tokens, so the light/dark
 * toggle and the visual-style switcher re-skin the whole shell for free.
 */
const SIDEBAR_WIDTH = "17rem";

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
        <LayersIcon className="size-4" />
      </span>
      <span className="text-sm font-semibold">SurveyJS Theme Adapter</span>
      <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
        shadcn
      </span>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // The Builder hosts the full-height SurveyJS Creator, which needs the whole
  // viewport — so it renders edge-to-edge: no centered max-width, no content
  // padding, and a height pinned to the area below the sticky header. Every
  // other route keeps the padded, max-width reading column.
  const pathname = usePathname();
  const isBuilder = pathname === routes.builder;

  return (
    <div className="bg-background text-foreground min-h-svh">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
        {/* Mobile nav trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b">
              <SheetTitle className="text-left">
                <Brand />
              </SheetTitle>
            </SheetHeader>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex">
          <Brand />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Route-scoped: only renders on /all-questions. */}
          <AllQuestionsToggle />
          {/* Shown only where a page-level survey is mounted (/claims, /checkout,
              /all-questions); hidden on the Dashboard, Builder and Records. */}
          <BorderlessToggle />
          <ThemeSwitcher />
        </div>
      </header>

      <div className="flex">
        {/* Permanent sidebar (lg+) */}
        <aside
          className="bg-sidebar text-sidebar-foreground sticky top-14 hidden h-[calc(100svh-3.5rem)] shrink-0 overflow-y-auto border-r lg:block"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1">
          {isBuilder ? (
            <div className="h-[calc(100svh-3.5rem)]">{children}</div>
          ) : (
            <div className="mx-auto w-full max-w-[96rem] px-4 py-6 sm:px-6 lg:py-8">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
