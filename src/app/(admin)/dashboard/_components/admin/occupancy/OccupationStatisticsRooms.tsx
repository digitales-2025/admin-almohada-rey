"use client";

import { Award, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from "recharts";

import { getRoomTypeBgColor, getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OccupationStatisticsPercentage } from "../../../_types/dashboard";

interface OccupationStatisticsRoomsProps {
  occupancyStatisticsPercentage: OccupationStatisticsPercentage[] | undefined;
}

// Tipo para los datos del gráfico
interface ChartDataItem {
  name: string;
  value: number;
  id: string;
  isEmpty?: boolean;
}

export default function OccupationStatisticsRooms({ occupancyStatisticsPercentage }: OccupationStatisticsRoomsProps) {
  if (!occupancyStatisticsPercentage || occupancyStatisticsPercentage.length === 0) {
    return (
      <Card className="col-span-3 md:col-span-1 overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Estadísticas de Ocupación</CardTitle>
              <CardDescription>Análisis por tipo de habitación</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <PieChart className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-muted-foreground">No hay datos de ocupación</p>
              <p className="text-xs text-muted-foreground">Las estadísticas aparecerán cuando haya reservas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular el promedio de ocupación
  const averageOccupancy = Math.round(
    occupancyStatisticsPercentage.reduce((sum, stat) => sum + stat.percentage, 0) / occupancyStatisticsPercentage.length
  );

  // Encontrar el tipo con mayor ocupación
  const topPerformer = [...occupancyStatisticsPercentage].sort((a, b) => b.percentage - a.percentage)[0];

  // Ordenar estadísticas por porcentaje
  const sortedStats = [...occupancyStatisticsPercentage].sort((a, b) => b.percentage - a.percentage);

  // Preparar datos para el gráfico de recharts
  const chartData: ChartDataItem[] = [];

  // Añadir datos reales (solo los que tienen porcentaje > 0)
  sortedStats
    .filter((stat) => stat.percentage > 0)
    .forEach((stat) => {
      chartData.push({
        name: stat.type,
        value: stat.percentage,
        id: stat.id,
      });
    });

  // Calcular el total de porcentajes reales
  const totalPercentage = chartData.reduce((sum, item) => sum + item.value, 0);

  // Si el total es menor que 100, añadir un segmento "vacío" para completar el círculo
  if (totalPercentage < 100) {
    chartData.push({
      name: "empty",
      value: 100 - totalPercentage,
      id: "empty",
      isEmpty: true,
    });
  }

  // Si no hay datos con porcentaje > 0, mostrar un círculo completo vacío
  if (chartData.length === 0 || totalPercentage === 0) {
    chartData.length = 0; // Limpiar array
    chartData.push({
      name: "empty",
      value: 100,
      id: "empty",
      isEmpty: true,
    });
  }

  // Función para obtener el color de un tipo de habitación
  const getTypeColor = (typeName: string): string => {
    const bgColor = getRoomTypeBgColor(typeName);
    const colorClass = bgColor.split(" ")[0]; // Tomar solo la primera clase

    // Mapeo de clases Tailwind a colores hex
    const colorMap: Record<string, string> = {
      "bg-pink-500": "#ec4899", // matrimonial
      "bg-indigo-500": "#6366f1", // dobleFamiliar
      "bg-blue-500": "#3b82f6", // dobleSimple
      "bg-cyan-500": "#06b6d4", // simple
      "bg-amber-500": "#f59e0b", // suite
      "bg-slate-500": "#64748b", // default
    };

    return colorMap[colorClass] || "#3f66c0";
  };

  return (
    <Card className="col-span-3 md:col-span-1 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Estadísticas de Ocupación</CardTitle>
            <CardDescription>Análisis por tipo de habitación</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Gráfico circular */}
        <div className="relative p-6 flex justify-center">
          <div className="relative h-[180px] w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((entry, index) => {
                    // Si es el segmento vacío, usar un color gris claro
                    if (entry.isEmpty) {
                      return <Cell key={`cell-${index}`} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth={0.5} />;
                    }

                    // Para los datos reales, usar los colores de la configuración
                    const color = getTypeColor(entry.name);

                    return <Cell key={`cell-${index}`} fill={color} stroke="white" strokeWidth={0.5} />;
                  })}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{averageOccupancy}%</span>
              <span className="text-xs text-muted-foreground">Ocupación media</span>
            </div>
          </div>
        </div>

        {/* Leyenda del gráfico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 border-t border-b">
          {sortedStats.map((stat) => {
            const typeKey = getRoomTypeKey(stat.type);
            const typeConfig = RoomTypeLabels[typeKey] || RoomTypeLabels.default;
            const bgColor = getRoomTypeBgColor(stat.type);

            return (
              <div key={stat.id} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${bgColor}`}></div>
                <span className="text-xs truncate">{typeConfig.label}</span>
                <span className="text-xs font-bold ml-auto">{stat.percentage}%</span>
              </div>
            );
          })}
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-2 gap-px bg-muted">
          <div className="p-4 bg-card">
            <div className="text-xs text-muted-foreground mb-1">Tipo más ocupado</div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              <div className="text-sm font-medium truncate">
                {RoomTypeLabels[getRoomTypeKey(topPerformer.type)]?.label || topPerformer.type}
              </div>
            </div>
          </div>
          <div className="p-4 bg-card">
            <div className="text-xs text-muted-foreground mb-1">Ocupación máxima</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <div className="text-sm font-medium">{topPerformer.percentage}%</div>
            </div>
          </div>
        </div>

        {/* Barras de progreso detalladas */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Detalle por tipo</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>

          {sortedStats.map((stat) => {
            const typeKey = getRoomTypeKey(stat.type);
            const typeConfig = RoomTypeLabels[typeKey] || RoomTypeLabels.default;
            const bgColor = getRoomTypeBgColor(stat.type);
            const Icon = typeConfig.icon;

            return (
              <div key={stat.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${typeConfig.className}`} />
                    <span className={`text-sm font-medium ${typeConfig.className}`}>{typeConfig.label}</span>
                  </div>
                  <span className="text-sm font-bold">{stat.percentage}%</span>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${bgColor} rounded-full`} style={{ width: `${stat.percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
