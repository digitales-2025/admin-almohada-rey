"use client";

import { PieChart } from "lucide-react";
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoomOccupancyMap } from "../../../_types/dashboard";

const COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f87171", "#a1a1aa"];

interface OccupancyChartProps {
  roomOccupancy: RoomOccupancyMap | undefined;
}

export function OccupancyChart({ roomOccupancy }: OccupancyChartProps) {
  // Si no hay datos, mostrar un gráfico vacío o un mensaje
  if (!roomOccupancy) {
    return (
      <Card className="col-span-7 md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Estado de Habitaciones</CardTitle>
          <CardDescription>Distribución actual de habitaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-medium">No hay datos disponibles</p>
              <p className="text-sm text-muted-foreground">
                Los datos de ocupación se mostrarán aquí cuando estén disponibles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
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

  // Verificar si todos los valores son cero
  if (data.length === 0) {
    return (
      <Card className="col-span-7 md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Estado de Habitaciones</CardTitle>
          <CardDescription>Distribución actual de habitaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <PieChart className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground font-medium">Sin habitaciones registradas</p>
              <p className="text-sm text-muted-foreground">
                Configure habitaciones para ver la distribución de estados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-7 md:col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Estado de Habitaciones</CardTitle>
        <CardDescription>Distribución actual de habitaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
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
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
