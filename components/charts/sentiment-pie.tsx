"use client"

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function SentimentPie({ data }: { data: { name: string; value: number }[] }) {
  const COLORS = ["#0d9488", "#64748b", "#ef4444"] // teal, gray, red (red only as data color, not a brand color)
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
