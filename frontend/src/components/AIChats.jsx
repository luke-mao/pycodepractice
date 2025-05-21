import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { useStore, useModal } from "../store/store";
import { convertTimeToDistance } from "../static/util";
import AITutorMessage from "./AITutorMessage";

/**
 * AIChats Component
 *
 * Displays the user's AI tutor conversations for a specific problem.
 * Fetches the conversations from the backend and renders them in an accordion view.
 */
export default function AIChats({ problemId }) {
  const { userInfo } = useStore();
  const { showModal } = useModal();

  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `${BACKEND}/ai-tutor/problem/${problemId}`,
          {
            headers: {
              Authorization: userInfo.token,
            },
          }
        );
        setConversations(response.data);
      } catch (error) {
        console.error(error);
        showModal({
          title: "Failed to Load AI Chats",
          body: error.response?.data?.message || "Please try again later.",
          showCancelButton: false,
          onOk: () => {},
        });
      }
    };

    fetchConversations();
  }, [problemId, userInfo.token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h6 className="mb-3">Your Conversations with GPT Tutor</h6>
      {conversations.length === 0 ? (
        <p className="text-muted">No conversations yet.</p>
      ) : (
        <Accordion alwaysOpen>
          {conversations.map((conv, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={conv.conversation_id}>
              <Accordion.Header>
                {convertTimeToDistance(conv.created_at)}
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: "#f8f9fa" }}>
                {conv.messages.map((msg, i) => (
                  <AITutorMessage key={i} message={msg} />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
}
