"use client";

import { Button, Card, Form } from "react-bootstrap";

/**
 * Stock react-bootstrap form controls shown beside the SurveyJS form so the
 * bridge's fidelity is verifiable by eye: each control here is the native
 * Bootstrap rendering the bridged SurveyJS field should be indistinguishable
 * from. Pure chrome — no SurveyJS involvement.
 */
export function NativeControls() {
  return (
    <Card>
      <Card.Body>
        <Card.Title as="h2" className="h6 mb-1">
          Native Bootstrap
        </Card.Title>
        <p className="text-body-secondary small mb-4">
          Stock react-bootstrap controls — the bridged form should match these.
        </p>

        <Form>
          <Form.Group className="mb-3" controlId="native-text">
            <Form.Label>First name</Form.Label>
            <Form.Control type="text" placeholder="Enter text…" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="native-select">
            <Form.Label>Preferred contact method</Form.Label>
            <Form.Select defaultValue="">
              <option value="" disabled>
                Select an option…
              </option>
              <option>Phone</option>
              <option>Email</option>
              <option>Text message</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="native-textarea">
            <Form.Label>Current medications</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter longer text…" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-block">Sex assigned at birth</Form.Label>
            <Form.Check
              type="radio"
              name="native-radio"
              id="native-radio-f"
              label="Female"
              defaultChecked
            />
            <Form.Check
              type="radio"
              name="native-radio"
              id="native-radio-m"
              label="Male"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="d-block">Consent</Form.Label>
            <Form.Check
              type="checkbox"
              id="native-check"
              label="I consent to treatment"
              defaultChecked
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="native-invalid">
            <Form.Label>Required field (invalid state)</Form.Label>
            <Form.Control type="text" isInvalid defaultValue="" />
            <Form.Control.Feedback type="invalid">
              This field is required.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex flex-wrap gap-2">
            <Button variant="primary">Complete</Button>
            <Button variant="outline-primary">Check</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
