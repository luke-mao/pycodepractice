import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import capitalize from "capitalize";
import { useNavigate } from "react-router-dom";

/**
 * ChallengeCard Component
 *
 * Displays a summary card for a coding challenge with title, difficulty, and topic badges.
 * Includes a button to navigate to the challenge detail page.
 */
export default function ChallengeCard({ challenge }) {
  const navigate = useNavigate();

  return (
    <Card className="mb-3 shadow-sm" style={{ width: 330 }}>
      <Card.Body>
        <Card.Title>{challenge.title}</Card.Title>

        {/* Badges */}
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">
            {capitalize(challenge.difficulty)}
          </Badge>
          <Badge bg="info">
            {capitalize.words(challenge.topic.replace("_", " "))}
          </Badge>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate(`/challenges/${challenge.problem_id}`)}
        >
          Solve Now
        </Button>
      </Card.Body>
    </Card>
  );
}
