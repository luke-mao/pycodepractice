import React from "react";
import { Card, Badge } from "react-bootstrap";
import capitalize from "capitalize";
import { useNavigate } from "react-router-dom";
import { convertTimeToDistance } from "../static/util";

/**
 * RecentChallengeCard Component
 *
 * Displays a summary card for a recently attempted challenge, including title, topic, difficulty, submission status, and timestamp.
 * Clicking the card navigates to the challenge detail page.
 */
export default function RecentChallengeCard({ problem, submission }) {
  const navigate = useNavigate();
  const timeAgo = convertTimeToDistance(submission.submission_time);

  return (
    <Card 
      className="shadow-sm px-3 py-2"
      onClick={() => navigate(`/challenges/${problem.problem_id}`)} 
      style={{ cursor: "pointer", width: 330 }}
    >
      <Card.Body>
        <Card.Title>{problem.title}</Card.Title>

        {/* Topic & Difficulty */}
        <div className="mb-1">
          <Badge bg="secondary" className="me-2">{capitalize(problem.difficulty)}</Badge>
          <Badge bg="info">{capitalize.words(problem.topic.replace("_", " "))}</Badge>
        </div>

        {/* Last Tried Time */}
        <div className="text-muted small mb-2">Last tried: {timeAgo}</div>

        {/* Submission Status */}
        <div>
          Status:{" "}
          {submission.is_pass ? (
            <span className="text-success fw-semibold">✅ Passed</span>
          ) : (
            <span className="text-danger fw-semibold">❌ Failed</span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
