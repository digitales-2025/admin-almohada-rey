"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Ocupadas", value: 18 },
  { name: "Disponibles", value: 12 },
  { name: "Limpieza", value: 5 },
  { name: "Mantenimiento", value: 2 },
];

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171"];

export function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value} habitaciones`, "Cantidad"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
