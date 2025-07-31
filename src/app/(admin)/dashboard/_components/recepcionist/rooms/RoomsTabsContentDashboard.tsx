import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { RoomOccupancyMap, TodayAvailableRooms } from "../../../_types/dashboard";
import { RoomStatusByType } from "../../admin/occupancy/RoomStatusByType";
import { AvailableRooms } from "./AvailableRooms";

interface RoomsTabsContentDashboardProps {
  roomOccupancy: RoomOccupancyMap | undefined;
  todayAvailableRooms: TodayAvailableRooms[] | undefined;
}

export default function RoomsTabsContentDashboard({
  roomOccupancy,
  todayAvailableRooms,
}: RoomsTabsContentDashboardProps) {
  const router = useRouter();
  return (
    <TabsContent value="habitaciones" className="space-y-4 px-6">
      <RoomStatusByType roomOccupancy={roomOccupancy} />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Habitaciones Disponibles</CardTitle>
              <CardDescription>Habitaciones listas para check-in</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/reservation")}>
              Ver todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AvailableRooms todayAvailableRooms={todayAvailableRooms} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
