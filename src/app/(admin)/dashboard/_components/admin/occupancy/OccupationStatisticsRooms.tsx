import { getRoomTypeBgColor, getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OccupationStatisticsPercentage } from "../../../_types/dashboard";

interface OccupationStatisticsRoomsProps {
  occupancyStatisticsPercentage: OccupationStatisticsPercentage[] | undefined;
}

export default function OccupationStatisticsRooms({ occupancyStatisticsPercentage }: OccupationStatisticsRoomsProps) {
  // Si no hay datos o el array está vacío, mostrar un mensaje
  if (!occupancyStatisticsPercentage || occupancyStatisticsPercentage.length === 0) {
    return (
      <Card className="col-span-3 md:col-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Estadísticas de Ocupación</CardTitle>
          <CardDescription>Análisis por tipo de habitación</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl">Estadísticas de Ocupación</CardTitle>
        <CardDescription>Análisis por tipo de habitación</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {occupancyStatisticsPercentage.map((stat) => (
            <div key={stat.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${RoomTypeLabels[getRoomTypeKey(stat.type)].className}`}>
                  {RoomTypeLabels[getRoomTypeKey(stat.type)].label}
                </span>
                <span className="text-sm font-medium">{stat.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                <div
                  className={`h-full ${getRoomTypeBgColor(stat.type)} rounded-full`}
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
