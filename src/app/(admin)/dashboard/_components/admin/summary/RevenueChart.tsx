"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyEarningsAndExpenses } from "../../../_types/dashboard";

interface RevenueChartProps {
  monthlyEarningsExpenses: MonthlyEarningsAndExpenses[] | undefined;
}

export function RevenueChart({ monthlyEarningsExpenses }: RevenueChartProps) {
  const formatNumber = (number: number) => {
    return `S/ ${number.toLocaleString("es-PE")}`;
  };

  // Transformar los datos para que coincidan con el formato esperado por el gráfico
  const chartData =
    monthlyEarningsExpenses?.map((item) => ({
      name: item.month,
      ingresos: item.earnings,
      gastos: item.expenses,
    })) || [];

  return (
    <Card className="col-span-7 md:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Resumen de Ingresos</CardTitle>
        <CardDescription>Análisis de ingresos y gastos mensuales</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
            <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
