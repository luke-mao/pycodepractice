import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AIMessageTrendChart({ data }) {
  return (
    <>
      <h5 className="mb-3">💬 AI Message Count</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={data[0]?.range ? "range" : "date"} fontSize={10} />
          <YAxis allowDecimals={false}/>
          <Tooltip />
          <Bar dataKey="ai_message_count" fill="#2196f3" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
