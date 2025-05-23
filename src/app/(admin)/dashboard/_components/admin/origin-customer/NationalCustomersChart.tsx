"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Top10CountriesProvinces } from "../../../_types/dashboard";

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
