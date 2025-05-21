import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * ChallengeDescription Component
 *
 * Renders the markdown-formatted problem description inside a styled container.
 * Automatically adjusts heading levels for consistent appearance.
 */
export default function ChallengeDescription({ markdown }) {
  return (
    <div
      style={{
        fontSize: "0.85rem",
        backgroundColor: "#f8f9fa",
        padding: "5px 10px",
        borderRadius: "5px",
        height: "100%",
      }}
    >
      <ReactMarkdown 
        components={{
          h1: "h3",
          h2: "h4",
          h3: "h5",
          h4: "h6",
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
