import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { BACKEND, DIFFICULTIES, STATUSES, TOPICS } from "../static/Constants";
import axios from "axios";
import ChallengesTable from "../components/ChallengesTable";
import capitalize from "capitalize";

/**
 * ChallengesAdmin Component
 *
 * Provides an admin interface to manage coding challenges with filters by difficulty, topic, and status.
 * Displays a filtered list using the ChallengesTable component.
 */
export default function ChallengesAdmin() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`${BACKEND}/problem/`)
      .then((response) => {
        setProblems(response.data);
        setFilteredProblems(response.data);
      })
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  useEffect(() => {
    let filtered = problems;
    if (difficultyFilter !== "All") filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    if (topicFilter !== "All") filtered = filtered.filter((p) => p.topic === topicFilter);
    if (statusFilter !== "All") filtered = filtered.filter((p) => p.status === statusFilter);
    setFilteredProblems(filtered);
  }, [difficultyFilter, topicFilter, statusFilter, problems]);

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Challenges Management</h2>

      {/* Filters */}
      <div className="d-flex gap-3 mb-3">
        <Form.Group>
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
            {DIFFICULTIES.map((diff) => <option key={diff} value={diff}>{capitalize(diff)}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Topic</Form.Label>
          <Form.Select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}>
            {TOPICS.map((topic) => <option key={topic} value={topic}>{capitalize.words(topic.replace("_", " "))}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUSES.map((status) => <option key={status} value={status}>{capitalize(status)}</option>)}
          </Form.Select>
        </Form.Group>
      </div>

      {/* Challenges Table */}
      <ChallengesTable problems={filteredProblems} isAdmin={true} />
    </div>
  );
}
