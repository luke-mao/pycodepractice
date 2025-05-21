import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { BACKEND, DIFFICULTIES, TOPICS } from "../static/Constants";
import axios from "axios";
import ChallengesTable from "../components/ChallengesTable";
import capitalize from "capitalize";

/**
 * ChallengesUser Component
 *
 * Displays a list of published coding challenges for regular users, with filtering by difficulty and topic.
 * Uses the ChallengesTable component in non-admin mode.
 */
export default function ChallengesUser() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");

  useEffect(() => {
    axios
      .get(`${BACKEND}/problem/`)
      .then((response) => {
        // Filter only "published" problems for users
        const publishedProblems = response.data.filter(p => p.status === "published");
        setProblems(publishedProblems);
        setFilteredProblems(publishedProblems);
      })
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  useEffect(() => {
    let filtered = problems;
    if (difficultyFilter !== "All") filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    if (topicFilter !== "All") filtered = filtered.filter((p) => p.topic === topicFilter);
    setFilteredProblems(filtered);
  }, [difficultyFilter, topicFilter, problems]);


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Challenges</h2>

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
      </div>

      {/* Challenges Table for Users */}
      <ChallengesTable problems={filteredProblems} isAdmin={false} />
    </div>
  );
}
