"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomOccupancyMap } from "../../../_types/dashboard";

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171", "#a1a1aa"];

interface OccupancyChartProps {
  roomOccupancy: RoomOccupancyMap | undefined;
}

export function OccupancyChart({ roomOccupancy }: OccupancyChartProps) {
  // Si no hay datos, mostrar un gráfico vacío o un mensaje
  if (!roomOccupancy) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-gray-500">No hay datos de ocupación disponibles</p>
      </div>
    );
  }

  // Crear array de datos para el gráfico usando los datos reales
  const data = [
    { name: "Ocupadas", value: roomOccupancy.countOccupied },
    { name: "Disponibles", value: roomOccupancy.countAvailable },
    { name: "Limpieza", value: roomOccupancy.countCleaning },
    { name: "Mantenimiento", value: roomOccupancy.countMaintenance },
    { name: "Incompletas", value: roomOccupancy.countIncomplete },
  ].filter((item) => item.value > 0); // Solo incluir estados que tengan al menos una habitación

  return (
    <Card className="col-span-7 md:col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Estado de Habitaciones</CardTitle>
        <CardDescription>Distribución actual de habitaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} habitaciones`, "Cantidad"]}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
              }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
