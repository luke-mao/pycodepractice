import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * HeroSection Component
 *
 * Displays the homepage banner with a project title, brief description, and navigation buttons.
 * Button options adapt based on whether the user is logged in.
 */
export default function HeroSection({ isLogin }) {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-5">
      <h2 className="mb-3">💡PyCodePractice: Sharpen Your Python Skills</h2>
      <p className="lead text-muted">
        Challenge-Driven Practice with <strong>AI-Powered Guidance</strong> from GPT-4o Mini.
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
        <Button variant="primary" onClick={() => navigate("/challenges")}>
          🔍 Explore Challenges
        </Button>
        {isLogin ? (
          <Button variant="outline-success" onClick={() => navigate("/challenge/1")}>
            🤖 Try AI Tutor
          </Button>
        ) : (
          <>
            <Button variant="outline-secondary" onClick={() => navigate("/login")}>
              🔐 Login
            </Button>
            <Button variant="outline-secondary" onClick={() => navigate("/signup")}>
              📝 Register
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
