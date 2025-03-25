import React from "react";
import { MapPinHouse, SquareUserRound } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ReservationCustomer } from "../../../_schemas/reservation.schemas";

interface CustomerMetadataPropsMobile {
  data: ReservationCustomer;
}
function CustomerMetadataMobile({ data }: CustomerMetadataPropsMobile) {
  const fullAddress = `${data.address ?? "Sin dirección"} ${data.province ?? ""} ${data.country ?? ""}`;
  return (
    <div className="flex flex-col">
      <div className="flex rounded-sm bg-primary/10 p-4 w-full space-x-4 items-center justify-center">
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            <div className="flex justify-center w-full">
              <SquareUserRound className="text-primary"></SquareUserRound>
            </div>
            <Label className="text-sm font-medium text-center w-full">Cliente</Label>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground block text-center">{data.name ?? "Sin nombre"}</span>
              {/* <span className="text-sm text-muted-foreground block text-center">
                {patientData.dni ?? "No hay DNI"}
              </span> */}
            </div>
          </div>
        </div>
        <Separator orientation="vertical"></Separator>
        <div className="flex space-x-2">
          <div className="flex flex-col gap-1 justify-center items-start">
            <div className="flex justify-center w-full">
              <MapPinHouse className="text-primary"></MapPinHouse>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start">
              <Label className="text-sm font-mediumn text-center w-full">Contacto</Label>
              <span className="text-sm text-muted-foreground text-center block w-full">{fullAddress}</span>
              <span className="text-sm text-muted-foreground text-center block w-full">
                {data.phone ?? "Sin teléfono"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CustomerMetadataMobile };
