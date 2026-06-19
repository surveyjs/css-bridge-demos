"use client";

import Link from "next/link";
import { Card, Col, Row } from "react-bootstrap";
import { navItems } from "@bridge/schemas";

/**
 * Landing page. A native-Bootstrap dashboard of cards, one per shared IA route.
 * Cards are driven by `navItems` from @bridge/schemas (no local route list).
 */
export default function HomePage() {
  return (
    <Row className="g-3">
      {navItems.map((item) => (
        <Col key={item.id} xs={12} sm={6} xl={3}>
          <Card
            as={Link}
            href={item.path}
            className="h-100 text-decoration-none text-reset shadow-sm"
          >
            <Card.Body>
              <Card.Title className="h5">{item.label}</Card.Title>
              <Card.Text className="text-body-secondary">
                {item.description}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-primary small">
              Open {item.label} →
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
