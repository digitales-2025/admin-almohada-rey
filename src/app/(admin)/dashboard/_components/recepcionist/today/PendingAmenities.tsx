import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PriorityLevel, Top5PriorityPendingAmenities } from "../../../_types/dashboard";
import { priorityLevelConfig } from "../../../_utils/dashboard.utils";

interface PendingAmenitiesProps {
  top5PriorityPendingAmenities: Top5PriorityPendingAmenities[] | undefined;
}

export function PendingAmenities({ top5PriorityPendingAmenities = [] }: PendingAmenitiesProps) {
  const getPriorityBadge = (priority: PriorityLevel) => {
    const config = priorityLevelConfig[priority];
    const Icon = config.icon;

    return (
      <Badge className={`${config.backgroundColor} ${config.textColor} font-medium`} variant="outline">
        <Icon className="h-3 w-3 mr-1" />
        {config.name}
      </Badge>
    );
  };

  const getRoomTypeIcon = (typeRoom: string) => {
    const typeKey = getRoomTypeKey(typeRoom);
    const { icon: Icon, className } = RoomTypeLabels[typeKey];

    return <Icon className={`h-5 w-5 ${className}`} />;
  };

  const getRoomTypeLabel = (typeRoom: string) => {
    const typeKey = getRoomTypeKey(typeRoom);
    return RoomTypeLabels[typeKey].label;
  };

  return (
    <div className="space-y-4">
      {top5PriorityPendingAmenities.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-muted-foreground">No hay amenidades pendientes</p>
        </div>
      ) : (
        top5PriorityPendingAmenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{getRoomTypeIcon(amenity.typeRoom)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    Habitación {getRoomTypeLabel(amenity.typeRoom)} {amenity.roomNumber}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{amenity.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2"> {getPriorityBadge(amenity.priority)}</div>
          </div>
        ))
      )}
    </div>
  );
}
