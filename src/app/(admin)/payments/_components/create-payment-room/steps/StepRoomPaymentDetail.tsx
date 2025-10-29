import { format, parse } from "date-fns";
import { Banknote, Hotel, Moon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { CreateRoomPaymentDetailSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { InputWithIcon } from "@/components/input-with-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RoomPaymentDetails } from "../../../_types/payment";

interface StepRoomPaymentDetailProps {
  form: UseFormReturn<CreateRoomPaymentDetailSchema>;
  roomPaymentDetailsByPaymentId: RoomPaymentDetails | undefined;
  nights: number;
}

export default function StepRoomPaymentDetail({
  form,
  roomPaymentDetailsByPaymentId,
  nights,
}: StepRoomPaymentDetailProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-sm font-medium mb-1.5">Fecha de Pago</FormLabel>

              <FormControl>
                <DatePicker
                  value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      field.onChange(formattedDate);
                    } else {
                      field.onChange("");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium mb-1.5">Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese descripción del pago" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Room Details Section */}
      <Card className="border-2 pt-0">
        <CardHeader className="bg-primary/5 pb-3 pt-5">
          <div className="flex items-center space-x-2">
            <Hotel className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Detalles de la Habitación</CardTitle>
          </div>
          <CardDescription>Detalles de la reserva y precios de la habitación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => {
                // Obtener el tipo de habitación y configurar el icono/color correspondiente
                const roomTypeName = roomPaymentDetailsByPaymentId?.reservation?.room?.RoomTypes.name;
                const typeKey = getRoomTypeKey(roomTypeName ?? "");
                const config = RoomTypeLabels[typeKey];
                const Icon = config.icon;

                return (
                  <FormItem>
                    <FormLabel className="text-sm font-medium mb-1.5">Habitación</FormLabel>
                    <FormControl>
                      <div className="border rounded-lg p-2 flex items-center gap-2 bg-muted/20">
                        <Icon className={`size-4 ${config.className}`} strokeWidth={1.5} />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium capitalize">
                            {config.label} Habitación #{roomPaymentDetailsByPaymentId?.reservation?.room?.number}
                          </span>
                          <span className="text-xs text-muted-foreground"></span>
                        </div>
                        <Input
                          type="hidden"
                          {...field}
                          value={roomPaymentDetailsByPaymentId?.reservation?.room?.id || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1.5">Número de Noches</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={Moon}
                      min={1}
                      max={nights}
                      placeholder="Ingrese número de noches"
                      type="number"
                      {...field}
                      value={field.value?.toString() || "0"}
                      onChange={(e) => {
                        // Obtener el valor ingresado
                        let value = Number(e.target.value);

                        // Si el valor supera el máximo de noches, establecerlo al máximo
                        if (value > nights) {
                          value = nights;
                        }

                        // Actualizar el campo
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1.5">Precio por Noche</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={Banknote}
                      placeholder="Ingrese el precio por noche"
                      type={"number"}
                      readOnly
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1.5">Descuento (S/.)</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={Banknote}
                      placeholder="Ingrese descuento"
                      type={"number"}
                      min={0}
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium mb-1.5">Subtotal Habitación</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={Banknote}
                      type="number"
                      readOnly
                      {...field}
                      value={field.value?.toString() || "0"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Total Amount */}
      <div className="bg-primary/5 border-2 rounded-lg p-4 flex justify-between items-center">
        <div className="text-base font-semibold">Monto Total:</div>
        <div className="text-xl font-bold text-primary"> S/. {(form.watch("totalAmount") || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
