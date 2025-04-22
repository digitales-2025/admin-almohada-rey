import { Banknote, Bed, Hotel, Minus, Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Room } from "@/app/(admin)/rooms/list/_types/room";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";

interface UpdatePaymentDetailRoomProps {
  detailForm: UseFormReturn<PaymentDetailFormValues>;
  dataRoomsAll: Room[] | undefined;
  missingDays: number;
  paymentDays: number;
  selectedDetailDays: number;
}

export default function UpdatePaymentDetailRoom({
  detailForm,
  dataRoomsAll,
  missingDays,
  paymentDays,
  selectedDetailDays,
}: UpdatePaymentDetailRoomProps) {
  return (
    <div className="space-y-6">
      <div className={cn("border rounded-lg p-4 ")}>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Hotel className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-blue-700">Detalles de la Habitación</h4>
            <p className="text-xs text-muted-foreground">Seleccione habitación y duración de estancia</p>
          </div>
        </div>

        <FormField
          control={detailForm.control}
          name="roomId"
          render={({ field }) => {
            // Encontrar la habitación seleccionada
            const selectedRoom = dataRoomsAll?.find((room) => room.id === field.value);

            // Obtener el tipo de habitación y configurar el icono/color solo si hay una habitación seleccionada
            const roomTypeName = selectedRoom?.RoomTypes?.name || "";
            const typeKey = selectedRoom ? getRoomTypeKey(roomTypeName) : "";
            const config = typeKey
              ? RoomTypeLabels[typeKey]
              : { icon: Bed, className: "text-gray-500", label: "Estándar" };
            const Icon = config.icon;

            return (
              <FormItem className="mb-4">
                <FormLabel className="text-sm font-medium mb-1.5">Habitación</FormLabel>
                <FormControl>
                  <div className="border rounded-lg p-2 flex items-center gap-2 ">
                    {selectedRoom ? (
                      <>
                        <Icon className={`size-4 ${config.className}`} strokeWidth={1.5} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium capitalize">
                            {config.label} Habitación #{selectedRoom.number}
                          </span>
                          <span className="text-xs text-muted-foreground"></span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">No hay habitación seleccionada</span>
                    )}
                    <Input type="hidden" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={detailForm.control}
            name="days"
            render={({ field }) => {
              // Usando la prop selectedDetailDays para saber el valor original del detalle que estamos editando
              const originalDetailDays = selectedDetailDays || 0;

              // El máximo permitido es:
              // missingDays (días sin pagar) + selectedDetailDays (días del detalle actual que estamos editando)
              const maxDaysAllowed = missingDays + originalDetailDays;

              // Para mostrar información de otros pagos:
              // paymentDays - originalDetailDays = otros pagos distintos al actual
              const otherPayments = paymentDays - originalDetailDays;

              return (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    <span>Número de Días</span>
                    <span className="text-xs text-muted-foreground">
                      Máximo: {maxDaysAllowed} días
                      {otherPayments > 0 && ` (otros pagos: ${otherPayments} días)`}
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-r-none"
                        onClick={() => {
                          const newValue = Math.max(1, (field.value || 1) - 1);
                          field.onChange(newValue);
                        }}
                        disabled={(field.value || 1) <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={maxDaysAllowed}
                        className="rounded-none text-center h-9"
                        {...field}
                        value={field.value === null ? 1 : field.value}
                        onChange={(e) => {
                          // Asegurarse que no exceda el máximo permitido
                          const inputValue = Number(e.target.value);
                          const validValue = Math.min(Math.max(1, inputValue), maxDaysAllowed);
                          field.onChange(validValue);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-l-none"
                        onClick={() => {
                          const newValue = Math.min((field.value || 1) + 1, maxDaysAllowed);
                          field.onChange(newValue);
                        }}
                        disabled={(field.value || 1) >= maxDaysAllowed}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </FormControl>
                  {Number(field.value) > maxDaysAllowed && (
                    <p className="text-xs text-red-500 mt-1">No puede exceder el máximo de {maxDaysAllowed} días</p>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={detailForm.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por Noche</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Banknote className="h-4 w-4 " />
                    </div>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      className="pl-9"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 pt-3 border-t flex justify-between items-center">
          <span className="text-sm font-medium ">Subtotal:</span>
          <span className="font-bold text-lg">S/ {detailForm.watch("subtotal").toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
