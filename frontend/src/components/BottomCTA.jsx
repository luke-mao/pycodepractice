import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * BottomCTA Component
 *
 * Displays a call-to-action section encouraging users to explore challenges or log in/register.
 * Adjusts available buttons based on the user's login status.
 */
export default function BottomCTA({ isLogin }) {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-5 pt-4 border-top">
      <h4 className="mb-3">💬 Ready to level up?</h4>
      <p className="text-muted mb-4">Join thousands of coders improving daily with AI-powered practice.</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Button variant="primary" onClick={() => navigate("/challenges")}>
          🔍 Explore Challenges
        </Button>
        {!isLogin && (
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
