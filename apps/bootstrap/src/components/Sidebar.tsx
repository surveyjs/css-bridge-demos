"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";
import { navItems } from "@bridge/schemas";

/**
 * Sidebar navigation. The item list comes straight from the shared IA
 * (`navItems` in @bridge/schemas) — no local copy — so the Bootstrap, shadcn,
 * and MUI shells all expose the identical routes.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <Nav className="flex-column p-3 gap-1" as="nav" aria-label="Primary">
      {navItems.map((item) => {
        const active =
          pathname === item.path || pathname.startsWith(`${item.path}/`);
        return (
          <Nav.Link
            key={item.id}
            as={Link}
            href={item.path}
            active={active}
            aria-current={active ? "page" : undefined}
            className="rounded px-3 py-2"
          >
            <span className="fw-medium">{item.label}</span>
            <small className="d-block text-body-secondary">
              {item.description}
            </small>
          </Nav.Link>
        );
      })}
    </Nav>
  );
}
