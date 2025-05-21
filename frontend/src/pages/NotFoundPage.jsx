import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * NotFoundPage Component
 *
 * Displays a 404 error message and automatically redirects the user to the homepage after a short delay.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [navigate]);

  return (
    <div className="text-center mt-5">
      <h2 className="text-danger">404 - Page Not Found</h2>
      <p>Redirecting to the main page...</p>
    </div>
  );
}