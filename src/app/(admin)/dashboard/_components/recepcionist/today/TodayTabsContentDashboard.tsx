import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  TodayRecepcionistStatistics,
  Top5PriorityPendingAmenities,
  Top5TodayCheckIn,
  Top5TodayCheckOut,
} from "../../../_types/dashboard";
import { PendingAmenities } from "./PendingAmenities";
import RecepcionistStatisticsCards from "./RecepcionistStatisticsCards";
import { TodayCheckIns } from "./TodayCheckIns";
import { TodayCheckOuts } from "./TodayCheckOuts";

interface TodayTabsContentDashboardProps {
  todayRecepcionistStatistics: TodayRecepcionistStatistics | undefined;
  top5TodayCheckIn: Top5TodayCheckIn[] | undefined;
  top5TodayCheckOut: Top5TodayCheckOut[] | undefined;
  top5PriorityPendingAmenities: Top5PriorityPendingAmenities[] | undefined;
}

export default function TodayTabsContentDashboard({
  todayRecepcionistStatistics,
  top5TodayCheckIn,
  top5TodayCheckOut,
  top5PriorityPendingAmenities,
}: TodayTabsContentDashboardProps) {
  const router = useRouter();
  return (
    <TabsContent value="hoy" className="space-y-4 px-6">
      <RecepcionistStatisticsCards todayRecepcionistStatistics={todayRecepcionistStatistics!} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 md:col-span-4">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <div>
                <CardTitle className="text-xl">Check-ins de Hoy</CardTitle>
                <CardDescription>Huéspedes que llegarán hoy</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/reservation")}>
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TodayCheckIns top5TodayCheckIn={top5TodayCheckIn} />
          </CardContent>
        </Card>

        <Card className="col-span-7 md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Check-outs de Hoy</CardTitle>
                <CardDescription>Huéspedes que se irán hoy</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/reservation")}>
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TodayCheckOuts top5TodayCheckOut={top5TodayCheckOut} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Amenidades Pendientes</CardTitle>
              <CardDescription>Amenidades que requieren tu atención</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PendingAmenities top5PriorityPendingAmenities={top5PriorityPendingAmenities} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
