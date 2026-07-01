import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminShell } from "@/components/AdminShell";
import { AllQuestionsModeProvider } from "@/components/AllQuestionsMode";
import { BorderlessModeProvider } from "@/components/BorderlessMode";
import { themeBootstrapScript } from "@/lib/themes";

export const metadata: Metadata = {
  title: "SurveyJS Bridge — Bootstrap",
  description: "SurveyJS V3 theme adapter demo (Bootstrap).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The pre-paint script sets `data-bs-theme` on <html> before hydration, so
    // the client markup intentionally differs from SSR here.
    <html lang="en" suppressHydrationWarning>
      <body>
        {/*
          No-flash theme bootstrap. Runs before hydration and IMPERATIVELY creates
          the swappable theme stylesheet <link> (id="bridge-theme-css") + sets
          light/dark. The stylesheet is owned outside React (ThemeProvider mutates
          the same element), so nothing theme-related is server-rendered into
          <head> — avoiding hydration mismatches with Next's injected meta tags.
          react-bootstrap ships no CSS; that stylesheet IS the Bootstrap layer.
        */}
        <Script id="bridge-theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrapScript()}
        </Script>
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
