import { TabsContent } from "@radix-ui/react-tabs";
import { createPortal } from "react-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterYear } from "@/components/ui/filter-year";
import { MonthlyBookingTrend } from "../../../_types/dashboard";
import { ReservationTrends } from "./ReservationTrends";

interface ReservationTabsContentDashboardProps {
  year: number;
  setYear: (year: number) => void;
  monthlyBookingTrend: MonthlyBookingTrend[] | undefined;
}

export default function ReservationTabsContentDashboard({
  year,
  setYear,
  monthlyBookingTrend,
}: ReservationTabsContentDashboardProps) {
  const element = document.getElementById("headerContent");
  return (
    <TabsContent value="reservas" className="space-y-4 px-6">
      {element &&
        createPortal(
          <div id="headerContent">
            <FilterYear selectedYear={year} onSelectYear={setYear} />
          </div>,
          element
        )}
      {/* Contenido existente de la pestaña Reservas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tendencias de Reservas</CardTitle>
          <CardDescription>Análisis de patrones de reserva por canal</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ReservationTrends monthlyBookingTrend={monthlyBookingTrend} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
