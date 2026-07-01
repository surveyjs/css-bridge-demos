import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminShell } from "@/components/AdminShell";
import { AllQuestionsModeProvider } from "@/components/AllQuestionsMode";
import { BorderlessModeProvider } from "@/components/BorderlessMode";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveyJS Bridge — shadcn/ui",
  description: "SurveyJS V3 theme adapter demo (shadcn/ui).",
};

// Pre-paint theming bootstrap. Runs before React hydrates and before paint:
// reads the persisted visual style, base color, theme (accent) AND radius and
// applies `data-shadcn-style` + `data-shadcn-base-color` + `data-shadcn-theme` +
// `data-shadcn-radius` to <html> so all four token presets are in place with no
// flash (parallel to next-themes' own .dark script). Kept inline + tiny; mirrors
// the StyleProvider / BaseColorProvider / ThemeColorProvider / RadiusProvider
// keys + defaults.
const STYLE_BOOTSTRAP = `(function(){try{var s=localStorage.getItem('shadcn-style');var ok=['default','new-york','base-nova','base-vega','base-maia','base-lyra','base-mira','base-luma','base-sera','base-rhea'];document.documentElement.setAttribute('data-shadcn-style',ok.indexOf(s)>-1?s:'default');var c=localStorage.getItem('shadcn-base-color');var okc=['neutral','gray','zinc','stone','slate'];document.documentElement.setAttribute('data-shadcn-base-color',okc.indexOf(c)>-1?c:'neutral');var t=localStorage.getItem('shadcn-theme');var okt=['default','red','rose','orange','green','blue','yellow','violet'];document.documentElement.setAttribute('data-shadcn-theme',okt.indexOf(t)>-1?t:'default');var r=localStorage.getItem('shadcn-radius');var okr=['default','0','0.25','0.5','0.75','1'];document.documentElement.setAttribute('data-shadcn-radius',okr.indexOf(r)>-1?r:'default');}catch(e){document.documentElement.setAttribute('data-shadcn-style','default');document.documentElement.setAttribute('data-shadcn-base-color','neutral');document.documentElement.setAttribute('data-shadcn-theme','default');document.documentElement.setAttribute('data-shadcn-radius','default');}})();`;

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
