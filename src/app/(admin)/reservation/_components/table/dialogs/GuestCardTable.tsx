import React from "react";
import { IdCard, LucideIcon, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { EnumConfig } from "@/types/enum/enum-ui.config";
import { ReservationGuest } from "../../../_schemas/reservation.schemas";
import { getDocumentTypeConfig } from "../../../_types/document-type.enum.config";

interface GuestMetadataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ReservationGuest[];
  // branchId: string;
}

type DataConfig = {
  cardTitle: string;
  cardDescription: string;
  Icon: LucideIcon;
};

export function GuestsTable({ data, ...rest }: GuestMetadataTableProps) {
  const tableValues: Record<
    keyof ReservationGuest,
    {
      label: string;
      value: (guest: ReservationGuest) => string;
    }
  > = {
    name: {
      label: "Nombre",
      value: (guest) => guest.name,
    },
    age: {
      label: "Edad",
      value: (guest) => guest.age?.toString() ?? "N/A",
    },
    documentId: {
      label: "Doc. de Identidad",
      value: (guest) => guest.documentId ?? "N/A",
    },
    documentType: {
      label: "Tipo de documento",
      value: (guest) => guest.documentType ?? "N/A",
    },
    phone: {
      label: "Teléfono",
      value: (guest) => guest.phone ?? "N/A",
    },
    email: {
      label: "Email",
      value: (guest) => guest.email ?? "N/A",
    },
    birthDate: {
      label: "Fecha de nacimiento",
      value: (guest) => guest.birthDate ?? "N/A",
    },
    additionalInfo: {
      label: "Información adicional",
      value: (guest) => `Adicionales ${guest.name ?? "N/A"}`,
    },
  };

  const DATA_CONFIG: DataConfig = {
    cardTitle: "Detalle de acompañantes",
    cardDescription: "Lista de acompañantes de la reservación",
    Icon: Users2,
  };

  return (
    <Card className="w-full" {...rest}>
      <CardHeader>
        <CardTitle className="text-primary flex space-x-2 items-center">
          <DATA_CONFIG.Icon className="size-4"></DATA_CONFIG.Icon>
          <span>{DATA_CONFIG.cardTitle}</span>
        </CardTitle>
        <CardDescription>{DATA_CONFIG.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tableValues.name.label}</TableHead>
                <TableHead>{tableValues.documentId.label}</TableHead>
                <TableHead>{tableValues.age.label}</TableHead>
                <TableHead>{tableValues.phone.label}</TableHead>
                <TableHead className="text-end">{tableValues.email.label}</TableHead>

                {/* <TableHead>Sucursal</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-black/50 font-bold">
                    No hay huéspedes adicionales
                  </TableCell>
                </TableRow>
              ) : (
                data.map((guest, index) => {
                  const docTypeConfig: EnumConfig | undefined = guest.documentType
                    ? getDocumentTypeConfig(guest.documentType)
                    : undefined;
                  return (
                    <TableRow key={guest.documentId ?? index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{tableValues.name.value(guest)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium flex justify-start items-center gap-2">
                        {docTypeConfig ? (
                          <Badge
                            className={cn(
                              docTypeConfig.backgroundColor,
                              docTypeConfig.textColor,
                              docTypeConfig.hoverBgColor,
                              "flex space-x-1 items-center justify-center text-sm border-none"
                            )}
                          >
                            <docTypeConfig.icon className="size-4" />
                            <span>{docTypeConfig.name}</span>
                          </Badge>
                        ) : (
                          <Badge className="flex space-x-1 items-center justify-center text-sm bg-gray-200 text-gray-800 hover:bg-gray-300 border-none">
                            <IdCard className="size-4" />
                            <span>{"N/A"}</span>
                          </Badge>
                        )}
                        <span>{tableValues.documentId.value(guest)}</span>
                      </TableCell>
                      <TableCell>{tableValues.age.value(guest)}</TableCell>
                      <TableCell>{tableValues.phone.value(guest)}</TableCell>
                      <TableCell className="text-end">{tableValues.email.value(guest)}</TableCell>
                    </TableRow>
                  );
                })
              )}
              {
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Total:</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-end font-semibold">{data.length}</TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
