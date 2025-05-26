"use client";

import { CalendarRange, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { NumberCounter } from "@/components/ui/number-counter";
import type { WeekReservations } from "../../../_types/dashboard";

interface WeekReservationsStatisticsProps {
  weekReservations: WeekReservations | undefined;
}

export default function WeekReservationsStatistics({ weekReservations }: WeekReservationsStatisticsProps) {
  // Valores por defecto para evitar errores cuando weekReservations es undefined
  const {
    todayReservations = 0,
    tomorrowReservations = 0,
    weekReservations: totalWeekReservations = 0,
    pendingReservations = 0,
  } = weekReservations || {};

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Today Reservations */}
      <Card className="border-t-4 border-t-blue-500 transition-shadow duration-200">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarRange className="h-4 w-4 text-blue-500" strokeWidth={2} />
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">HOY</p>
              </div>
              <NumberCounter
                value={todayReservations}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
              <p className="text-xs text-muted-foreground">Reservaciones programadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tomorrow Reservations */}
      <Card className="border-t-4 border-t-emerald-500 transition-shadow duration-200">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarRange className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">MAÑANA</p>
              </div>
              <NumberCounter
                value={tomorrowReservations}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
              <p className="text-xs text-muted-foreground">Reservaciones programadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Reservations */}
      <Card className="border-t-4 border-t-violet-500 transition-shadow duration-200">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarRange className="h-4 w-4 text-violet-500" strokeWidth={2} />
                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">ESTA SEMANA</p>
              </div>
              <NumberCounter
                value={totalWeekReservations}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
              <p className="text-xs text-muted-foreground">Total de reservaciones</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Reservations */}
      <Card className="border-t-4 border-t-amber-500 transition-shadow duration-200">
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-500" strokeWidth={2} />
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">PENDIENTES</p>
              </div>
              <NumberCounter
                value={pendingReservations}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
              <p className="text-xs text-muted-foreground">Requieren confirmación</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
