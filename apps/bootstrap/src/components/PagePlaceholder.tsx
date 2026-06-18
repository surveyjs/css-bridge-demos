"use client";

import type { ReactNode } from "react";
import { Card } from "react-bootstrap";

/**
 * Shared scaffold for a route's placeholder content. This stage ships only the
 * native Bootstrap chrome — the SurveyJS form that will live in `children`
 * arrives in a later prompt.
 */
export function PagePlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="mb-4">
        <h1 className="h3 mb-1">{title}</h1>
        <p className="text-body-secondary mb-0">{description}</p>
      </div>

      <Card className="border-2 border-dashed">
        <Card.Body className="text-center text-body-secondary py-5">
          <div className="display-6 mb-2" aria-hidden>
            🚧
          </div>
          <p className="mb-1 fw-medium">Native Bootstrap chrome only</p>
          <p className="mb-0 small">
            The SurveyJS form for this route is wired up in a later stage.
          </p>
          {children}
        </Card.Body>
      </Card>
    </>
  );
}
