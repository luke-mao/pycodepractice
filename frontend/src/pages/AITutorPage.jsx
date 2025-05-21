import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { BACKEND } from "../static/Constants";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AITutorDemoGIF from "../assets/ai-tutor-demo.gif";

/**
 * AITutorPage Component
 *
 * Introduces the AI Tutor feature, showcasing its capabilities and current usage.
 * Displays a usage summary for logged-in users and a call to action for guests to log in.
 */
export default function AITutorPage() {
  const { userInfo, isLogin } = useStore();
  const [remainingCredits, setRemainingCredits] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) return;
    
    const fetchCredits = async () => {
      try {
        const response = await axios.get(`${BACKEND}/ai-tutor/my-credit`, {
          headers: { Authorization: userInfo.token },
        });
        setRemainingCredits(response.data.remaining_credits);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCredits();
  }, [isLogin, userInfo?.token]);

  return (
    <Container className="py-4">
      {/* Intro Section */}
      <Row className="align-items-start mb-5">
        <Col xs={12} md={4}>
          <h3 className="mb-3">💡 Meet Your AI Tutor</h3>
          <p>
            Our AI Tutor is powered by <strong>OpenAI GPT-4o Mini</strong> to guide you through coding challenges step-by-step.
            It&apos;s like having an intelligent coding buddy who helps you think, debug, and learn without giving away the answer.
          </p>
          <ul>
            <li>🚀 100 free messages per day</li>
            <li>💾 Conversations saved per challenge</li>
            <li>🔁 Credits reset every 24 hours</li>
          </ul>

          {isLogin ? (
            <>
              {/* show the current remaining usage */}
              <h5 className="mt-4 mb-3">📊 Your Usage Today</h5>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6>Remaining Message Credits Today</h6>
                  <h2>{remainingCredits !== null ? remainingCredits : "..."}</h2>
                  <p className="text-muted">Out of 100</p>
                </Card.Body>
              </Card>
            </>
          ) : (
            <>
              <p className="mt-4">
                <em>Login to start chatting with your AI tutor and track your usage.</em>
              </p>
              <Button variant="primary" onClick={() => navigate("/login")}>
                🔐 Login to Try AI Tutor
              </Button>
            </>
          )}
        </Col>

        {/* GIF Area */}
        <Col xs={12} md={8} className="text-center">
          <Image
            src={AITutorDemoGIF}
            fluid
            className="rounded shadow"
            alt="AI tutor preview"
            style={{ maxHeight: "500px", width: "100%", objectFit: "contain" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </Col>
      </Row>
    </Container>
  );
}
