import React, { useEffect, useState } from "react";
import axios from "axios";
import { ButtonGroup, Button, Form, Row, Col, Card } from "react-bootstrap";
import Plot from "react-plotly.js";
import { BACKEND } from "../static/Constants";
import { useStore } from "../store/store";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function AdminAnalyticsPage() {
  const { userInfo } = useStore();
  const [timeframe, setTimeframe] = useState("this_week");
  const [usageData, setUsageData] = useState([]);
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [executionStats, setExecutionStats] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      const url = `${BACKEND}/analytics/usage-count/${timeframe}`;
      const config = {headers: { Authorization: userInfo.token }};

      try {
        const response = await axios.get(url, config);
        setUsageData(response.data);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      }
    };

    if (!userInfo) return;
    fetchUsage();
  }, [timeframe, userInfo]);

  useEffect(() => {
    const fetchProblems = async () => {
      const url = `${BACKEND}/problem/`;
      const config = { headers: { Authorization: userInfo.token } };

      try {
        const response = await axios.get(url, config);
        setProblems(response.data);
      } catch (err) {
        console.error("Failed to fetch problems:", err);
      }
    };

    fetchProblems();
  }, [userInfo]);

  const fetchExecutionStats = async (problemId) => {
    const url = `${BACKEND}/analytics/execution-summary/${problemId}`;
    const config = { headers: { Authorization: userInfo.token } };

    try {
      const response = await axios.get(url, config);
      setExecutionStats(response.data);
    } catch (err) {
      console.error("Failed to fetch execution stats:", err);
    }
  };

  const handleProblemSelect = (e) => {
    const id = e.target.value;
    setSelectedProblemId(id);
    if (id) fetchExecutionStats(id);
  };

  return (
    <div className="container mt-4 pb-5">
      <h2 className="mb-4">📊 Admin Analytics</h2>

      {/* Timeframe Toggle */}
      <ButtonGroup className="mb-4">
        {["today", "this_week", "this_month", "this_quarter", "this_year"].map(
          (tf) => (
            <Button
              key={tf}
              variant={tf === timeframe ? "primary" : "outline-primary"}
              onClick={() => setTimeframe(tf)}
            >
              {tf.replace("this_", "").replace("_", " ").toUpperCase()}
            </Button>
          )
        )}
      </ButtonGroup>

      {/* Usage Charts */}
      <Card className="p-3 mb-4 shadow-sm">
        <h5 className="mb-3">🧾 Submission Count</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_count" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-3 mb-5 shadow-sm">
        <h5 className="mb-3">💬 AI Message Count</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={10} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="message_count" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Execution stats dropdown */}
      <Form.Group className="mb-3">
        <Form.Label className="h4">Select a Problem for Execution Analysis</Form.Label>
        <Form.Select
          value={selectedProblemId || ""}
          onChange={handleProblemSelect}
          style={{
            width: "fit-content",
          }}
        >
          <option value="">-- Choose a Problem --</option>
          {problems.map((p) => (
            <option key={p.problem_id} value={p.problem_id}>
              {`P${p.problem_id} - ${p.title}`}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Boxplots */}
      {executionStats && (
        <Row>
          <Col md={6}>
            <Card className="p-3 shadow-sm mb-4">
              <h6>Execution Time (s)</h6>
              <Plot
                data={[
                  {
                    y: executionStats.execution_times,
                    type: "box",
                    name: "Execution Time",
                    boxpoints: "outliers",
                    marker: { color: "#3f51b5" },
                  },
                ]}
                layout={{ height: 350, margin: { t: 30, b: 0 } }}
                config={{
                  displayModeBar: false,
                  responsive: true,
                }}
              />
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-3 shadow-sm mb-4">
              <h6>Memory Usage (MB)</h6>
              <Plot
                data={[
                  {
                    y: executionStats.memory_usages,
                    type: "box",
                    name: "Memory",
                    boxpoints: "outliers",
                    marker: { color: "#009688" },
                  },
                ]}
                layout={{ height: 350, margin: { t: 30, b: 0 } }}
                config={{
                  displayModeBar: false,
                  responsive: true,
                }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
