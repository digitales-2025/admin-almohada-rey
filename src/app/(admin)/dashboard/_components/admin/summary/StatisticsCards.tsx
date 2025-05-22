"use client";

import { BedDouble, CreditCard, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberCounter } from "@/components/ui/number-counter";
import type { AnnualAdministratorStatistics } from "../../../_types/dashboard";

interface StatisticsCardsProps {
  annualStatistics: AnnualAdministratorStatistics | undefined;
}

export default function StatisticsCards({ annualStatistics }: StatisticsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Income Card */}
      <Card className="border border-l-4 border-l-blue-500 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-sm font-medium mr-1">S/</span>
            <NumberCounter
              value={annualStatistics?.totalIncome || 0}
              formatter={(val) => val.toFixed(2)}
              className="text-3xl font-bold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Rate Card */}
      <Card className="border border-l-4 border-l-green-500 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Ocupación</CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
            <BedDouble className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <NumberCounter
              value={annualStatistics?.occupancyRate || 0}
              formatter={(val) => val.toFixed(0)}
              className="text-3xl font-bold"
            />
            <span className="text-lg font-medium ml-1">%</span>
          </div>
        </CardContent>
      </Card>

      {/* New Customers Card */}
      <Card className="border border-l-4 border-l-purple-500 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
          <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-xl font-medium mr-1">+</span>
            <NumberCounter
              value={annualStatistics?.newCustomers || 0}
              formatter={(val) => val.toFixed(0)}
              className="text-3xl font-bold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending Payments Card */}
      <Card className="border border-l-4 border-l-amber-500 relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
          <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <span className="text-sm font-medium mr-1">S/</span>
            <NumberCounter
              value={annualStatistics?.pendingPayments || 0}
              formatter={(val) => val.toFixed(2)}
              className="text-3xl font-bold"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
