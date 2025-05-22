"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { MonthlyBookingTrend } from "../../_types/dashboard";

interface ReservationTrendsProps {
  monthlyBookingTrend: MonthlyBookingTrend[] | undefined;
}

export function ReservationTrends({ monthlyBookingTrend }: ReservationTrendsProps) {
  // Si no hay datos o el array está vacío, mostrar un mensaje
  if (!monthlyBookingTrend || monthlyBookingTrend.length === 0) {
    return (
      <div className="flex justify-center items-center h-[400px] w-full border rounded-lg">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    );
  }

  // Transformación para adaptarse a la estructura que espera el gráfico
  const formattedData = monthlyBookingTrend.map((item) => ({
    name: item.month,
    web: item.webBookings,
    directo: item.directBookings,
    // No existe agencias en el tipado, pero mantenemos la estructura por si en el futuro se añade
    agencias: 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDirecto" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
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
      </AreaChart>
    </ResponsiveContainer>
  );
}
