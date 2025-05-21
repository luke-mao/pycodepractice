import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { useStore } from "../store/store";
import { Spinner, Row, Col, Card } from "react-bootstrap";
import UserCard from "../components/UserCard";
import AllSubmissionTable from "../components/AllSubmissionTable";
import SubmissionFrequencyChart from "../components/SubmissionFrequencyChart";

/**
 * UserProfilePage Component
 *
 * Displays the logged-in user's profile along with submission statistics, submission history, and activity frequency.
 * Combines multiple data views including a profile card, summary, bar chart, and detailed table.
 */
export default function UserProfilePage() {
  const { userInfo } = useStore();
  const actualUserId = userInfo.user_id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [frequency, setFrequency] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const config = { headers: { Authorization: userInfo.token } };

        const profileRes = await axios.get(`${BACKEND}/profile/${actualUserId}`);
        const summaryRes = await axios.get(`${BACKEND}/profile/submission/summary`, config);
        const submissionsRes = await axios.get(`${BACKEND}/submission/all`, config);
        const frequencyRes = await axios.get(`${BACKEND}/profile/submission/frequency`, config);

        setProfile(profileRes.data);
        setSummary(summaryRes.data);
        setAllSubmissions(submissionsRes.data);
        setFrequency(frequencyRes.data);
      } catch (err) {
        console.error("Failed to load profile or submission data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [actualUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="container mt-4 pb-3">
      <Row className="g-4">
        <Col xs={12} md={4}>
          <UserCard profile={profile} />
        </Col>
        <Col xs={12} md={8}>
          {summary && (
            <Card className="mb-4 p-3 shadow-sm" style={{ width: "100%" }}>
              <h5>📈 Statistics</h5>
              <ul className="mb-0" style={{ listStyle: "none", paddingLeft: 0 }}>
                <li>🧾 Total Submissions: <strong>{summary.total_submission}</strong></li>
                <li>✅ Total Passed: <strong>{summary.total_passed}</strong></li>
                <li>📅 Last 7 Days: <strong>{summary.total_submission_7_days}</strong> submissions, <strong>{summary.total_passed_7_days}</strong> passed</li>
              </ul>
            </Card>
          )}
          {frequency.length > 0 && (
            <Card className="mb-4 p-3 shadow-sm">
              <SubmissionFrequencyChart data={frequency} />
            </Card>
          )}
        </Col>
      </Row>
      <AllSubmissionTable submissions={allSubmissions} />
    </div>
  );
}
