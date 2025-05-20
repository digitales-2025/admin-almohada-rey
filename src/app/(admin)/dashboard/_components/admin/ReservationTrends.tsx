"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Ene",
    web: 40,
    directo: 24,
    agencias: 10,
  },
  {
    name: "Feb",
    web: 30,
    directo: 13,
    agencias: 15,
  },
  {
    name: "Mar",
    web: 20,
    directo: 98,
    agencias: 25,
  },
  {
    name: "Abr",
    web: 27,
    directo: 39,
    agencias: 30,
  },
  {
    name: "May",
    web: 18,
    directo: 48,
    agencias: 35,
  },
];

export function ReservationTrends() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDirecto" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAgencias" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
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
          dataKey="web"
          name="Reservas Web"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorWeb)"
        />
        <Area
          type="monotone"
          dataKey="directo"
          name="Reservas Directas"
          stroke="#4ade80"
          fillOpacity={1}
          fill="url(#colorDirecto)"
        />
        <Area
          type="monotone"
          dataKey="agencias"
          name="Agencias de Viaje"
          stroke="#f59e0b"
          fillOpacity={1}
          fill="url(#colorAgencias)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
