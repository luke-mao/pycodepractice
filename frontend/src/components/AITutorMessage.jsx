import React from "react";
import { Image } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useStore } from "../store/store";
import GPTAvatar from "../assets/chat-gpt.png";
import { BACKEND } from "../static/Constants";

/**
 * AITutorMessage Component
 *
 * Renders a single AI tutor chat message with appropriate styling based on the sender's role.
 * Supports markdown rendering and displays avatars for both user and assistant.
 */
export default function AITutorMessage({ message }) {
  const { userInfo } = useStore();

  // role: user, assistant
  const isUser = message.role === "user";

  return (
    <div className={`d-flex mb-3 ${isUser ? "justify-content-end" : "justify-content-start"} align-items-start`}>
      {!isUser && (
        <Image
          src={GPTAvatar}
          roundedCircle
          width={32}
          height={32}
          className="me-3"
        />
      )}
      <div style={{ maxWidth: "90%" }} className={`rounded pt-1 ${isUser ? "bg-primary text-white px-2" : "bg-light"}`}>
        <ReactMarkdown
          components={{
            h1: "h3",
            h2: "h4",
            h3: "h5",
            h4: "h6",
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <Image
          src={`${BACKEND}/${userInfo.avatar}`}
          roundedCircle
          width={32}
          height={32}
          className="ms-3"
        />
      )}
    </div>
  );
}
