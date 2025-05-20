"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Ene",
    nacionales: 60,
    internacionales: 40,
  },
  {
    name: "Feb",
    nacionales: 65,
    internacionales: 35,
  },
  {
    name: "Mar",
    nacionales: 55,
    internacionales: 45,
  },
  {
    name: "Abr",
    nacionales: 70,
    internacionales: 30,
  },
  {
    name: "May",
    nacionales: 65,
    internacionales: 35,
  },
];

export function CustomerOriginTrends() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorNacionales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorInternacionales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: number) => [`${value}%`, "Porcentaje"]}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend iconType="circle" />
        <Area
          type="monotone"
          dataKey="nacionales"
          name="Huéspedes Nacionales"
          stroke="#4ade80"
          fillOpacity={1}
          fill="url(#colorNacionales)"
        />
        <Area
          type="monotone"
          dataKey="internacionales"
          name="Huéspedes Internacionales"
          stroke="#60a5fa"
          fillOpacity={1}
          fill="url(#colorInternacionales)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
