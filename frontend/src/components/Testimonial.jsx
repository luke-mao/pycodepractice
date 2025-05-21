import React from "react";
import { Card } from "react-bootstrap";

/**
 * Testimonial Component
 *
 * Displays student quotes and highlights the key features of the AI Tutor in a styled card layout.
 */
export default function Testimonial() {
  return (
    <Card className="shadow-sm h-100 bg-light border-0">
      <Card.Body>
        <blockquote className="blockquote mb-3">
          <p>&quot;It&apos;s like having a coding buddy that never sleeps.&quot;</p>
          <footer className="blockquote-footer mt-2">Student using AI Tutor</footer>
        </blockquote>

        <blockquote className="blockquote mb-3">
          <p>&quot;I finally understood recursion — no spoilers, just guidance!&quot;</p>
          <footer className="blockquote-footer mt-2">Beginner Python Learner</footer>
        </blockquote>

        <div className="text-muted mt-4">
          <h5>AI Tutor Features:</h5>
          <ul className="mb-0 ps-3">
            <li>✅ Personalized, step-by-step tutoring</li>
            <li>✅ Built with GPT-4o Mini</li>
            <li>✅ No solutions unless you ask</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}