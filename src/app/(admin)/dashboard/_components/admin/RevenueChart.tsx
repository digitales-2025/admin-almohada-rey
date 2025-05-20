"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Ene",
    ingresos: 120000,
    gastos: 72000,
  },
  {
    name: "Feb",
    ingresos: 90000,
    gastos: 58000,
  },
  {
    name: "Mar",
    ingresos: 150000,
    gastos: 85000,
  },
  {
    name: "Abr",
    ingresos: 110000,
    gastos: 65000,
  },
  {
    name: "May",
    ingresos: 152450,
    gastos: 87320,
  },
  {
    name: "Jun",
    ingresos: 0,
    gastos: 0,
  },
];

export function RevenueChart() {
  const formatNumber = (number: number) => {
    return `S/ ${number.toLocaleString("es-PE")}`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value: number) => formatNumber(value)}
          labelStyle={{ color: "#111", fontWeight: "bold" }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
        />
        <Legend />
        <Bar dataKey="ingresos" name="Ingresos" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={30} />
        <Bar dataKey="gastos" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
}
