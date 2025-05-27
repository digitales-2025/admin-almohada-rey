"use client";

import { MapPin } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Top10CountriesProvinces } from "../../../_types/dashboard";

interface NationalCustomersChartProps {
  top10ProvincesCustomers: Top10CountriesProvinces[] | undefined;
}

export function NationalCustomersChart({ top10ProvincesCustomers }: NationalCustomersChartProps) {
  // Usamos los datos proporcionados o un array vacío si son undefined
  const chartData =
    top10ProvincesCustomers?.map((item) => ({
      name: item.countryProvince,
      value: item.totalCustomers,
    })) || [];

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] space-y-4">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Sin datos de departamentos</p>
          <p className="text-xs text-muted-foreground">Los datos aparecerán cuando haya huéspedes nacionales</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
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
          label={{
            position: "right",
            formatter: (value: number) => value,
            fontSize: 12,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
