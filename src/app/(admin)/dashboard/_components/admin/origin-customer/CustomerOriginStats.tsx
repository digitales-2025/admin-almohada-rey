"use client";

import { Globe, MapPin, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { NumberCounter } from "@/components/ui/number-counter";
import type { CustomerOriginSummary } from "../../../_types/dashboard";

interface CustomerOriginStatsProps {
  customerOriginSummary: CustomerOriginSummary | undefined;
}

export function CustomerOriginStats({ customerOriginSummary }: CustomerOriginStatsProps) {
  // Si no hay datos disponibles, utilizamos valores predeterminados
  const summary = customerOriginSummary || {
    totalCustomers: 0,
    totalNationalCustomers: 0,
    totalInternationalCustomers: 0,
    totalCountry: 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Guests Card */}
      <Card className="border-0 overflow-hidden relative group transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Huéspedes</p>
              <NumberCounter
                value={summary.totalCustomers}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
            </div>
            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-7 w-7 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
            <div className="text-xs text-muted-foreground">Todos los huéspedes registrados en el sistema</div>
          </div>
        </CardContent>
      </Card>

      {/* National Guests Card */}
      <Card className="border-0 overflow-hidden relative group transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-800 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Huéspedes Nacionales</p>
              <NumberCounter
                value={summary.totalNationalCustomers}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
            </div>
            <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-emerald-200 dark:border-emerald-800">
            <div className="text-xs text-muted-foreground">Huéspedes de origen nacional</div>
          </div>
        </CardContent>
      </Card>

      {/* International Guests Card */}
      <Card className="border-0 overflow-hidden relative group transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-800 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-400"></div>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Huéspedes Internacionales</p>
              <NumberCounter
                value={summary.totalInternationalCustomers}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
            </div>
            <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-blue-200 dark:border-blue-800">
            <div className="text-xs text-muted-foreground">Huéspedes de origen internacional</div>
          </div>
        </CardContent>
      </Card>

      {/* Countries Represented Card */}
      <Card className="border-0 overflow-hidden relative group transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-slate-800 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
        <CardContent className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Países Representados</p>
              <NumberCounter
                value={summary.totalCountry}
                formatter={(val) => Math.round(val).toString()}
                className="text-3xl font-bold"
              />
            </div>
            <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-7 w-7 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-amber-200 dark:border-amber-800">
            <div className="text-xs text-muted-foreground">Diversidad de origen de los huéspedes</div>
            <div className="mt-2 flex">
              {Array.from({ length: Math.min(10, summary.totalCountry) }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500 mr-1"></div>
              ))}
              {summary.totalCountry > 10 && (
                <div className="text-xs text-amber-500 dark:text-amber-400 ml-1">+{summary.totalCountry - 10}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
