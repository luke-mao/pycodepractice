import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { BACKEND, DIFFICULTIES, TOPICS, STATUSES } from "../static/Constants";
import { useModal, useStore } from "../store/store";
import capitalize from "capitalize";
import { useNavigate } from "react-router";
import FileUpload from "../components/FileUpload";

/**
 * NewChallengeForm Component
 *
 * Displays a form for admins to create a new coding challenge, including metadata and file uploads.
 * Validates required fields and submits the challenge to the backend upon form completion.
 */
export default function NewChallengeForm() {
  const { showModal } = useModal();
  const { userInfo } = useStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("array");
  const [status, setStatus] = useState("draft");

  // File states
  const [descriptionFile, setDescriptionFile] = useState(null);
  const [submissionTemplateFile, setSubmissionTemplateFile] = useState(null);
  const [testcaseFile, setTestcaseFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);

  // Handle form submission.
  // the bootstrap will enforce all fields and files are filled before submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("difficulty", difficulty);
    formData.append("topic", topic);
    formData.append("status", status);
    formData.append("description", descriptionFile);
    formData.append("submission_template", submissionTemplateFile);
    formData.append("testcase", testcaseFile);
    formData.append("solution", solutionFile);

    // URL
    const url = `${BACKEND}/problem/`;

    const config = {
      headers: {
        Authorization: userInfo.token,
      },
    };

    try {  
      // Send request to backend
      const response = await axios.post(url, formData, config);

      // the new problem id is in the response
      const newChallengeId = response.data.problem_id;
  
      // Success Modal
      showModal({
        title: "Success",
        body: "New challenge created successfully!",
        showCancelButton: false,
        onOk: () => navigate(`/challenges/${newChallengeId}`),
      });
  
    } catch (error) {
      console.error("Submission failed:", error);
      showModal({
        title: "Submission Failed",
        body: error.response?.data?.message || "An error occurred. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Create New Challenge</h2>

      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Challenge Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        {/* Difficulty Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Difficulty</Form.Label>
          <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            {DIFFICULTIES.filter(d => d !== "All").map((diff) => (
              <option key={diff} value={diff}>{capitalize(diff)}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Topic Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Topic</Form.Label>
          <Form.Select value={topic} onChange={(e) => setTopic(e.target.value)} required>
            {TOPICS.filter(t => t !== "All").map((topic) => (
              <option key={topic} value={topic}>{capitalize.words(topic.replace("_", " "))}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Status Selection */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)} required>
            {STATUSES.filter(s => s !== "All").map((status) => (
              <option key={status} value={status}>{capitalize(status)}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* File Upload Section */}
        <h5 className="mb-1">Files</h5>
        <div className="mb-3">
          <a href={`${BACKEND}/uploads/template.zip`} target="_blank" rel="noopener noreferrer" className="fw-bold">
            📥 Download File Templates
          </a>
        </div>

        <FileUpload
          label="Description (description.md)"
          accept=".md"
          stateSetter={setDescriptionFile}
          requiredName="description.md"
          isShowCurrentDownload={false}
        />

        <FileUpload
          label="Submission Template (submission_template.py)"
          accept=".py"
          stateSetter={setSubmissionTemplateFile}
          requiredName="submission_template.py"
          isShowCurrentDownload={false}
        />

        <FileUpload
          label="Test Cases (testcase.py)"
          accept=".py"
          stateSetter={setTestcaseFile}
          requiredName="testcase.py"
          isShowCurrentDownload={false}
        />

        <FileUpload
          label="Solution (solution.py)"
          accept=".py"
          stateSetter={setSolutionFile}
          requiredName="solution.py"
          isShowCurrentDownload={false}
        />

        {/* Buttons */}
        <div className="d-flex justify-content-between gap-3 mt-3">
          <Button variant="secondary" onClick={() => navigate("/challenges")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
