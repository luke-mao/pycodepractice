import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { BACKEND, DIFFICULTIES, TOPICS, STATUSES } from "../static/Constants";
import { useModal, useStore } from "../store/store";
import capitalize from "capitalize";
import FileUpload from "../components/FileUpload";

/**
 * EditChallenge Component
 *
 * Allows admins to edit an existing coding challenge, including metadata and related files.
 * Pre-fills existing data and supports updating the description, template, test cases, and solution.
 */
export default function EditChallenge() {
  const { showModal } = useModal();
  const { userInfo } = useStore();
  const navigate = useNavigate();
  const { challengeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("array");
  const [status, setStatus] = useState("draft");
  const [folderUrl, setFolderUrl] = useState("");

  // File states (keep empty initially)
  const [descriptionFile, setDescriptionFile] = useState(null);
  const [submissionTemplateFile, setSubmissionTemplateFile] = useState(null);
  const [testcaseFile, setTestcaseFile] = useState(null);
  const [solutionFile, setSolutionFile] = useState(null);

  // Fetch existing problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`${BACKEND}/problem/${challengeId}`);
        const problem = response.data;

        // Set initial values
        setTitle(problem.title);
        setDifficulty(problem.difficulty);
        setTopic(problem.topic);
        setStatus(problem.status);
        setFolderUrl(problem.folder_url);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [challengeId]);

  // Handle form submission
  const updateChallenge = async () => {
    // Prepare the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("difficulty", difficulty);
    formData.append("topic", topic);
    formData.append("status", status);
  
    // Append files **ONLY if user uploads a new one**
    if (descriptionFile) formData.append("description", descriptionFile);
    if (submissionTemplateFile) formData.append("submission_template", submissionTemplateFile);
    if (testcaseFile) formData.append("testcase", testcaseFile);
    if (solutionFile) formData.append("solution", solutionFile);
  
    // Backend route
    const url = `${BACKEND}/problem/${challengeId}`;
  
    const config = {
      headers: {
        Authorization: userInfo.token,
      },
    };
  
    try {
      // Send request to update the problem
      await axios.put(url, formData, config);
  
      // Show success message
      showModal({
        title: "Success",
        body: "Challenge updated successfully!",
        showCancelButton: false,
        onOk: () => navigate(`/challenges/${challengeId}`),
      });
  
    } catch (error) {
      console.error("Update failed:", error);
      showModal({
        title: "Update Failed",
        body: error.response?.data?.message || "An error occurred. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };
  
  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Edit Challenge</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading challenge details...</p>
        </div>
      ) : (
        <Form>
          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          {/* Difficulty Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Difficulty</Form.Label>
            <Form.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.filter(d => d !== "All").map((diff) => (
                <option key={diff} value={diff}>{capitalize(diff)}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Topic Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.filter(t => t !== "All").map((topic) => (
                <option key={topic} value={topic}>{capitalize.words(topic.replace("_", " "))}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Status Selection */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.filter(s => s !== "All").map((status) => (
                <option key={status} value={status}>{capitalize(status)}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* File Upload Section */}
          <h5 className="mb-1">Files</h5>
          <p className="text-muted">Only upload files if you want to update them.</p>
          
          <FileUpload
            label="Description (description.md)"
            accept=".md"
            stateSetter={setDescriptionFile}
            requiredName="description.md"
            isShowCurrentDownload={true}
            downloadUrl={`${BACKEND}/${folderUrl}/description.md`}
          />

          <FileUpload
            label="Submission Template (submission_template.py)"
            accept=".py"
            stateSetter={setSubmissionTemplateFile}
            requiredName="submission_template.py"
            isShowCurrentDownload={true}
            downloadUrl={`${BACKEND}/${folderUrl}/submission_template.py`}
          />

          <FileUpload
            label="Test Cases (testcase.py)"
            accept=".py"
            stateSetter={setTestcaseFile}
            requiredName="testcase.py"
            isShowCurrentDownload={true}
            downloadUrl={`${BACKEND}/${folderUrl}/testcase.py`}
          />

          <FileUpload
            label="Solution (solution.py)"
            accept=".py"
            stateSetter={setSolutionFile}
            requiredName="solution.py"
            isShowCurrentDownload={true}
            downloadUrl={`${BACKEND}/${folderUrl}/solution.py`}
          />

          {/* Buttons */}
          <div className="d-flex justify-content-between gap-3 mt-3">
            <Button variant="secondary" onClick={() => navigate("/challenges")}>
              Cancel
            </Button>
            <Button variant="primary" onClick={updateChallenge}>
              Update
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
