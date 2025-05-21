import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { Container, Row, Col, Spinner, Button, Table } from "react-bootstrap";
import MonacoEditor from "@monaco-editor/react";
import { useStore } from "../store/store";
import PreviousSubmissionsTable from "../components/PreviousSubmissionsTable";
import SubmissionRanking from "../components/SubmissionRanking";

/**
 * ChallengeSubmissionPage Component
 *
 * Displays detailed results for a specific submission, including test output, performance metrics, and user's submitted code.
 * Shows a ranking summary if the submission passed, and a table of previous submissions for the same problem.
 */
export default function ChallengeSubmissionPage() {
  const { submissionId } = useParams();
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [submissionData, setSubmissionData] = useState(null);
  const [isPass, setIsPass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const url = `${BACKEND}/submission/${submissionId}`;
        const config = { headers: { Authorization: userInfo.token } };

        const response = await axios.get(url, config);
        setSubmissionData(response.data);
        setIsPass(response.data.submission.is_pass);
      } catch (error) {
        console.error("Error fetching submission:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId]); // eslint-disable-line react-hooks/exhaustive-deps

  // when the submission is successful, fetch the ranking data
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const url = `${BACKEND}/submission/ranking/${submissionId}`;
        const config = { headers: { Authorization: userInfo.token } };
        const response = await axios.get(url, config);
        setRankingData(response.data);
      } catch (error) {
        console.error("Failed to fetch ranking", error);
      }
    };
  
    if (isPass) {
      fetchRanking();
    }
  }, [isPass]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <h6 className="mt-4">Loading submission details...</h6>
      </div>
    );
  }

  const { submission, problem, previous } = submissionData;
  const { problem_id, title } = problem;

  return (
    <Container fluid className="mt-3 pb-3">
      {/* Back Button */}
      <Button variant="light" size="sm" onClick={() => navigate(`/challenges/${problem_id}`)} className="mb-3">
        ← Back
      </Button>

      <h4>{`Submission for P${problem_id} - ${title}`}</h4>

      <Row className="g-4">
        {/* Left: Submission Result */}
        <Col md={6}>
          <h5>{`Test Results: ${isPass ? "✅" : "❌"}`}</h5>
          <div className="border rounded p-3 bg-light">
            {submission.results && submission.results.length > 0 ? (
              <ul className="mb-0">
                {submission.results.map((line, index) => (
                  <li key={index} className={line.includes("Passed") ? "text-success" : "text-danger"}>
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No results available.</p>
            )}
          </div>
          {/* Performance Stats */}
          <h5 className="mt-3">Performance</h5>
          <Table bordered>
            <tbody>
              <tr>
                <th>Execution Time</th>
                <td>{submission.real_time ? `${submission.real_time.toFixed(2)} s` : "N/A"}</td>
              </tr>
              <tr>
                <th>Memory Usage</th>
                <td>{submission.ram ? `${submission.ram.toFixed(2)} MB` : "N/A"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>

        {/* Right: User Code */}
        <Col md={6}>
          <h5>Your Submission</h5>
          <div className="border rounded">
            <MonacoEditor
              height="300px"
              language="python"
              theme="vs-dark"
              value={submission.code}
              options={{
                fontSize: 12,
                minimap: { enabled: false },
                readOnly: true,
                lineNumbers: "on",
              }}
            />
          </div>
          {/* Ranking Display */}
          {rankingData && (
            <div className="mt-4">
              <SubmissionRanking ranking={rankingData} />
            </div>
          )}
        </Col>
      </Row>

      {/* Previous Submissions Table */}
      <PreviousSubmissionsTable previous={previous} />
    </Container>
  );
}
