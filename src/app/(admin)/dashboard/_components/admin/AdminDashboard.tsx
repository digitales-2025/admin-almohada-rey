"use client";

import { useState } from "react";
import { BarChart3, Calendar, Globe, Home, PieChart } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import FinanceTabsContentDashboard from "./finance/FinanceTabsContentDashboard";
import OccupancyTabsContentDashboard from "./occupancy/OccupancyTabsContentDashboard";
import OriginCustomerTabsContentDashboard from "./origin-customer/OriginCustomerTabsContentDashboard";
import ReservationTabsContentDashboard from "./reservation/ReservationTabsContentDashboard";
import { FinanceSkeleton } from "./skeletons/FinanceSkeleton";
import { OccupancySkeleton } from "./skeletons/OccupancySkeleton";
import { OriginCustomerSkeleton } from "./skeletons/OriginCustomerSkeleton";
import { ReservationSkeleton } from "./skeletons/ReservationSkeleton";
import { SummarySkeleton } from "./skeletons/SummarySkeleton";
import SummaryTabsContentDashoard from "./summary/SummaryTabsContentDashboard";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [year, setYear] = useState(new Date().getFullYear() as number);

  const { data, loading } = useDashboard({
    year,
    activeTab,
    mode: "admin",
  });

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative grid grid-cols-5 w-full h-fit border-0 z-10">
          <TabsTrigger
            value="resumen"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Home className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Resumen</span>
          </TabsTrigger>
          <TabsTrigger
            value="ocupacion"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Ocupación</span>
          </TabsTrigger>
          <TabsTrigger
            value="reservas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Reservas</span>
          </TabsTrigger>
          <TabsTrigger
            value="finanzas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <PieChart className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Finanzas</span>
          </TabsTrigger>

          <TabsTrigger
            value="procedencia"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Procedencia</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña de Resumen */}
        {loading.summary ? (
          <SummarySkeleton />
        ) : (
          <SummaryTabsContentDashoard
            annualStatistics={data.annualStatistics}
            monthlyEarningsExpenses={data.monthlyEarningsExpenses}
            nextPendingPayments={data.nextPendingPayments}
            recentReservations={data.recentReservations}
            roomOccupancy={data.roomOccupancy}
            setYear={setYear}
            year={year}
          />
        )}

        {/* Pestaña de Ocupación */}
        {loading.occupancy ? (
          <OccupancySkeleton />
        ) : (
          <OccupancyTabsContentDashboard
            roomOccupancy={data.roomOccupancy}
            occupancyStatisticsPercentage={data.occupancyStatisticsPercentage}
            setYear={setYear}
            year={year}
          />
        )}

        {/* Pestaña de Reservas */}
        {loading.reservations ? (
          <ReservationSkeleton />
        ) : (
          <ReservationTabsContentDashboard
            year={year}
            setYear={setYear}
            monthlyBookingTrend={data.monthlyBookingTrend}
          />
        )}

        {/* Pestaña de Finanzas */}
        {loading.finance ? (
          <FinanceSkeleton />
        ) : (
          <FinanceTabsContentDashboard year={year} setYear={setYear} annualSummaryFinance={data.annualSummaryFinance} />
        )}

        {/* Pestaña de Procedencia */}
        {loading.origin ? (
          <OriginCustomerSkeleton />
        ) : (
          <OriginCustomerTabsContentDashboard
            year={year}
            setYear={setYear}
            customerOriginSummary={data.customerOriginSummary}
            monthlyCustomerOrigin={data.monthlyCustomerOrigin}
            top10CountriesCustomers={data.top10CountriesCustomers}
            top10ProvincesCustomers={data.top10ProvincesCustomers}
          />
        )}
      </Tabs>
    </div>
  );
}
