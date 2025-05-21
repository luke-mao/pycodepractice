import React from "react";
import { Card, Col } from "react-bootstrap";

/**
 * FeatureCard Component
 *
 * Displays a single feature with an icon, title, and description in a responsive card layout.
 */
export default function FeatureCard({ icon, title, description }) {
  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 text-center shadow-sm">
        <Card.Body>
          <div style={{ fontSize: "2rem" }}>{icon}</div>
          <Card.Title className="mt-2">{title}</Card.Title>
          <Card.Text className="text-muted">{description}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
