"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import AppsIcon from "@mui/icons-material/Apps";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import TableChartIcon from "@mui/icons-material/TableChart";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { SvgIconComponent } from "@mui/icons-material";
import { navItems, type NavId } from "@adapter/schemas";

/**
 * Sidebar navigation. The item list comes straight from the shared IA
 * (`navItems` in @adapter/schemas) — no local copy, identical order — so the
 * Bootstrap, shadcn, and MUI shells all expose the identical routes. Only the
 * icon mapping (pure host chrome) is app-local.
 */
const ICONS: Record<NavId, SvgIconComponent> = {
  claims: AssignmentIcon,
  checkout: ShoppingCartCheckoutIcon,
  records: TableChartIcon,
  builder: BuildIcon,
  "all-questions": AppsIcon,
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <List component="nav" aria-label="Primary" sx={{ px: 1.5, py: 2 }}>
      {navItems.map((item) => {
        const active =
          pathname === item.path || pathname.startsWith(`${item.path}/`);
        const Icon = ICONS[item.id];
        return (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NextLink}
              href={item.path}
              selected={active}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              sx={{ borderRadius: 2, alignItems: "flex-start" }}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                <Icon color={active ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                slotProps={{
                  primary: { fontWeight: 500 },
                  secondary: { variant: "caption" },
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
