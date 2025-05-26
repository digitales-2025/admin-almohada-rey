import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
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
    config: any;
    title: string;
    rooms: any[];
    count: number;
  }) => {
    const IconComponent = config.icon;

    return (
      <Card className="overflow-hidden border-0 py-0">
        <CardHeader className={`${config.backgroundColor} border-b-0 pb-4 py-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${config.backgroundColorIntense} text-white`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <CardTitle className={`text-xl font-bold ${config.textColor}`}>{title}</CardTitle>
            </div>
            <Badge className={`${config.backgroundColorIntense} text-white border-0 px-3 py-1 text-sm font-semibold`}>
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {rooms.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <IconComponent className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No hay amenidades de {title.toLowerCase()}</p>
              <p className="text-gray-400 text-sm mt-1">Todas las amenidades están al día</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rooms.map((room) => {
                const roomTypeInfo = getRoomTypeLabel(room.typeRoom);
                const RoomIcon = roomTypeInfo.icon;

                return (
                  <div key={room.id} className="p-6 hover:bg-primary/10 transition-colors duration-200 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 dark:bg-slate-900 rounded-md group-hover:bg-gray-200 transition-colors">
                            <RoomIcon className={`h-4 w-4 ${roomTypeInfo.className}`} />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Habitación {room.roomNumber}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${roomTypeInfo.className} border-current bg-transparent`}
                        >
                          {roomTypeInfo.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{room.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${config.backgroundColorIntense}`}></div>
                        <span className={`text-sm font-medium ${config.textColor}`}>Prioridad {config.name}</span>
                      </div>
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
