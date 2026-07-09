import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminShell } from "@/components/AdminShell";
import { AllQuestionsModeProvider } from "@/components/AllQuestionsMode";
import { BorderlessModeProvider } from "@/components/BorderlessMode";
import { themeBootstrapScript } from "@/lib/themes";

export const metadata: Metadata = {
  title: "SurveyJS Adapter — Bootstrap",
  description: "SurveyJS V3 theme adapter demo (Bootstrap).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The pre-paint script sets `data-bs-theme` on <html> before hydration, so
    // the client markup intentionally differs from SSR here.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          No-flash theme bootstrap. IMPERATIVELY creates the swappable theme
          stylesheet <link> (id="adapter-theme-css") + sets light/dark. The
          stylesheet is owned outside React (ThemeProvider mutates the same
          element), so nothing theme-related is server-rendered into <head> —
          avoiding hydration mismatches with Next's injected meta tags.
          react-bootstrap ships no CSS; that stylesheet IS the Bootstrap layer.

          A RAW <script> in <head>, not next/script: `strategy="beforeInteractive"`
          does not inline here — Next queues the source into `self.__next_s` and
          runs it only once the client bundle has loaded, i.e. AFTER first paint.
          That left the survey painting with the adapter's `var(--bs-*)` lookups
          unresolved (so it fell back to stock survey-core V3) until the theme
          sheet arrived. Inline + parser-blocking in <head>, the <link> is
          appended while the document is still loading, which makes it
          render-blocking: Bootstrap's tokens exist at first paint.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript() }} />
      </head>
      <body>
        <ThemeProvider>
          <BorderlessModeProvider>
            <AllQuestionsModeProvider>
              <AdminShell>{children}</AdminShell>
            </AllQuestionsModeProvider>
          </BorderlessModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
