import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, Image, Button, Form } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { convertTimeToDistance } from "../static/util";
import { useStore, useModal } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router";

/**
 * Comment Component
 *
 * Renders an individual comment with user info, markdown content, and optional edit/delete controls for the author.
 * Supports editing with live preview, and deletion with confirmation modal.
 */
export default function Comment({ comment, user, fetchComments }) {
  const navigate = useNavigate();
  const { userInfo } = useStore();
  const { showModal } = useModal();

  const isOwnComment = userInfo?.user_id === user.user_id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editPreview, setEditPreview] = useState(false);

  const deleteComment = () => {
    showModal({
      title: "Delete Comment",
      body: "Are you sure you want to delete this comment?",
      okText: "Yes, Delete",
      cancelText: "No",
      showCancelButton: true,
      onOk: async () => {
        const url = `${BACKEND}/comment/${comment.comment_id}`;
        const config = { headers: { Authorization: userInfo.token } };

        try {
          await axios.delete(url, config);
          showModal({
            title: "Deleted",
            body: "Comment deleted successfully.",
            showCancelButton: false,
            onOk: () => fetchComments(),
          });
        } catch (err) {
          console.error(err);
          showModal({
            title: "Delete Error",
            body: "Failed to delete the comment. Please try again later.",
            showCancelButton: false,
            onOk: () => {},
          });
        }
      },
    });
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      showModal({
        title: "Edit Error",
        body: "Comment content cannot be empty.",
        showCancelButton: false,
        onOk: () => {},
      });
      return;
    }

    const url = `${BACKEND}/comment/${comment.comment_id}`;
    const data = { content: editContent };
    const config = { headers: { Authorization: userInfo.token } };

    try {
      await axios.put(url, data, config);
      setIsEditing(false);
      setEditPreview(false);
      fetchComments();

      showModal({
        title: "Edit Successful",
        body: "Comment updated successfully.",
        showCancelButton: false,
        onOk: () => {},
      });
    } catch (err) {
      console.error(err);
      showModal({
        title: "Edit Failed",
        body: err.response?.data?.message || "Unable to save your changes.",
        showCancelButton: false,
        onOk: () => {},
      });
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center">
            {/* click on the avatar goes to the /profile/:userId page */}
            <Image 
              src={`${BACKEND}/${user.avatar}`} 
              roundedCircle 
              width={40} 
              height={40} 
              className="me-2" 
              onClick={() => navigate(`/profile/${user.user_id}`)} 
              style={{ cursor: "pointer" }}
            />
            <div>
              <strong>{user.username}</strong><br />
              <small className="text-muted">{convertTimeToDistance(comment.created_at)}</small>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <ReactMarkdown
            components={{
              h1: "h3",
              h2: "h4",
              h3: "h5",
              h4: "h6",
            }}
          >
            {comment.content}
          </ReactMarkdown>
        ) : (
          <>
            {!editPreview ? (
              <Form.Control
                as="textarea"
                rows={5}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="mb-2"
              />
            ) : (
              <div className="border rounded p-3 mb-3 bg-light">
                <strong>Preview:</strong>
                <ReactMarkdown>{editContent}</ReactMarkdown>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Check
                type="switch"
                id={`preview-switch-${comment.comment_id}`}
                label={editPreview ? "Off" : "Preview"}
                checked={editPreview}
                onChange={() => setEditPreview(!editPreview)}
              />
              <div className="d-flex gap-2">
                <Button size="sm" variant="primary" onClick={saveEdit}>
                  Update
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </Card.Body>

      {!isEditing && isOwnComment && (
        <Card.Footer className="d-flex justify-content-end">
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-secondary" 
              onClick={() => {
                setIsEditing(true);
                setEditContent(comment.content);
                setEditPreview(false);
              }}>
              Edit
            </Button>
            <Button size="sm" variant="outline-danger" onClick={deleteComment}>
              Delete
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}
