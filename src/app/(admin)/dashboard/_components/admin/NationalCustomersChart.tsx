"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Lima",
    value: 350,
  },
  {
    name: "Arequipa",
    value: 120,
  },
  {
    name: "Cusco",
    value: 95,
  },
  {
    name: "La Libertad",
    value: 65,
  },
  {
    name: "Piura",
    value: 48,
  },
  {
    name: "Lambayeque",
    value: 40,
  },
  {
    name: "Cajamarca",
    value: 25,
  },
  {
    name: "Junín",
    value: 22,
  },
  {
    name: "Áncash",
    value: 18,
  },
  {
    name: "Ica",
    value: 15,
  },
];

export function NationalCustomersChart() {
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
          fill="#4ade80"
          radius={[0, 4, 4, 0]}
          barSize={20}
          label={{ position: "right", formatter: (value) => value, fontSize: 12 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
