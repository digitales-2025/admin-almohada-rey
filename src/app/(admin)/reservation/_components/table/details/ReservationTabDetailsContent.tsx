import { Info, Mail, MapPin, MessageSquare, Phone, Users } from "lucide-react";

import { UserRolType } from "@/app/(admin)/users/_types/user";
import { UserRolTypeLabels } from "@/app/(admin)/users/_utils/users.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DetailedReservation } from "../../../_schemas/reservation.schemas";
import { formatDate, formatTime } from "./ReservationDetailsForm";

interface ReservationTabDetailsContentProps {
  row: DetailedReservation;
}

export default function ReservationTabDetailsContent({ row }: ReservationTabDetailsContentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/10 p-4">
            <h3 className="font-medium">Detalles de la reserva</h3>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Origen</p>
                <p className="text-sm font-medium">{row.origin}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Motivo</p>
                <p className="text-sm font-medium capitalize">{row.reason}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Huéspedes</p>
                <p className="text-sm font-medium">
                  {row.guests && row.guests !== "[]"
                    ? JSON.parse(row.guests).length
                    : "No se especificaron huéspedes adicionales"}
                </p>
              </div>
            </div>

            {row.observations && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Observaciones</p>
                  <p className="text-sm font-medium">{row.observations}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/5 p-4">
            <h3 className="font-medium">Registrado por</h3>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {row.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-medium capitalize">{row.user.name}</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {UserRolTypeLabels[row.user.userRol as UserRolType]?.label || row.user.userRol.toLowerCase()}
                </p>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{row.user.phone}</span>
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{row.user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Último acceso</span>
                <span>
                  {formatDate(row.user.lastLogin)} {formatTime(row.user.lastLogin)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border mt-6">
          <div className="bg-primary/5 p-4">
            <h3 className="font-medium">Información del sistema</h3>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Creado</span>
              <span>
                {row.createdAt ? `${formatDate(row.createdAt)} ${formatTime(row.createdAt)}` : "No disponible"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Actualizado</span>
              <span>
                {row.updatedAt ? `${formatDate(row.updatedAt)} ${formatTime(row.updatedAt)}` : "No disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
