"use client";

import { Building2, Globe } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerOriginSummary, MonthlyCustomerOrigin } from "../../../_types/dashboard";
import { CustomerOriginTrends } from "./CustomerOriginTrends";

interface NationalInternationalDistributionProps {
  customerOriginSummary: CustomerOriginSummary | undefined;
  monthlyCustomerOrigin: MonthlyCustomerOrigin[] | undefined;
}

export default function NationalInternationalDistribution({
  customerOriginSummary,
  monthlyCustomerOrigin,
}: NationalInternationalDistributionProps) {
  // Usamos los datos proporcionados o valores predeterminados si son undefined
  const summary = customerOriginSummary || {
    totalCustomers: 0,
    totalNationalCustomers: 0,
    totalInternationalCustomers: 0,
    totalCountry: 0,
  };

  // Calculamos los porcentajes
  const nationalPercentage =
    summary.totalCustomers > 0 ? Math.round((summary.totalNationalCustomers / summary.totalCustomers) * 100) : 0;

  const internationalPercentage =
    summary.totalCustomers > 0 ? Math.round((summary.totalInternationalCustomers / summary.totalCustomers) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
              Distribución de Huéspedes
            </CardTitle>
            <CardDescription>Proporción de huéspedes nacionales e internacionales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30">
                  <Building2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                  <h3 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{nationalPercentage}%</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Nacionales</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/30">
                  <Globe className="h-8 w-8 text-violet-600 dark:text-violet-400 mb-2" />
                  <h3 className="text-4xl font-bold text-violet-600 dark:text-violet-400">
                    {internationalPercentage}%
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">Internacionales</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> Nacionales
                    </span>
                    <span>{summary.totalNationalCustomers.toLocaleString()} huéspedes</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 ease-in-out"
                      style={{ width: `${nationalPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Internacionales
                    </span>
                    <span>{summary.totalInternationalCustomers.toLocaleString()} huéspedes</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950/50">
                    <div
                      className="h-full bg-violet-500 transition-all duration-500 ease-in-out"
                      style={{ width: `${internationalPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-[180px] w-[180px]">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth="10"
                      strokeDasharray={`${nationalPercentage * 2.51} ${(100 - nationalPercentage) * 2.51}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(265 89% 78%)"
                      strokeWidth="10"
                      strokeDasharray={`${internationalPercentage * 2.51} ${(100 - internationalPercentage) * 2.51}`}
                      strokeDashoffset={`${-nationalPercentage * 2.51}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{summary.totalCustomers.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">Total Huéspedes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CustomerOriginTrends monthlyCustomerOrigin={monthlyCustomerOrigin} className="border-none shadow-md" />
      </div>
    </div>
  );
}
