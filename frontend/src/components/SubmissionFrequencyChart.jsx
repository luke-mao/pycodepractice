import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

/**
 * SubmissionFrequencyChart Component
 *
 * Displays a bar chart visualizing the user's submission activity over the past 60 days.
 * Uses Recharts to render submission counts by date.
 */
export default function SubmissionFrequencyChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h5 className="mb-3">📆 Submission Frequency (Last 60 Days)</h5>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} fontSize={10} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
