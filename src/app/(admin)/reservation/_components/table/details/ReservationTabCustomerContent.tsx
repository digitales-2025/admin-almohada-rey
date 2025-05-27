import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  Briefcase,
  Building,
  Calendar,
  CreditCard,
  Home,
  Landmark,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  CustomerDocumentTypeLabels,
  CustomerMaritalStatusLabels,
} from "@/app/(admin)/customers/_utils/customers.utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DetailedReservation } from "../../../_schemas/reservation.schemas";

interface ReservationTabCustomerContentProps {
  row: DetailedReservation;
}

export default function ReservationTabCustomerContent({ row }: ReservationTabCustomerContentProps) {
  // Si no hay cliente asignado, mostrar mensaje
  if (!row.customer) {
    return (
      <Alert variant={"destructive"} className="bg-amber-50 border-amber-200">
        <div className="flex flex-row items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Cliente no asignado. Esta reserva fue creada desde la página web y está pendiente de confirmación.
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  // Obtener configuraciones de documento y estado civil
  const customerData = row.customer;
  const documentTypeConfig = customerData.documentType
    ? CustomerDocumentTypeLabels[customerData.documentType as keyof typeof CustomerDocumentTypeLabels]
    : undefined;
  const DocumentTypeIcon = documentTypeConfig?.icon;

  const maritalStatusConfig = customerData.maritalStatus
    ? CustomerMaritalStatusLabels[customerData.maritalStatus as keyof typeof CustomerMaritalStatusLabels]
    : undefined;
  const MaritalStatusIcon = maritalStatusConfig?.icon;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/10 p-4 flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {customerData.name ? customerData.name.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-lg font-semibold capitalize">{customerData.name || "Sin nombre"}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {documentTypeConfig && (
                  <Badge variant="outline" className={cn("flex items-center gap-1", documentTypeConfig?.className)}>
                    {DocumentTypeIcon && <DocumentTypeIcon className="h-3 w-3" />}
                    <span>
                      {documentTypeConfig?.label}: {customerData.documentNumber}
                    </span>
                  </Badge>
                )}

                {maritalStatusConfig && (
                  <Badge variant="outline" className={cn("flex items-center gap-1", maritalStatusConfig?.className)}>
                    {MaritalStatusIcon && <MaritalStatusIcon className="h-3 w-3" />}
                    <span>{maritalStatusConfig?.label}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Teléfono</p>
                <p className="text-sm font-medium">{customerData.phone || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{customerData.email || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ocupación</p>
                <p className="text-sm font-medium">{customerData.occupation || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                <p className="text-sm font-medium">
                  {customerData.birthDate
                    ? format(parseISO(customerData.birthDate), "d 'de' MMMM 'de' yyyy", { locale: es })
                    : "No especificado"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="rounded-xl overflow-hidden border">
          <div className="bg-primary/5 p-4">
            <h3 className="font-medium">Ubicación</h3>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dirección</p>
                <p className="text-sm font-medium">{customerData.address || "No especificado"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ubicación</p>
                <p className="text-sm font-medium">
                  {customerData.province ? `${customerData.province}, ` : ""}
                  {customerData.department ? `${customerData.department}, ` : ""}
                  {customerData.country || "No especificado"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Landmark className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lugar de nacimiento</p>
                <p className="text-sm font-medium">{customerData.birthPlace || "No especificado"}</p>
              </div>
            </div>
          </div>
        </div>

        {(customerData.companyName || customerData.ruc || customerData.companyAddress) && (
          <div className="rounded-xl overflow-hidden border mt-6">
            <div className="bg-primary/5 p-4">
              <h3 className="font-medium">Información de empresa</h3>
            </div>

            <div className="p-4 space-y-4">
              {customerData.companyName && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Empresa</p>
                    <p className="text-sm font-medium">{customerData.companyName}</p>
                  </div>
                </div>
              )}

              {customerData.ruc && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">RUC</p>
                    <p className="text-sm font-medium">{customerData.ruc}</p>
                  </div>
                </div>
              )}

              {customerData.companyAddress && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dirección de empresa</p>
                    <p className="text-sm font-medium">{customerData.companyAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
