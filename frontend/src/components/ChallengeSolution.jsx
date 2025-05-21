import React, { useEffect, useState } from "react";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import { Button, Spinner } from "react-bootstrap";
import { FaCopy } from "react-icons/fa";

/**
 * ChallengeSolution Component
 *
 * Displays a read-only code editor showing the reference solution for a challenge.
 * Fetches the solution from a given URL and allows users to copy it to the clipboard.
 */
export default function ChallengeSolution({ solutionUrl, editorTheme }) {
  const [solutionCode, setSolutionCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const response = await axios.get(solutionUrl);
        setSolutionCode(response.data);
      } catch (error) {
        console.error("Error fetching solution:", error);
        setSolutionCode("# Error loading solution.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [solutionUrl]);

  // Copy to clipboard function
  const handleCopy = () => {
    navigator.clipboard.writeText(solutionCode).then(() => {
      setCopied(true);
      // time out 1.5s
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="solution-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Reference Solution</h5>
        <Button variant="outline-secondary" size="sm" onClick={handleCopy}>
          <FaCopy className="me-2" /> {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading solution...</p>
        </div>
      ) : (
        <MonacoEditor
          height="300px"
          language="python"
          value={solutionCode}
          theme={editorTheme}
          options={{
            fontSize: 12,
            minimap: { enabled: false },
            readOnly: true,
            lineNumbers: "on",
            padding: { top: 10 },
          }}
        />
      )}
    </div>
  );
}
