"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Duración Estancia (días)",
    nacionales: 2.5,
    internacionales: 4.8,
  },
  {
    name: "Gasto Promedio (S/ x 100)",
    nacionales: 3.2,
    internacionales: 5.6,
  },
  {
    name: "Reserva Anticipada (días)",
    nacionales: 8.5,
    internacionales: 32.4,
  },
  {
    name: "Satisfacción (1-5)",
    nacionales: 4.2,
    internacionales: 4.5,
  },
];

export function ReservationsByOriginChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (name === "nacionales") {
              return [value, "Nacionales"];
            } else if (name === "internacionales") {
              return [value, "Internacionales"];
            }
            return [value, name];
          }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend />
        <Bar dataKey="nacionales" name="Nacionales" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={40} />
        <Bar dataKey="internacionales" name="Internacionales" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
