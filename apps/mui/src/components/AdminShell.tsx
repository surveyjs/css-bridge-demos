"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@bridge/schemas";
import MenuIcon from "@mui/icons-material/Menu";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Sidebar } from "./Sidebar";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { AllQuestionsToggle } from "./AllQuestionsToggle";
import { BorderlessToggle } from "./BorderlessToggle";

const DRAWER_WIDTH = 280;

/**
 * Classic MUI admin layout, native chrome only — no SurveyJS yet.
 *  - a full-width AppBar (above the drawer) with the brand + theme controls
 *  - a permanent Drawer on md+ screens, a temporary one toggled on mobile
 *  - a scrolling content Container
 *
 * Everything re-themes through the MUI CSS variables emitted by `cssVariables`,
 * so the light/dark toggle and palette menu re-skin the whole shell for free.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  // The Builder hosts the full-height SurveyJS Creator, which needs the whole
  // viewport — so it renders edge-to-edge: no centered Container, no content
  // padding, filling the area below the fixed AppBar. Every other route keeps
  // the padded, max-width reading column.
  const pathname = usePathname();
  const isBuilder = pathname === routes.builder;

  const brand = (
    <Toolbar sx={{ gap: 1 }}>
      <WidgetsIcon color="primary" />
      <Typography variant="h6" noWrap sx={{ fontWeight: 700, flexGrow: 1 }}>
        SurveyJS Bridge
      </Typography>
    </Toolbar>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <WidgetsIcon color="primary" sx={{ display: { xs: "none", md: "block" } }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            SurveyJS Bridge
          </Typography>
          <Chip label="MUI" color="primary" size="small" sx={{ ml: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          {/* Renders only on survey routes — hidden on /, /builder and /records. */}
          <BorderlessToggle />
          {/* Route-scoped: only renders on /all-questions. */}
          <AllQuestionsToggle />
          <ThemeSwitcher />
        </Toolbar>
      </AppBar>

      {/* Navigation drawers. The persistent variant owns md+; the temporary one
          owns smaller screens and closes on navigation. */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {brand}
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
          }}
        >
          {/* Spacer matching the AppBar height so nav sits below the header. */}
          <Toolbar />
          <Sidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ...(isBuilder && {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }),
        }}
      >
        {/* Spacer matching the fixed AppBar height. */}
        <Toolbar />
        {isBuilder ? (
          // Fill the remaining height below the AppBar spacer; the Creator inside
          // stretches to 100% of this region.
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>{children}</Box>
        ) : (
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
            {children}
          </Container>
        )}
      </Box>
    </Box>
  );
}
