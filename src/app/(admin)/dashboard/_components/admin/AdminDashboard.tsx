"use client";

import { useState } from "react";
import { BarChart3, Calendar, Globe, Home, PieChart } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import FinanceTabsContentDashboard from "./finance/FinanceTabsContentDashboard";
import OccupancyTabsContentDashboard from "./occupancy/OccupancyTabsContentDashboard";
import OriginCustomerTabsContentDashboard from "./origin-customer/OriginCustomerTabsContentDashboard";
import ReservationTabsContentDashboard from "./reservation/ReservationTabsContentDashboard";
import SummaryTabsContentDashoard from "./summary/SummaryTabsContentDashboard";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("resumen");
  const [year, setYear] = useState(new Date().getFullYear() as number);
  const [yearReservation, setYearReservation] = useState(new Date().getFullYear() as number);
  const [yearFinance, setYearFinance] = useState(new Date().getFullYear() as number);
  const [yearOrigin, setYearOrigin] = useState(new Date().getFullYear() as number);

  const { annualStatistics, monthlyEarningsExpenses, occupancyStatisticsPercentage } = useDashboard({
    year,
  });

  const { monthlyBookingTrend } = useDashboard({
    yearReservation,
  });

  const { annualSummaryFinance } = useDashboard({
    yearFinance,
  });

  const { customerOriginSummary, monthlyCustomerOrigin, top10CountriesCustomers, top10ProvincesCustomers } =
    useDashboard({
      yearOrigin,
    });

  const { nextPendingPayments, recentReservations, roomOccupancy } = useDashboard({ activeTab });

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
        <SummaryTabsContentDashoard
          annualStatistics={annualStatistics}
          monthlyEarningsExpenses={monthlyEarningsExpenses}
          nextPendingPayments={nextPendingPayments}
          recentReservations={recentReservations}
          roomOccupancy={roomOccupancy}
          setYear={setYear}
          year={year}
        />

        {/* Pestaña de Ocupación */}
        <OccupancyTabsContentDashboard
          roomOccupancy={roomOccupancy}
          occupancyStatisticsPercentage={occupancyStatisticsPercentage}
          setYear={setYear}
          year={year}
        />

        {/* Pestaña de Reservas */}
        <ReservationTabsContentDashboard
          year={yearReservation}
          setYear={setYearReservation}
          monthlyBookingTrend={monthlyBookingTrend}
        />

        {/* Pestaña de Finanzas */}
        <FinanceTabsContentDashboard
          year={yearFinance}
          setYear={setYearFinance}
          annualSummaryFinance={annualSummaryFinance}
        />

        {/* Pestaña de Procedencia */}
        <OriginCustomerTabsContentDashboard
          year={yearOrigin}
          setYear={setYearOrigin}
          customerOriginSummary={customerOriginSummary}
          monthlyCustomerOrigin={monthlyCustomerOrigin}
          top10CountriesCustomers={top10CountriesCustomers}
          top10ProvincesCustomers={top10ProvincesCustomers}
        />
      </Tabs>
    </div>
  );
}
