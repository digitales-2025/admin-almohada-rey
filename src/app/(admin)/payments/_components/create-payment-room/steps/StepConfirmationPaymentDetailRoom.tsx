import { CalendarPlus2Icon as CalendarIcon2, Hotel, Receipt, ShoppingCart } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CreateRoomPaymentDetailSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Separator } from "@/components/ui/separator";
import { RoomPaymentDetails } from "../../../_types/payment";

interface StepConfirmationPaymentDetailRoomProps {
  form: UseFormReturn<CreateRoomPaymentDetailSchema>;
  roomPaymentDetailsByPaymentId: RoomPaymentDetails | undefined;
}

export default function StepConfirmationPaymentDetailRoom({
  form,
  roomPaymentDetailsByPaymentId,
}: StepConfirmationPaymentDetailRoomProps) {
  const roomTypeName = roomPaymentDetailsByPaymentId?.reservation?.room?.RoomTypes.name;
  const typeKey = getRoomTypeKey(roomTypeName ?? "");
  const config = RoomTypeLabels[typeKey];
  const Icon = config.icon;
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border rounded-xl overflow-hidden">
        <div className="bg-primary/10 p-4 border-b">
          <h3 className="text-lg font-medium flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-primary" />
            Resumen del Pago
          </h3>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Fecha</div>
              <div className="font-medium text-sm flex items-center">
                <CalendarIcon2 className="h-4 w-4 mr-1.5 text-primary" />
                {form.getValues("paymentDate")}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Descripción</div>
              <div className="font-medium text-sm">{form.getValues("description") || "—"}</div>
            </div>
          </div>

          <Separator />

          {/* Room details */}
          <div>
            <div className="flex items-center mb-3">
              <Hotel className="h-4 w-4 mr-1.5 text-primary" />
              <h4 className="font-medium">Detalles de la Habitación</h4>
            </div>

            <div className="bg-muted/20 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Habitación:</span>
                <div className="flex gap-2 items-center font-medium text-sm">
                  <Icon className={`size-4 ${config.className}`} strokeWidth={1.5} />
                  <div className="flex flex-col">
                    <span className="capitalize">
                      {config.label} Habitación #{roomPaymentDetailsByPaymentId?.reservation?.room?.number}
                    </span>
                    <span className="text-xs text-muted-foreground"></span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Noches:</span>
                <span className="font-medium text-sm">{form.getValues("days")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precio por noche:</span>
                <span className="font-medium text-sm">S/. {form.getValues("unitPrice").toFixed(2)}</span>
              </div>
              <Separator />

              <div className="flex justify-between pt-1">
                <span className="text-sm font-medium">Subtotal Habitación:</span>
                <span className="font-bold">S/. {form.getValues("subtotal").toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Método de Pago</div>
            <div className="flex items-center space-x-2">
              <div
                className={`p-1.5 rounded-full bg-gradient-to-br ${getMethodColor(form.getValues("method"))} text-white`}
              >
                {getMethodIcon(form.getValues("method"))}
              </div>
              <span className="font-medium">{getPaymentMethodLabel(form.getValues("method"))}</span>
            </div>
          </div>

          <Separator />

          {/* Total amount */}
          <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg">
            <span className="font-semibold text-lg">Monto Total</span>
            <span className="font-bold text-xl text-primary">S/.{form.getValues("totalAmount").toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
        <div className=" mt-0.5">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-amber-800 font-medium">
            Por favor verifique todos los detalles antes de confirmar
          </p>
          <p className="text-xs text-amber-700 mt-1">Esta acción creará un nuevo registro de pago en el sistema.</p>
        </div>
      </div>
    </div>
  );
}
