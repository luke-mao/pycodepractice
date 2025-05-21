import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { useStore } from "../store/store";
import PreviousSubmissionsTable from "./PreviousSubmissionsTable";
import { Spinner, Alert } from "react-bootstrap";

/**
 * ChallengeSubmissionTab Component
 *
 * Fetches and displays the current user's past submissions for a given problem.
 * Handles loading and error states, and renders a table of submissions if available.
 */
export default function ChallengeSubmissionTab({ problemId }) {
  const { userInfo } = useStore();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (!userInfo || !userInfo.token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        return;
      }

      try {
        const url = `${BACKEND}/submission/user/${problemId}`;
        const config = { headers: { Authorization: userInfo.token } };

        const response = await axios.get(url, config);
        setSubmissions(response.data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err.response?.data?.message || "Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubmissions();
  }, [problemId, userInfo]);

  return (
    <div>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading submissions...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && submissions.length > 0 ? (
        <PreviousSubmissionsTable previous={submissions} />
      ) : (
        !loading && !error && <p className="text-muted">No submissions found.</p>
      )}
    </div>
  );
}
