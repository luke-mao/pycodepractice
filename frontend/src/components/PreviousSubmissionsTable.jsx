import React, { useState } from "react";
import { Table, Button, Collapse } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertTimeToDistance } from "../static/util";

/**
 * PreviousSubmissionsTable Component
 *
 * Displays a list of a user's previous submissions for a challenge, including status, performance metrics, and expandable test results.
 * Allows navigation to the detailed submission page.
 */
export default function PreviousSubmissionsTable({ previous }) {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);

  return (
    <>
      <h5 className="mt-4">All Submissions</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Status</th>
            <th>Result</th>
            <th>Execution Time</th>
            <th>Memory Usage</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {previous.length > 0 ? (
            previous.map((prev) => (
              <React.Fragment key={prev.submission_id}>
                {/* Main Row */}
                <tr>
                  <td>{convertTimeToDistance(prev.created_at)}</td>
                  <td>{prev.is_pass ? "✅" : "❌"}</td>
                  <td
                    className={prev.is_pass ? "text-success" : "text-danger"}
                    onClick={() => setExpandedRow(expandedRow === prev.submission_id ? null : prev.submission_id)}
                    style={{ cursor: "pointer" }}
                  >
                    {prev.results
                      ? prev.results[0].length > 50
                        ? `${prev.results[0].slice(0, 50)}...`
                        : `${prev.results[0]}...`
                      : "Pending"}
                  </td>
                  <td>{prev.real_time ? `${prev.real_time.toFixed(2)} s` : "N/A"}</td>
                  <td>{prev.ram ? `${prev.ram.toFixed(2)} MB` : "N/A"}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/submission/${prev.submission_id}`)}>
                      View
                    </Button>
                  </td>
                </tr>

                {/* Expandable Row */}
                <tr>
                  <td colSpan="5" style={{ padding: 0, borderTop: "none" }}>
                    <Collapse in={expandedRow === prev.submission_id}>
                      <div className="p-3 bg-light border rounded">
                        <h6>Full Test Results</h6>
                        <ul className="mb-0">
                          {prev.results?.map((line, index) => (
                            <li key={index} className={line.includes("Passed") ? "text-success" : "text-danger"}>
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">No previous submissions found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
