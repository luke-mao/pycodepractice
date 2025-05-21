import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND } from "../static/Constants";
import { Container, Row, Col, Spinner, Badge, Stack, Tabs, Tab } from "react-bootstrap";
import capitalize from "capitalize";
import { useModal, useStore } from "../store/store";
import Editor from "../components/Editor";

// Import all the tab components used on this page
import ChallengeDescription from "../components/ChallengeDescription";
import ChallengeSolution from "../components/ChallengeSolution";
import ChallengeForum from "../components/ChallengeForum";
import ChallengeSubmissionTab from "../components/ChallengeSubmissionTab";
import AITutor from "../components/AITutor";
import AIChats from "../components/AIChats";

/**
 * ChallengePage Component
 *
 * Displays a full challenge interface including the problem description, solution, forum, submissions, AI chats, code editor, and AI tutor.
 * Adjusts content and tab access based on the user's login status.
 */
export default function ChallengePage() {
  const { isLogin, userInfo } = useStore();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const { challengeId } = useParams();

  const [problem, setProblem] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("# Write your solution here...\n");
  const [codeTemplate, setCodeTemplate] = useState("");  // Store initial template
  const [editorTheme, setEditorTheme] = useState("vs-dark"); // Default theme

  // Left: 4 tabs: Description, Solution, Forum, Submissions
  const [activeTab, setActiveTab] = useState("description");

  // Right: 2 tabs: Code Editor, AI Tutor
  const [activeTabRight, setActiveTabRight] = useState("editor");

  // submission loading
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND}/problem/${challengeId}`);
        setProblem(response.data);

        // Fetch markdown description file
        const markdownResponse = await axios.get(`${BACKEND}/${response.data.folder_url}/description.md`);
        setMarkdown(markdownResponse.data.split("\n").slice(1).join("\n")); // Remove first line (title)

        // Fetch the submission_template file
        const template = await axios.get(`${BACKEND}/${response.data.folder_url}/submission_template.py`);
        setCode(template.data);
        setCodeTemplate(template.data);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [challengeId]);

  // Handle Submission
  const handleSubmit = async () => {
    if (!code.trim()) {
      showModal({
        title: "Code Submission Error",
        body: "Please write your code before submitting.",
        showCancelButton: false,
        onOk: () => {},
      });
      return;
    }

    const url = `${BACKEND}/submission/${challengeId}`;
    const data = { code };
    const config = { headers: { Authorization: userInfo.token } };

    setSubmitLoading(true);

    try {
      const response = await axios.post(url, data, config);
      navigate(`/submission/${response.data.submission_id}`);
    } catch (error) {
      console.error(error);
      showModal({
        title: "Submission Error",
        body: error.response?.data?.message || "An error occurred. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
      setSubmitLoading(false);
    }
  };

  return (
    <Container fluid className="ms-0 me-0 mt-3 mb-3">
      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <h6 className="mt-4">Loading problem...</h6>
        </div>
      )}
      {submitLoading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <h6 className="mt-4">Running your code...</h6>
        </div>
      )}
      {/* No problem loading and no submission loading */}
      {!loading && !submitLoading && problem && (
        <Row className="g-3">
          {/* Left Side - Tabs for Description, Solution, Forum, Submissions overflowY: "auto", maxHeight: "85vh", */}
          <Col md={6} xs={12} className="pb-3" style={{ height: "85vh", overflowY: "auto", borderRadius: "10px" }}>
            {/* title - difficulty - topic */}
            <Stack direction="horizontal" gap={3} className="mb-2">
              <h3 className="me-4">{`P${challengeId} - ${problem.title}`}</h3>
              <Badge bg="secondary">{capitalize(problem.difficulty)}</Badge>
              <Badge bg="info">{capitalize.words(problem.topic.replace("_", " "))}</Badge>
            </Stack>

            {/* Tab Navigation: for login user, show full tab, not login user, only the description tab */}
            {/* user sees all tabs, admin cannot see the submissions, ai-chats */}
            {isLogin ? (
              <Tabs
                id="challenge-tabs"
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="mb-3"
              >
                <Tab eventKey="description" title="Description">
                  {activeTab === "description" && <ChallengeDescription markdown={markdown} />}
                </Tab>
                <Tab eventKey="solution" title="Solution">
                  {/* <ChallengeSolution solutionUrl={`${BACKEND}/${problem.folder_url}/solution.py`} editorTheme={editorTheme} /> */}
                  {activeTab === "solution" && <ChallengeSolution solutionUrl={`${BACKEND}/${problem.folder_url}/solution.py`} editorTheme={editorTheme} />}
                </Tab>
                <Tab eventKey="forum" title="Forum">
                  {/* <ChallengeForum problemId={challengeId} /> */}
                  {activeTab === "forum" && <ChallengeForum problemId={challengeId} />}
                </Tab>
                {/* hide for admin */}
                {userInfo.role !== "admin" && (
                  <Tab eventKey="submissions" title="My Submissions">
                    {/* <ChallengeSubmissionTab problemId={challengeId} /> */}
                    {activeTab === "submissions" && <ChallengeSubmissionTab problemId={challengeId} />}
                  </Tab>
                )}
                {userInfo.role !== "admin" && (
                  <Tab eventKey="ai-chats" title="AI Chats">
                    {/* <AIChats problemId={challengeId} /> */}
                    {activeTab === "ai-chats" && <AIChats problemId={challengeId} />}
                  </Tab>
                )}
              </Tabs>
            ) : (
              <Tabs
                id="challenge-tabs"
                activeKey={activeTab}
                onSelect={(tab) => setActiveTab(tab)}
                className="mb-3"
              >
                <Tab eventKey="description" title="Description">
                  <ChallengeDescription markdown={markdown} />
                </Tab>
              </Tabs>
            )}
          </Col>

          {/* Right Side - Code Editor */}
          {isLogin ? (
            <Col md={6} xs={12} style={{ height: "85vh", borderRadius: "10px" }}>
              <Tabs
                id="challenge-tabs-right"
                activeKey={activeTabRight}
                onSelect={(tab) => setActiveTabRight(tab)}
                className="mb-3"
              >
                <Tab eventKey="editor" title="Code Editor">
                  <Editor 
                    theme={editorTheme} 
                    setTheme={setEditorTheme} 
                    code={code} 
                    setCode={setCode}
                    codeTemplate={codeTemplate} 
                    onSubmit={handleSubmit} 
                    isLogin={isLogin} 
                    userRole={userInfo?.role} 
                  />
                </Tab>
                {/* hide for admin */}
                {userInfo.role !== "admin" && (
                  <Tab eventKey="tutor" title="AI Tutor">
                    <AITutor problemId={challengeId} />
                  </Tab>
                )}
              </Tabs>
            </Col>
          ) : (
            <Col md={6} xs={12} style={{ maxHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ 
                textAlign: "center", 
                backgroundColor: "#f8f9fa", 
                padding: "20px", 
                borderRadius: "10px", 
                width: "100%",
                maxWidth: "400px" 
              }}>
                <h5 className="mb-3">🔒 Please Login to Attempt the Challenge</h5>
                <p className="text-muted">Sign in to write and submit your code.</p>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-primary" onClick={() => navigate("/login")}>Login</button>
                  <button className="btn btn-outline-secondary" onClick={() => navigate("/signup")}>Register</button>
                </div>
              </div>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}
