import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import ReactMarkdown from "react-markdown";
import { Container, Form, Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { parse } from "date-fns";
import { useModal, useStore } from "../store/store";

/**
 * ChallengeForum Component
 *
 * Displays a comment section for a coding challenge, allowing users to read, sort, preview, and submit markdown-supported comments.
 * Comments can be sorted by newest or oldest, and a live preview toggle is available for new input.
 */
export default function ChallengeForum({ problemId }) {
  const { showModal } = useModal();
  const { userInfo } = useStore();

  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");
  const [newComment, setNewComment] = useState("");
  const [preview, setPreview] = useState(false);

  // this function is used to fetch comments for this problem
  // it is used to fetch problems initially, and during reloading
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${BACKEND}/comment/problem/${problemId}`);
      setComments(response.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sortedComments = [...comments].sort((a, b) => {
    // format: HH:MM:SS DD/MM/YYYY
    const format = "HH:mm:ss dd/MM/yyyy";
    const dateA = parse(a.comment.created_at, format, new Date());
    const dateB = parse(b.comment.created_at, format, new Date());

    // sort by latest or earliest
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  const submitComment = async () => {
    // the input cannot be empty
    if (!newComment) {
      showModal({
        title: "Comment Submission Error",
        body: "Comment cannot be empty!",
        showCancelButton: false,
        onOk: () => {},
      });

      return;
    }

    // API call
    const url = `${BACKEND}/comment/problem/${problemId}`;
    const data = { content: newComment };
    const config = { headers: { Authorization: userInfo.token } };

    try {
      await axios.post(url, data, config);

      // reset the forum page
      setNewComment("");
      fetchComments();

      showModal({
        title: "Comment Submitted",
        body: "Comment submitted successfully.",
        showCancelButton: false,
        onOk: () => {},
      });
    } catch (error) {
      console.error(error);
      showModal({
        title: "Comment Submission Failed",
        body: error.response?.data?.message || "Failed to submit comment. Please try again.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };

  return (
    <Container>
      {/* label and sorting toggle in one row */}
      <div className="d-flex justify-content-between align-items-center pb-3">
        <h5>Forum</h5>
        <ToggleButtonGroup
          type="radio"
          name="sortOrder"
          value={sortOrder}
          onChange={val => setSortOrder(val)}
        >
          <ToggleButton id="sort-latest" value="latest" variant="outline-primary" size="sm">
            Latest
          </ToggleButton>
          <ToggleButton id="sort-earliest" value="earliest" variant="outline-primary" size="sm">
            Earliest
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {/* Render Comments */}
      {sortedComments.map((item, idx) => (
        <Comment key={idx} comment={item.comment} user={item.user} fetchComments={fetchComments} />
      ))}

      {/* New Comment Input */}
      <h6 className="pt-2 pb-1">Add a Comment (Markdown Supported)</h6>

      {/* the following switches between preview and input field */}
      {!preview ? (
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Write your comment here..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-2"
        />
      ) : (
        <div className="border rounded p-3 mb-3 bg-light">
          <strong>Preview:</strong>
          <ReactMarkdown>{newComment}</ReactMarkdown>
        </div>
      )}
      {/* submit button to the left */}
      <div className="d-flex justify-content-between align-items-center">
        <Form.Check
          type="switch"
          id="preview-switch"
          label={preview ? "Off" : "Preview"}
          checked={preview}
          onChange={() => setPreview(!preview)}
        />
        <Button variant="primary" size="sm" onClick={submitComment}>Post Comment</Button>
      </div>
    </Container>
  );
}
