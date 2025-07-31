"use client";

import { createPortal } from "react-dom";

import { FilterYear } from "@/components/ui/filter-year";
import { TabsContent } from "@/components/ui/tabs";
import { OccupationStatisticsPercentage, RoomOccupancyMap } from "../../../_types/dashboard";
import OccupationStatisticsRooms from "./OccupationStatisticsRooms";
import { RoomStatusByType } from "./RoomStatusByType";

interface OccupancyTabsContentDashboardProps {
  roomOccupancy: RoomOccupancyMap | undefined;
  occupancyStatisticsPercentage: OccupationStatisticsPercentage[] | undefined;
  year: number;
  setYear: (year: number) => void;
}

export default function OccupancyTabsContentDashboard({
  roomOccupancy,
  occupancyStatisticsPercentage,
  year,
  setYear,
}: OccupancyTabsContentDashboardProps) {
  const element = document.getElementById("headerContent");

  return (
    <TabsContent value="ocupacion" className="space-y-6 px-6">
      {element &&
        createPortal(
          <div id="headerContent">
            <FilterYear selectedYear={year} onSelectYear={setYear} />
          </div>,
          element
        )}

      <div className="grid gap-6 md:grid-cols-3">
        <RoomStatusByType roomOccupancy={roomOccupancy} />
        <OccupationStatisticsRooms occupancyStatisticsPercentage={occupancyStatisticsPercentage} />
      </div>
    </TabsContent>
  );
}
