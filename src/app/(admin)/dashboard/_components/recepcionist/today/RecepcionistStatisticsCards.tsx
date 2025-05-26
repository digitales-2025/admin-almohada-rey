"use client";

import { BedDouble, CalendarMinus, CalendarPlus, Lamp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { NumberCounter } from "@/components/ui/number-counter";
import type { TodayRecepcionistStatistics } from "../../../_types/dashboard";

interface RecepcionistStatisticsCardsProps {
  todayRecepcionistStatistics?: TodayRecepcionistStatistics;
}

export default function RecepcionistStatisticsCards({ todayRecepcionistStatistics }: RecepcionistStatisticsCardsProps) {
  // Valores predeterminados para evitar errores cuando todayRecepcionistStatistics es undefined
  const {
    todayCheckIn = 0,
    todayCheckInPerformed = 0,
    todayCheckOut = 0,
    todayCheckOutPerformed = 0,
    todayAvailableRooms = 0,
    totalRooms = 0,
    todayPendingAmenities = 0,
    urgentPendingAmenities = 0,
  } = todayRecepcionistStatistics || {};

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Check-ins Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2E7D32] to-[#4CAF50]"></div>
        <CardContent className=" relative">
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 bg-gradient-to-br from-[#E0F2E0] to-[#C8E6C9]/50 dark:from-[#2E7D32]/30 dark:to-[#2E7D32]/20 rounded-2xl shadow-sm">
              <CalendarPlus className="h-7 w-7 text-[#2E7D32] dark:text-[#C8E6C9]" strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[#2E7D32] dark:text-[#C8E6C9] uppercase tracking-wider opacity-90">
                Check-ins Hoy
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <NumberCounter
                value={todayCheckIn}
                className="text-3xl font-bold text-gray-900 dark:text-white leading-none"
                formatter={(val) => Math.round(val).toString()}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Registrados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#C8E6C9]"></div>
                  <span className="font-bold text-[#2E7D32] dark:text-[#C8E6C9] text-lg">{todayCheckInPerformed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pendientes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">
                    {todayCheckIn - todayCheckInPerformed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-outs Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0D47A1] to-[#1976D2]"></div>
        <CardContent className=" relative">
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 bg-gradient-to-br from-[#D6EDFF] to-[#BBDEFB]/50 dark:from-[#0D47A1]/30 dark:to-[#0D47A1]/20 rounded-2xl shadow-sm">
              <CalendarMinus className="h-7 w-7 text-[#0D47A1] dark:text-[#BBDEFB]" strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[#0D47A1] dark:text-[#BBDEFB] uppercase tracking-wider opacity-90">
                Check-outs Hoy
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <NumberCounter
                value={todayCheckOut}
                className="text-3xl font-bold text-gray-900 dark:text-white leading-none"
                formatter={(val) => Math.round(val).toString()}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Finalizados</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#0D47A1] dark:bg-[#BBDEFB]"></div>
                  <span className="font-bold text-[#0D47A1] dark:text-[#BBDEFB] text-lg">{todayCheckOutPerformed}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pendientes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">
                    {todayCheckOut - todayCheckOutPerformed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Rooms Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-600"></div>
        <CardContent className=" relative">
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-900/20 rounded-2xl shadow-sm">
              <BedDouble className="h-7 w-7 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider opacity-90">
                Habitaciones
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <div className="flex items-baseline space-x-3">
                <NumberCounter
                  value={todayAvailableRooms}
                  className="text-3xl font-bold text-gray-900 dark:text-white leading-none"
                  formatter={(val) => Math.round(val).toString()}
                />
                <span className="text-2xl font-medium text-gray-400 dark:text-gray-500">/ {totalRooms}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Disponibles</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">{todayAvailableRooms}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ocupadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                  <span className="font-bold text-gray-700 dark:text-gray-200 text-lg">
                    {totalRooms - todayAvailableRooms}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Amenities Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600"></div>
        <CardContent className=" relative">
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-900/20 rounded-2xl shadow-sm">
              <Lamp className="h-7 w-7 text-amber-600 dark:text-amber-400" strokeWidth={1.5} />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider opacity-90">
                Amenidades
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mb-4">
              <NumberCounter
                value={todayPendingAmenities}
                className="text-3xl font-bold text-gray-900 dark:text-white leading-none"
                formatter={(val) => Math.round(val).toString()}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Pendientes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400"></div>
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">{todayPendingAmenities}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Urgentes</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="font-bold text-red-500 text-lg">{urgentPendingAmenities}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
