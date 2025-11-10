import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { EnumConfig } from "@/types/enum/enum-ui.config";
import { PriorityLevel, type AmenitiesByPriority } from "../../../_types/dashboard";
import { priorityLevelConfig } from "../../../_utils/dashboard.utils";

interface PendingAmenitiesTabsContentDashboardProps {
  amenitiesByPriority: AmenitiesByPriority | undefined;
}

export default function PendingAmenitiesTabsContentDashboard({
  amenitiesByPriority,
}: PendingAmenitiesTabsContentDashboardProps) {
  const emptyAmenities: AmenitiesByPriority = {
    highPriority: { count: 0, rooms: [] },
    mediumPriority: { count: 0, rooms: [] },
    lowPriority: { count: 0, rooms: [] },
  };

  const { highPriority, mediumPriority, lowPriority } = amenitiesByPriority || emptyAmenities;

  const getRoomTypeLabel = (typeRoom: string) => {
    const typeKey = getRoomTypeKey(typeRoom);
    return RoomTypeLabels[typeKey];
  };

  const highPriorityConfig = priorityLevelConfig[PriorityLevel.HIGH];
  const mediumPriorityConfig = priorityLevelConfig[PriorityLevel.MEDIUM];
  const lowPriorityConfig = priorityLevelConfig[PriorityLevel.LOW];

  const PriorityCard = ({
    config,
    title,
    rooms,
    count,
  }: {
    config: EnumConfig;
    title: string;
    rooms: any[];
    count: number;
  }) => {
    const IconComponent = config.icon;

    return (
      <Card className="border py-0">
        <CardHeader className={`${config.backgroundColor} border-b py-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${config.backgroundColorIntense}`}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
              <CardTitle className={`text-lg font-semibold ${config.textColor}`}>{title}</CardTitle>
            </div>
            <Badge variant="outline" className={`${config.textColor} ${config.borderColor} font-medium`}>
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rooms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <IconComponent className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No hay amenidades de {title.toLowerCase()}</p>
              <p className="text-xs text-muted-foreground mt-1">Todas las amenidades están al día</p>
            </div>
          ) : (
            <div className="divide-y">
              {rooms.map((room) => {
                const roomTypeInfo = getRoomTypeLabel(room.typeRoom);
                const RoomIcon = roomTypeInfo.icon;

                return (
                  <div key={room.id} className="p-6 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted flex-shrink-0">
                          <RoomIcon className={`h-4 w-4 ${roomTypeInfo.className}`} />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">Habitación {room.roomNumber}</span>
                          <Badge variant="outline" className={`text-xs ${roomTypeInfo.className} flex-shrink-0`}>
                            {roomTypeInfo.label}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{room.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.backgroundColorIntense}`}></div>
                      <span className={`text-xs font-medium ${config.textColor}`}>Prioridad {config.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <TabsContent value="amenidades" className="space-y-6 px-6">
      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <PriorityCard
          config={highPriorityConfig}
          title="Alta Prioridad"
          rooms={highPriority.rooms}
          count={highPriority.count}
        />

        <PriorityCard
          config={mediumPriorityConfig}
          title="Media Prioridad"
          rooms={mediumPriority.rooms}
          count={mediumPriority.count}
        />

        <PriorityCard
          config={lowPriorityConfig}
          title="Baja Prioridad"
          rooms={lowPriority.rooms}
          count={lowPriority.count}
        />
      </div>
    </TabsContent>
  );
}
