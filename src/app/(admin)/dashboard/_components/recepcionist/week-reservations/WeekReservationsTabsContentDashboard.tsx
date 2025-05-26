import { TabsContent } from "@/components/ui/tabs";
import { WeekReservations } from "../../../_types/dashboard";
import UpcomingReservations from "./UpcomingReservations";
import WeekReservationsStatistics from "./WeekReservationsStatistics";

interface WeekReservationsTabsContentDashboardProps {
  weekReservations: WeekReservations | undefined;
}

export default function WeekReservationsTabsContentDashboard({
  weekReservations,
}: WeekReservationsTabsContentDashboardProps) {
  return (
    <TabsContent value="semana-reservas" className="space-y-4 px-6">
      {/* Estadísticas rápidas */}
      <WeekReservationsStatistics weekReservations={weekReservations} />

      {/* Lista de reservas mejorada */}
      <UpcomingReservations weekReservations={weekReservations} />
    </TabsContent>
  );
}
