"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "EE.UU.",
    value: 110,
  },
  {
    name: "Chile",
    value: 78,
  },
  {
    name: "Argentina",
    value: 65,
  },
  {
    name: "España",
    value: 52,
  },
  {
    name: "Colombia",
    value: 44,
  },
  {
    name: "Brasil",
    value: 35,
  },
  {
    name: "Alemania",
    value: 22,
  },
  {
    name: "Francia",
    value: 18,
  },
  {
    name: "Japón",
    value: 9,
  },
  {
    name: "Australia",
    value: 5,
  },
];

export function InternationalCustomersChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" axisLine={false} tickLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
          width={60}
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          formatter={(value: number) => [`${value} huéspedes`, "Cantidad"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Bar
          dataKey="value"
          fill="#60a5fa"
          radius={[0, 4, 4, 0]}
          barSize={20}
          label={{ position: "right", formatter: (value) => value, fontSize: 12 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
