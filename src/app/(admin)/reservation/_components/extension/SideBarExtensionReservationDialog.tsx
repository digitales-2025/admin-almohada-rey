import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Calendar, CalendarFold, Clock, CreditCard, Home, User } from "lucide-react";

import type { CustomerDocumentType } from "@/app/(admin)/customers/_types/customer";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DetailedReservation } from "../../_schemas/reservation.schemas";
import { getDocumentTypeConfig } from "../../_types/document-type.enum.config";

interface SideBarExtensionReservationDialogProps {
  reservation: DetailedReservation;
}

export default function SideBarExtensionReservationDialog({ reservation }: SideBarExtensionReservationDialogProps) {
  return (
    <div className="lg:w-[300px] bg-gradient-to-b from-primary/40 to-primary/20 dark:from-primary/20 dark:to-primary/10 p-5 rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-primary/30 dark:bg-primary/40 p-2 rounded-full">
            <CalendarFold className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold dark:text-slate-100">Modificar Reserva</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Customer Card */}
        <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="bg-primary/40 dark:bg-primary/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <h3 className="font-medium text-sm dark:text-slate-100">Información del Cliente</h3>
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-col">
              <h4 className="text-sm font-semibold capitalize dark:text-white">{reservation.customer.name}</h4>

              {reservation.customer.documentType && (
                <div className="mt-2 inline-flex items-center">
                  {(() => {
                    const docConfig = getDocumentTypeConfig(reservation.customer.documentType as CustomerDocumentType);
                    const DocIcon = docConfig.icon;
                    return (
                      <Badge
                        className={cn(
                          docConfig.backgroundColor,
                          docConfig.textColor,
                          docConfig.hoverBgColor,
                          "flex gap-1 items-center border-none mr-2"
                        )}
                      >
                        <DocIcon className="size-3" />
                        <span>{docConfig.name}</span>
                      </Badge>
                    );
                  })()}
                  <span className="text-sm font-medium dark:text-slate-200">{reservation.customer.documentNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Room Card */}
        <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="bg-primary/40 dark:bg-primary/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <h3 className="font-medium text-sm dark:text-slate-100">Detalles de Habitación</h3>
            </div>
            <div className="bg-white/20 dark:bg-gray-700/50 text-xs font-bold px-2 py-0.5 rounded-full dark:text-slate-200">
              #{reservation.room.number}
            </div>
          </div>

          <div className="p-4">
            {(() => {
              const roomTypeName = reservation.room.RoomTypes.name;
              const typeKey = getRoomTypeKey(roomTypeName);
              const config = RoomTypeLabels[typeKey];
              const Icon = config.icon;

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.className}`} strokeWidth={1.5} />
                    <span className="font-medium dark:text-white">{config.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-primary/20 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-70 dark:text-slate-300 mb-1">Capacidad</div>
                      <div className="font-semibold text-sm dark:text-white">
                        {reservation.room.RoomTypes.guests || 2} personas
                      </div>
                    </div>

                    <div className="bg-primary/20 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                      <div className="text-xs opacity-70 dark:text-slate-300 mb-1">Tarifa</div>
                      <div className="font-semibold text-sm dark:text-white">
                        S/{reservation.room.RoomTypes.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Dates Card */}
        <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          <div className="bg-primary/40 dark:bg-primary/50 px-4 py-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <h3 className="font-medium text-sm dark:text-slate-100">Periodo de Estancia</h3>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="bg-primary/20 dark:bg-gray-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1">
                  <Clock className="h-5 w-5 dark:text-slate-200" />
                </div>
                <div className="text-xs opacity-70 dark:text-slate-300">Entrada</div>
                <div className="font-semibold text-sm dark:text-white">
                  {reservation.checkInDate
                    ? format(parseISO(reservation.checkInDate), "dd/MM/yyyy", { locale: es })
                    : "N/A"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="h-5 w-5 opacity-50 dark:text-slate-400" />
                <div className="text-xs mt-1 dark:text-slate-300">Noches</div>
              </div>

              <div className="text-center">
                <div className="bg-primary/20 dark:bg-gray-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-1">
                  <CreditCard className="h-5 w-5 dark:text-slate-200" />
                </div>
                <div className="text-xs opacity-70 dark:text-slate-300">Salida</div>
                <div className="font-semibold text-sm dark:text-white">
                  {reservation.checkOutDate
                    ? format(parseISO(reservation.checkOutDate), "dd/MM/yyyy", { locale: es })
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
