"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, ClipboardCheck, Clock, Edit, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomCleaning } from "../_types/roomCleaning";
import { getRoomTypeKey, RoomTypeLabels } from "../../../_utils/rooms.utils";
import { UpdateRoomCleaningSheet } from "./update/UpdateRoomCleaningSheet";

interface RoomCleaningRecordsGridProps {
  records: RoomCleaning[] | undefined;
}

export function RoomCleaningRecordsGrid({ records }: RoomCleaningRecordsGridProps) {
  const [selectedRecord, setSelectedRecord] = useState<RoomCleaning | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const handleEdit = (record: RoomCleaning) => {
    setSelectedRecord(record);
    setIsEditSheetOpen(true);
  };

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl shadow-sm border border-border">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground">No hay registros</h3>
        <p className="text-muted-foreground text-center mt-2">
          No se encontraron registros de limpieza para los criterios seleccionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {records.map((record) => {
          // Usar las nuevas utilidades
          const roomTypeKey = getRoomTypeKey(record.room.RoomTypes.name);
          const roomTypeInfo = RoomTypeLabels[roomTypeKey];
          const RoomTypeIcon = roomTypeInfo.icon;

          return (
            <div
              key={record.id}
              className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border"
            >
              {/* Room number header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {record.room.number}
                  </div>
                  <div>
                    <h3 className="font-medium text-card-foreground">Habitación {record.room.number}</h3>
                    <Badge variant="outline" className={`capitalize mt-1 ${roomTypeInfo.className}`}>
                      {record.room.RoomTypes.name}
                    </Badge>
                  </div>
                </div>
                <RoomTypeIcon className={`h-5 w-5 ${roomTypeInfo.className}`} />
              </div>

              {/* Card content */}
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium text-sm text-card-foreground">
                      {format(parseISO(record.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium text-sm text-card-foreground">
                      {format(parseISO(record.date), "HH:mm", { locale: es })} hrs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Personal</p>
                    <p className="font-medium text-sm text-card-foreground">{record.staffName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Verificado por</p>
                    <p className="font-medium text-sm capitalize text-card-foreground">{record.userCheck.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Observaciones</p>
                  <p className="text-sm bg-muted p-3 rounded-lg border border-border text-card-foreground">
                    {record.observations}
                  </p>
                </div>
              </div>

              {/* Footer with edit button */}
              <div className="p-4 border-t border-border bg-muted flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(record)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      {selectedRecord && (
        <UpdateRoomCleaningSheet
          roomCleaning={selectedRecord}
          open={isEditSheetOpen}
          onOpenChange={setIsEditSheetOpen}
        />
      )}
    </>
  );
}
