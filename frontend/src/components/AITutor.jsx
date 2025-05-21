import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { useStore, useModal } from "../store/store";
import AITutorMessage from "./AITutorMessage";

/**
 * AITutor Component
 *
 * Provides a live chat interface for users to interact with the GPT-powered coding tutor.
 * Manages message state, credit tracking, and handles both new and ongoing AI conversations.
 */
export default function AITutor({ problemId }) {
  const { userInfo } = useStore();
  const { showModal } = useModal();

  // useRef to scroll to the bottom
  const bottomRef = useRef(null);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [remainingCredits, setRemainingCredits] = useState(100);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!userInfo) return;

      const url = `${BACKEND}/ai-tutor/my-credit`;
      const config = { headers: { Authorization: userInfo.token }};
      
      try {
        const response = await axios.get(url, config);
        setRemainingCredits(response.data.remaining_credits);
      } catch (error) {
        console.error("Failed to load GPT credits", error);
        showModal({
          title: "Error Loading Credits",
          body: "Unable to fetch your GPT credit balance.",
          showCancelButton: false,
          onOk: () => {}
        });
      }
    };
  
    fetchCredits();
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);

    // Add user message to local state
    const newMessages = [...messages, {
      role: "user",
      content: trimmed,
      avatar: `${BACKEND}/${userInfo.avatar}`,
    }];

    setMessages(newMessages);
    setInput("");

    // when it is a new conversation, use the problemId.
    // and for ongoing conversation, use the conversationId
    const url = conversationId
      ? `${BACKEND}/ai-tutor/${conversationId}`
      : `${BACKEND}/ai-tutor/problem/${problemId}`;

    const config = { headers: { Authorization: userInfo.token }};
    const payload = { message: trimmed };

    try {
      const response = await axios.post(url, payload, config);

      // { conversation: {}, remaining_credits: xx }
      const responseData = response.data;

      if (!conversationId && responseData.conversation.conversation_id) {
        setConversationId(responseData.conversation.conversation_id);
      }

      // responseData.messages contain all the messages, 
      // each message = { role: 'user'/'assistant', content: 'message' }
      setMessages(responseData.conversation.messages);
      setRemainingCredits(responseData.remaining_credits);
    } catch (error) {
      console.error(error);
      showModal({
        title: "AI Tutor Error",
        body: error.response?.data?.message || "Something went wrong. Please try again later.",
        showCancelButton: false,
        onOk: () => {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // when the messages change, scroll to the bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      {/* Message Area */}
      <div className="mb-2 flex-grow-1 overflow-auto border rounded p-3" style={{ backgroundColor: "#f8f9fa", height: "80%" }}>
        {messages.map((message, index) => (
          <AITutorMessage key={index} message={message} />
        ))}
        {messages.length === 0 && (
          <div className="text-muted text-center pt-5">
            Start a conversation with the GPT Tutor...
          </div>
        )}
        {/* useRef for scroll to bottom */}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <Form.Control
        disabled={loading || remainingCredits === 0}
        as="textarea"
        rows={3}
        placeholder={messages.length === 0 ? "Can you give me a hint?" : "Continue the conversation..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-grow-1"
      />
      <div className="d-flex mt-2 justify-content-between align-items-center">
        <small className={`${remainingCredits === 0 ? "text-danger" : "text-muted"}`} style={{ fontSize: "0.8rem" }}>
          {remainingCredits === 0
            ? "GPT Messages credit will reset tomorrow."
            : `GPT Messages left: ${remainingCredits}`}
        </small>
        <Button
          size="sm"
          variant={remainingCredits === 0 ? "secondary" : "primary"}
          onClick={sendMessage}
          disabled={loading || remainingCredits === 0}
        >
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
