"use client";

import { Briefcase, Building, Globe, Info, Mail, MapPin, Phone, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Customer } from "../../_types/customer";
import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "../../_utils/customers.utils";

interface CustomerDescriptionProps {
  row: Customer;
}

export const CustomerDescription = ({ row }: CustomerDescriptionProps) => {
  // Get document type label and icon
  const documentTypeConfig = CustomerDocumentTypeLabels[row.documentType];
  const DocumentTypeIcon = documentTypeConfig?.icon;

  // Get marital status label and icon
  const maritalStatusConfig = CustomerMaritalStatusLabels[row.maritalStatus];
  const MaritalStatusIcon = maritalStatusConfig?.icon;

  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden py-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-3">
        <div className="flex md:flex-row gap-6">
          {/* Avatar con borde del color del tipo de documento */}
          <div className="shrink-0">
            <div className={cn("p-1 rounded-full", `border-2 ${documentTypeConfig?.className || "border-primary"}`)}>
              <Avatar className="h-20 w-20 capitalize">
                <AvatarFallback className="bg-white text-primary">
                  <span className="text-3xl font-light">{row.name.charAt(0)}</span>
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Información principal */}
          <div className="flex-grow space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-semibold capitalize">{row.name}</CardTitle>
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
                  {documentTypeConfig?.label}: {row.documentNumber}
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
                <span>{row.occupation}</span>
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
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <User className="mr-2 h-4 w-4 shrink-0" />
              <h3>Información Personal</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{row.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm">{row.phone || "No registrado"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Lugar de nacimiento</p>
                  <p className="text-sm">{row.birthPlace}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de ubicación */}
          <div className="p-6 pt-2 md:pt-0 space-y-4">
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <MapPin className="mr-2 h-4 w-4 shrink-0" />
              <h3>Ubicación</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="text-sm">{row.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="text-sm capitalize">
                    {row.province ? `${row.province}, ` : ""}
                    {row.department ? `${row.department}, ` : ""}
                    {row.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de información empresarial (condicional) */}
          <div className="p-6 pt-2 md:pt-0 space-y-4">
            <div className="flex items-center text-sm font-medium text-primary mb-4">
              <Building className="mr-2 h-4 w-4 shrink-0" />
              <h3>Información Empresarial</h3>
            </div>

            {row.companyName || row.ruc || row.companyAddress ? (
              <div className="space-y-3">
                {row.companyName && (
                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Empresa</p>
                      <p className="text-sm">{row.companyName}</p>
                    </div>
                  </div>
                )}

                {row.ruc && (
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">RUC</p>
                      <p className="text-sm">{row.ruc}</p>
                    </div>
                  </div>
                )}

                {row.companyAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dirección de empresa</p>
                      <p className="text-sm">{row.companyAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                No se registró información empresarial
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
