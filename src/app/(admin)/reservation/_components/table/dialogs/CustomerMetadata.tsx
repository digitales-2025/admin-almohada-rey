import React from "react";
import { MapPinHouse, SquareUserRound } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ReservationCustomer } from "../../../_schemas/reservation.schemas";

interface CustomerMetadataPropsDesktop {
  data: ReservationCustomer;
  //   branchData?: Branch;
}
export function CustomerMetadata({
  //   branchData,
  data,
}: CustomerMetadataPropsDesktop) {
  const fullAddress = `${data.address ?? "Sin dirección"} ${data.province ?? ""} ${data.country ?? ""}`;
  return (
    <>
      <div className="flex rounded-sm bg-primary/10 p-4 w-fit space-x-4 items-start !mt-0">
        {/* <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
          <Building2 className="text-primary"></Building2>
            <Label className="text-sm font-medium">Sucursal creación</Label>
            <span className="text-sm text-muted-foreground">
              {branchData?.name ?? "Sin nombre"}
            </span>
          </div>
        </div>
        <Separator orientation="vertical"></Separator> */}
        <div className="flex space-x-2">
          <div className="flex flex-col gap-2 justify-center items-start">
            <SquareUserRound className="text-primary"></SquareUserRound>
            <Label className="text-sm font-medium">Cliente</Label>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground block capitalize">{data.name ?? "Sin nombre"}</span>
              {/* <span className="text-sm text-muted-foreground block">
                {data.phone ?? "No hay DNI"}
              </span> */}
            </div>
          </div>
        </div>
        <Separator orientation="vertical"></Separator>
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            <MapPinHouse className="text-primary"></MapPinHouse>
            <Label className="text-sm font-medium">Contacto</Label>
            <span className="text-sm text-muted-foreground">{fullAddress}</span>
            <span className="text-sm text-muted-foreground">{data.phone ?? "Sin teléfono"}</span>
          </div>
        </div>
      </div>
    </>
  );
}
