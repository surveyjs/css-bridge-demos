import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminShell } from "@/components/AdminShell";
import { AllQuestionsModeProvider } from "@/components/AllQuestionsMode";
import { BorderlessModeProvider } from "@/components/BorderlessMode";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveyJS Bridge — shadcn/ui",
  description: "SurveyJS V3 CSS bridge demo (shadcn/ui).",
};

// Pre-paint visual-style bootstrap. Runs before React hydrates and before paint:
// reads the persisted style and applies `data-shadcn-style` to <html> so the
// token preset is in place with no flash (parallel to next-themes' own .dark
// script). Kept inline + tiny; mirrors the StyleProvider key + default.
const STYLE_BOOTSTRAP = `(function(){try{var s=localStorage.getItem('shadcn-style');var ok=['default','new-york','base-nova','base-vega','base-maia','base-lyra','base-mira','base-luma','base-sera','base-rhea'];document.documentElement.setAttribute('data-shadcn-style',ok.indexOf(s)>-1?s:'default');}catch(e){document.documentElement.setAttribute('data-shadcn-style','default');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // next-themes applies the `.dark` class to <html> before hydration, and the
    // inline script below applies `data-shadcn-style` — so the server markup
    // intentionally differs from the client here.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: STYLE_BOOTSTRAP }} />
      </head>
      <body>
        <ThemeProvider>
          <AllQuestionsModeProvider>
            <BorderlessModeProvider>
              <AdminShell>{children}</AdminShell>
            </BorderlessModeProvider>
          </AllQuestionsModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
