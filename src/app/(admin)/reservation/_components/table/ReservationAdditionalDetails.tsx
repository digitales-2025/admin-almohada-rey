"use client";

import { Briefcase, Building, MapPin } from "lucide-react";

import {
  CustomerDocumentTypeLabels,
  CustomerMaritalStatusLabels,
} from "@/app/(admin)/customers/_utils/customers.utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DetailedReservation } from "../../_schemas/reservation.schemas";

interface ReservationAddDetailsProps {
  row: DetailedReservation;
}

export const ReservationAdditionalDetails = ({ row }: ReservationAddDetailsProps) => {
  // Get document type label and icon
  const customerData = row.customer;
  // const userData = row.user;
  const documentTypeConfig = CustomerDocumentTypeLabels[customerData.documentType];
  const DocumentTypeIcon = documentTypeConfig?.icon;

  // Get marital status label and icon
  const maritalStatusConfig = CustomerMaritalStatusLabels[customerData.maritalStatus];
  const MaritalStatusIcon = maritalStatusConfig?.icon;

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden py-0">
      <CardHeader className="bg-primary/10 dark:bg-primary/10 py-3">
        <div className="flex md:flex-row gap-6">
          {/* Avatar con borde del color del tipo de documento */}
          <div className="shrink-0">
            <div className={cn("p-1 rounded-full", `border-2 ${documentTypeConfig?.className || "border-primary"}`)}>
              <Avatar className="h-20 w-20 capitalize">
                <AvatarFallback className="bg-white dark:bg-primary/10 text-primary">
                  <span className="text-3xl font-light">{customerData.name.charAt(0)}</span>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-semibold capitalize flex flex-col">
                <span className="text-xs">Cliente</span>
                {customerData.name}
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "ml-2 text-xs font-medium",
                  row.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                )}
              >
                {row.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              {/* Badge de tipo de documento */}
              <Badge
                variant="outline"
                className={cn("flex items-center gap-1 py-1 px-2", documentTypeConfig?.className)}
              >
                {DocumentTypeIcon && <DocumentTypeIcon className="h-3.5 w-3.5 shrink-0" />}
                <span>
                  {documentTypeConfig?.label}: {customerData.documentNumber}
                </span>
              </Badge>

              {/* Badge de estado civil */}
              <Badge
                variant="outline"
                className={cn("flex items-center gap-1 py-1 px-2", maritalStatusConfig?.className)}
              >
                {MaritalStatusIcon && <MaritalStatusIcon className="h-3.5 w-3.5 shrink-0" />}
                <span>{maritalStatusConfig?.label}</span>
              </Badge>

              {/* Badge de ocupación */}
              <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 border-amber-200 text-amber-700">
                <Briefcase className="h-3.5 w-3.5 shrink-0" />
                <span>{customerData.occupation}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Contenido principal */}
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
          {/* Sección de información personal */}
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center text-sm font-medium text-primary dark:text-sidebar-primary-foreground mb-4">
              <h3>Información de contacto del cliente</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{customerData?.email ?? "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm">{customerData?.phone ?? "No registrado"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de ubicación */}
          <div className="p-6 pt-2 md:pt-0 space-y-4">
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <h3>Ubicación</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="text-sm break-words whitespace-pre-line">{customerData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="text-sm capitalize">
                    {customerData.province ? `${customerData.province}, ` : ""}
                    {customerData.department ? `${customerData.department}, ` : ""}
                    {customerData.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de información del personal que registro la reserva */}
          <div className="p-6 pt-2 md:pt-0 space-y-4">
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <h3>Persona que registró la reserva</h3>
            </div>

            {row.user?.name ? (
              <div className="space-y-3">
                {row.observations && (
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-lg font-semibold capitalize">{row.user.name}</p>
                      <p className="text-xs font-semibold capitalize">{row.user?.phone ?? "Tel. no disponible"}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                No se en cuentra el registro
              </div>
            )}
          </div>

          {/* Sección de información empresarial (condicional) */}
          <div className="p-6 pt-2 md:pt-0 space-y-4 lg:col-span-3">
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <h3>Observaciones</h3>
            </div>

            {row.observations ? (
              <div className="space-y-3">
                {row.observations && (
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-balance">{row.observations}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                No se registraron observaciones para la reserva
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
