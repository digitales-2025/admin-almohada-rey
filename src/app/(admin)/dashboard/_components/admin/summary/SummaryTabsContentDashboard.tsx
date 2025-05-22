import { createPortal } from "react-dom";

import { FilterYear } from "@/components/ui/filter-year";
import { TabsContent } from "@/components/ui/tabs";
import {
  AnnualAdministratorStatistics,
  MontlyEarningsAndExpenses,
  NextPendingPayments,
  RecentReservations,
  RoomOccupancyMap,
} from "../../../_types/dashboard";
import { NextPendingPaymentsDashboard } from "./NextPendingPaymentsDashboard";
import { OccupancyChart } from "./OccupancyChart";
import { RecentReservationsDashboard } from "./RecentReservationsDashboard";
import { RevenueChart } from "./RevenueChart";
import StatisticsCards from "./StatisticsCards";

interface SummaryTabsContentDashboardProps {
  year: number;
  setYear: (year: number) => void;
  roomOccupancy: RoomOccupancyMap | undefined;
  annualStatistics: AnnualAdministratorStatistics | undefined;
  monthlyEarningsExpenses: MontlyEarningsAndExpenses[] | undefined;
  recentReservations: RecentReservations | undefined;
  nextPendingPayments: NextPendingPayments | undefined;
}

export default function SummaryTabsContentDashboard({
  year,
  setYear,
  annualStatistics,
  monthlyEarningsExpenses,
  nextPendingPayments,
  recentReservations,
  roomOccupancy,
}: SummaryTabsContentDashboardProps) {
  const element = document.getElementById("headerContent");
  return (
    <TabsContent value="resumen" className="space-y-4">
      {element &&
        createPortal(
          <div id="headerContent">
            <FilterYear selectedYear={year} onSelectYear={setYear} />
          </div>,
          element
        )}

      {/* Contenido existente de la pestaña Resumen */}
      <StatisticsCards annualStatistics={annualStatistics} />

      <div className="grid gap-4 md:grid-cols-7">
        <RevenueChart monthlyEarningsExpenses={monthlyEarningsExpenses} />

        <OccupancyChart roomOccupancy={roomOccupancy} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <RecentReservationsDashboard recentReservations={recentReservations} />
        <NextPendingPaymentsDashboard nextPendingPayments={nextPendingPayments} />
      </div>
    </TabsContent>
  );
}
