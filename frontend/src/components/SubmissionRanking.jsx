import React from "react";
import { ProgressBar, Card } from "react-bootstrap";
import { StarFill } from "react-bootstrap-icons";

/**
 * SubmissionRanking Component
 *
 * Displays a visual ranking summary for a passed submission, including execution time and memory usage percentiles.
 * Includes animated star indicators and submission statistics.
 */
export default function SubmissionRanking({ ranking }) {
  const {
    ram_percentile,
    time_percentile,
    total_passed_submissions,
    total_submissions,
    total_participants,
  } = ranking;

  const renderProgressWithAnimatedStar = (percentile) => {
    return (
      <div style={{ position: "relative", marginTop: "12px" }}>
        {/* Star Icon */}
        <div
          style={{
            position: "absolute",
            top: "-18px",
            left: `calc(${percentile}% - 10px)`,
            transition: "left 1s ease-in-out",
            zIndex: 2,
          }}
        >
          <StarFill color="#FFD700" size={22} />
        </div>

        {/* ProgressBar */}
        <ProgressBar
          now={percentile}
          label={`${percentile}%`}
          variant="success"
          style={{
            height: "1.3rem",
            backgroundColor: "#f1f3f5",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    );
  };

  return (
    <Card className="shadow-sm p-3 mt-4">
      <h5 className="mb-3">🌟 Ranking Summary</h5>

      <div>
        <strong>⏱ Execution Time Ranking</strong>
        {renderProgressWithAnimatedStar(time_percentile)}
      </div>

      <div className="mt-4">
        <strong>🧠 Memory Usage Ranking</strong>
        {renderProgressWithAnimatedStar(ram_percentile)}
      </div>

      <div
        className="mt-4"
        style={{ fontSize: "0.85rem", color: "#6c757d", lineHeight: "1.5" }}
      >
        <div>✅ Total Passed Submissions: {total_passed_submissions}</div>
        {/* Total xxx submission(s) from xxx participant(s) */}
        <div>
          {`📝 Total ${total_submissions} ${total_submissions > 1 ? "submissions" : "submission"} from ${total_participants} ${total_participants > 1 ? "participants" : "participant"}`}
        </div>
      </div>
    </Card>
  );
}
