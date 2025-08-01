"use client";

import { useState } from "react";
import { Calendar, CalendarDays, ClipboardList, Hotel } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboard } from "../../_hooks/use-dashboard";
import PendingAmenitiesTabsContentDashboard from "./pending-amenities/PendingAmenitiesTabsContentDashboard";
import RoomsTabsContentDashboard from "./rooms/RoomsTabsContentDashboard";
import TodayTabsContentDashboard from "./today/TodayTabsContentDashboard";
import WeekReservationsTabsContentDashboard from "./week-reservations/WeekReservationsTabsContentDashboard";

export function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("hoy");
  const {
    todayRecepcionistStatistics,
    top5TodayCheckIn,
    top5TodayCheckOut,
    top5PriorityPendingAmenities,
    roomOccupancy,
    amenitiesByPriority,
    todayAvailableRooms,
    weekReservations,
  } = useDashboard({ activeTab });

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="hoy" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="relative grid grid-cols-4 w-full h-fit border-0 z-10">
          <TabsTrigger
            value="hoy"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Hoy</span>
          </TabsTrigger>
          <TabsTrigger
            value="habitaciones"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Hotel className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Habitaciones</span>
          </TabsTrigger>
          <TabsTrigger
            value="semana-reservas"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Reservas</span>
          </TabsTrigger>
          <TabsTrigger
            value="amenidades"
            className="flex items-center justify-center gap-2 py-2 px-3 text-sm rounded-lg data-[state=active]:text-primary/80 data-[state=active]:border-b-2 data-[state=active]:border-primary/80 data-[state=inactive]:text-muted-foreground"
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            <span className="truncate text-ellipsis font-medium">Amenidades</span>
          </TabsTrigger>
        </TabsList>

        <TodayTabsContentDashboard
          todayRecepcionistStatistics={todayRecepcionistStatistics}
          top5PriorityPendingAmenities={top5PriorityPendingAmenities}
          top5TodayCheckIn={top5TodayCheckIn}
          top5TodayCheckOut={top5TodayCheckOut}
        />

        <RoomsTabsContentDashboard roomOccupancy={roomOccupancy} todayAvailableRooms={todayAvailableRooms} />

        <WeekReservationsTabsContentDashboard weekReservations={weekReservations} />

        <PendingAmenitiesTabsContentDashboard amenitiesByPriority={amenitiesByPriority} />
      </Tabs>
    </div>
  );
}
