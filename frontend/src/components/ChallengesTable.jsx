import React from "react";
import { Table, Form } from "react-bootstrap";
import { BACKEND, STATUSES } from "../static/Constants";
import { FaDownload, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import capitalize from "capitalize";
import { useModal, useStore } from "../store/store";

/**
 * ChallengesTable Component
 *
 * Displays a table of coding challenges with basic info such as title, difficulty, and topic.
 * If the user is an admin, includes controls for status updates, file downloads, and editing.
 */
export default function ChallengesTable({ problems, isAdmin }) {
  const navigate = useNavigate();
  const { userInfo } = useStore();
  const { showModal } = useModal();

  // Function to handle status update
  const updateStatus = async (problemId, newStatus) => {
    const url = `${BACKEND}/problem/${problemId}`;
    
    // create the form data
    const data = new FormData();
    data.append("status", newStatus);

    const config = { headers: { Authorization: userInfo.token } };

    try {
      await axios.put(url, data, config);
      window.location.reload();
    } catch (error) {
      showModal({
        title: "Update Failed",
        body: error.response?.data?.message || "Failed to update status. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Topic</th>
          {isAdmin && (
            <>
              <th>Status</th>
              <th>All Files</th>
              <th>Action</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {problems.length > 0 ? (
          problems.map((problem) => (
            <tr key={problem.problem_id}>
              <td>P{problem.problem_id}</td>
              <td>
                <Link to={`/challenges/${problem.problem_id}`} style={{ textDecoration: "none", color: "#007bff" }}>
                  {problem.title}
                </Link>
              </td>
              <td>{capitalize(problem.difficulty)}</td>
              <td>{capitalize.words(problem.topic.replace("_", " "))}</td>

              {isAdmin && (
                <>
                  {/* Status Dropdown */}
                  <td>
                    <Form.Select
                      size="sm"
                      value={problem.status}
                      onChange={(e) => updateStatus(problem.problem_id, e.target.value)}
                    >
                      {STATUSES.filter((s) => s !== "All").map((status) => (
                        <option key={status} value={status}>
                          {capitalize(status)}
                        </option>
                      ))}
                    </Form.Select>
                  </td>

                  {/* Download All Files */}
                  <td className="text-center">
                    <a href={`${BACKEND}/problem/${problem.problem_id}/download`} target="_blank" rel="noopener noreferrer">
                      <FaDownload title="Download All Files" />
                    </a>
                  </td>

                  {/* Edit Button */}
                  <td className="text-center">
                    <FaEdit
                      title="Edit Problem"
                      style={{ cursor: "pointer", color: "#007bff" }}
                      onClick={() => navigate(`/challenges/${problem.problem_id}/edit`)}
                    />
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={isAdmin ? "7" : "4"} className="text-center">No challenges found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
