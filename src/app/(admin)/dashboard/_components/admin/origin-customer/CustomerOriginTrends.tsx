"use client";

import { Building2, Globe } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { MonthlyCustomerOrigin } from "../../../_types/dashboard";

interface CustomerOriginTrendsProps {
  monthlyCustomerOrigin: MonthlyCustomerOrigin[] | undefined;
  className?: string;
}

export function CustomerOriginTrends({ monthlyCustomerOrigin, className }: CustomerOriginTrendsProps) {
  // Transformamos los datos al formato requerido por el gráfico
  const chartData =
    monthlyCustomerOrigin?.map((item) => ({
      month: item.month,
      nacionales: item.nationalCustomers,
      internacionales: item.internationalCustomers,
    })) || [];

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Tendencias de Origen
        </CardTitle>
        <CardDescription>Evolución mensual de huéspedes por origen</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium flex items-center gap-1">
              <Building2 className="h-4 w-4" /> Nacionales
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-8 rounded-full bg-violet-500"></div>
            <span className="text-sm font-medium flex items-center gap-1">
              <Globe className="h-4 w-4" /> Internacionales
            </span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              nacionales: {
                label: "Nacionales",
                color: "hsl(142 76% 36%)",
              },
              internacionales: {
                label: "Internacionales",
                color: "hsl(265 89% 78%)",
              },
            }}
          >
            <AreaChart accessibilityLayer data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNacionales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInternacionales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(265 89% 78%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(265 89% 78%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="nacionales"
                stroke="hsl(142 76% 36%)"
                fillOpacity={1}
                fill="url(#colorNacionales)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="internacionales"
                stroke="hsl(265 89% 78%)"
                fillOpacity={1}
                fill="url(#colorInternacionales)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
