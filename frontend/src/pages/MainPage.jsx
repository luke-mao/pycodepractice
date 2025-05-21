import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useStore } from "../store/store";
import { useNavigate } from "react-router-dom";
import { BACKEND } from "../static/Constants";
import HeroSection from "../components/HeroSection";
import FeatureCard from "../components/FeatureCard";
import Testimonial from "../components/Testimonial";
import BottomCTA from "../components/BottomCTA";
import ChallengeCard from "../components/ChallengeCard";
import RecentChallengeCard from "../components/RecentChallengeCard";
import AITutorDemo2 from "../assets/ai-tutor-demo-2.gif";

/**
 * MainPage Component
 *
 * Serves as the landing page, showing different content based on user role:
 * - Guests see feature highlights and testimonials.
 * - Logged-in users see recent submissions, a daily challenge, and GPT credit usage.
 * - Admins access management tools for challenges and users.
 */
export default function MainPage() {
  const { isLogin, userInfo } = useStore();
  const navigate = useNavigate();

  const [recentChallenges, setRecentChallenges] = useState([]);
  const [randomChallenge, setRandomChallenge] = useState(null);
  const [gptCredits, setGptCredits] = useState(null);

  useEffect(() => {
    const fetchRandom = async () => {
      try {
        const res = await axios.get(`${BACKEND}/problem/random`);
        setRandomChallenge(res.data);
      } catch (err) {
        console.error("Failed to fetch random challenge", err);
      }
    };

    fetchRandom();

    if (isLogin && userInfo?.role === "user") {
      const fetchRecent = async () => {
        try {
          const res = await axios.get(`${BACKEND}/profile/recent-challenges`, {
            headers: { Authorization: userInfo.token },
          });
          setRecentChallenges(res.data);
        } catch (err) {
          console.error("Failed to fetch recent challenges", err);
        }
      };

      const fetchCredits = async () => {
        try {
          const res = await axios.get(`${BACKEND}/ai-tutor/my-credit`, {
            headers: { Authorization: userInfo.token },
          });
          setGptCredits(res.data.remaining_credits);
        } catch (err) {
          console.error("Failed to fetch GPT credits", err);
        }
      };

      fetchRecent();
      fetchCredits();
    }
  }, [isLogin, userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className="py-4">
      {/* Hero Section */}
      <HeroSection isLogin={isLogin} />

      {/* ========== Guest View ========== */}
      {!isLogin && (
        <>
          <h4 className="mt-5 mb-4 text-center">💡 Why Use PyCodePractice?</h4>
          <Row className="mb-4">
            <FeatureCard
              icon="🤖"
              title="AI-Powered Tutor"
              description="Guidance from GPT-4o Mini, step-by-step."
            />
            <FeatureCard
              icon="🧪"
              title="Real Challenges"
              description="Tackle problems with real-world relevance."
            />
            <FeatureCard
              icon="📈"
              title="Track Progress"
              description="View your submissions and monitor improvement."
            />
          </Row>

          <Row className="mb-5">
            <Col xs={12} md={8} className="text-center">
              <img
                src={AITutorDemo2}
                alt="AI Tutor Demo"
                className="img-fluid rounded shadow"
                style={{ height: 650, width: "100%", objectFit: "contain" }}
              />
            </Col>
            <Col xs={12} md={4}>
              <Testimonial />
            </Col>
          </Row>
        </>
      )}

      {/* ========== Logged-in as User ========== */}
      {isLogin && userInfo?.role === "user" && (
        <>
          {gptCredits !== null && (
            <h6 className="mb-4 text-center">
              🔋 You have <strong>{gptCredits}</strong> GPT messages left today
            </h6>
          )}

          <Row className="mb-4 mt-5">
            <Col xs={12} md={8}>
              <h5 className="mb-3">🎯 Recent Submissions</h5>
              {recentChallenges.length === 0 ? (
                <p className="text-muted">
                  You haven&apos;t started any challenges yet. Try one below!
                </p>
              ) : (
                <div className="mb-3 d-flex justify-content-start align-items-start gap-4 flex-wrap">
                  {recentChallenges.map((item, index) => (
                    <RecentChallengeCard
                      key={index}
                      problem={item.problem}
                      submission={item.submission}
                    />
                  ))}
                </div>
              )}
            </Col>
            <Col xs={12} md={4}>
              <h5 className="mb-3">🆕 Challenge Today</h5>
              {randomChallenge && <ChallengeCard challenge={randomChallenge} />}
            </Col>
          </Row>
        </>
      )}

      {/* ========== Logged-in as Admin ========== */}
      {isLogin && userInfo?.role === "admin" && (
        <>
          <h5 className="mt-8 mb-4 text-center">🛠️ Admin Tools</h5>
          <div className="mb-4 d-flex justify-content-center gap-4 flex-wrap">
            <Card className="shadow-sm p-3 text-center">
              <h6>🆕 Create New Challenge</h6>
              <Button variant="outline-success" onClick={() => navigate("/new-challenge")}>
                Go to Create Page
              </Button>
            </Card>
            <Card className="shadow-sm p-3 text-center">
              <h6>📊 Manage Users</h6>
              <Button variant="outline-primary" onClick={() => navigate("/admin/users")}>
                Go to User Management
              </Button>
            </Card>
            <Card className="shadow-sm p-3 text-center">
              <h6>🧩 Manage Challenges</h6>
              <Button variant="outline-success" onClick={() => navigate("/admin/problems")}>
                View Problems
              </Button>
            </Card>
          </div>
        </>
      )}

      {/* CTA only for guest */}
      {!isLogin && <BottomCTA isLogin={isLogin} />}
    </Container>
  );
}
