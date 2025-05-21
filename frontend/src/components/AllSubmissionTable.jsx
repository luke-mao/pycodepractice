import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertTimeToDistance } from "../static/util";

/**
 * PaginatedAllSubmissionsTable Component
 *
 * Displays a paginated table of all user submissions with basic information and a link to view each in detail.
 * Shows execution time, memory usage, and pass/fail status for each submission.
 */
export default function PaginatedAllSubmissionsTable({ submissions }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginated = submissions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(submissions.length / pageSize);

  return (
    <>
      <h5 className="mt-3 mb-3">📋 All Submissions</h5>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Time</th>
            <th>Memory</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map(({ submission, problem }) => (
              <tr key={submission.submission_id}>
                <td>{convertTimeToDistance(submission.created_at)}</td>
                <td>{problem.title}</td>
                <td>{submission.is_pass ? "✅" : "❌"}</td>
                <td>{submission.real_time ? `${submission.real_time.toFixed(2)} s` : "N/A"}</td>
                <td>{submission.ram ? `${submission.ram.toFixed(2)} MB` : "N/A"}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/submission/${submission.submission_id}`)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center text-muted">No submissions yet.</td></tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
}
