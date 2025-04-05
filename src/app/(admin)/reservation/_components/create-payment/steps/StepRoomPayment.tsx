import { format, parse } from "date-fns";
import { Banknote, Coffee, Hash, Hotel, Moon, ShoppingCart, Trash2, Utensils } from "lucide-react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { CreatePaymentSchema, ExtraServiceItem } from "@/app/(admin)/payment/_schema/createPaymentsSchema";
import { getRoomTypeKey, RoomTypeLabels } from "@/app/(admin)/rooms/list/_utils/rooms.utils";
import { InputWithIcon } from "@/components/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/types/services";
import { DetailedReservation } from "../../../_schemas/reservation.schemas";

interface StepRoomPaymentProps {
  form: UseFormReturn<CreatePaymentSchema>;
  reservation: DetailedReservation;
  dataServicesAll: Service[] | undefined;
  nights: number;
  watchExtraServices: ExtraServiceItem[];
  fields: ReturnType<typeof useFieldArray<CreatePaymentSchema, "extraServices">>["fields"];
  updateExtraServiceSubtotal: (index: number) => void;
  addExtraService: (serviceTemplate: Service) => void;
  remove: (index: number) => void;
}
export default function StepRoomPayment({
  form,
  reservation,
  dataServicesAll,
  nights,
  watchExtraServices,
  fields,
  updateExtraServiceSubtotal,
  addExtraService,
  remove,
}: StepRoomPaymentProps) {
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

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel className="text-sm font-medium mb-1.5">Observaciones</FormLabel>
              <FormControl>
                <Textarea placeholder="Ingrese observaciones del pago" {...field} />
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
                const roomTypeName = reservation.room.RoomTypes.name;
                const typeKey = getRoomTypeKey(roomTypeName);
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
                            {config.label} Habitación #{reservation.room.number}
                          </span>
                          <span className="text-xs text-muted-foreground"></span>
                        </div>
                        <Input type="hidden" {...field} value={reservation.room.id} />
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
                      type={"number"}
                      {...field}
                      value={field.value}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {...field}
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
                    <InputWithIcon Icon={Banknote} type={"number"} readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Extra Services Section */}
      <Card className="border-2 pt-0">
        <CardHeader className="bg-primary/5 pb-3 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Servicios extra</CardTitle>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Opcional
            </Badge>
          </div>
          <CardDescription>Agregar servicios adicionales a este pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex flex-wrap gap-2">
              {dataServicesAll?.map((service) => (
                <Button
                  key={service.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5"
                  onClick={() => addExtraService(service)}
                >
                  <Utensils className="h-4 w-4" />
                  {service.name}
                  <span className="text-xs font-normal text-muted-foreground ml-1">({service.price} soles)</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Extra services list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">Servicios agregados</div>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/30">
                <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aún no se han añadido servicios extras</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Haz clic en "Añadir rápido" o "Servicio personalizado" para agregar
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="border-2 rounded-lg overflow-hidden ">
                    <div className="bg-muted/20 px-4 py-2 border-b flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name={`extraServices.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1 mb-0">
                            <FormControl>
                              <div className="h-9 text-sm font-medium p-2 flex items-center" {...field}>
                                {field.value || "Nombre del servicio"}
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-4 grid grid-cols-3 gap-5">
                      <FormField
                        control={form.control}
                        name={`extraServices.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Cantidad</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                Icon={Hash}
                                min={1}
                                placeholder="Ingrese la cantidad"
                                type={"number"}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value) || 0);
                                  setTimeout(() => updateExtraServiceSubtotal(index), 0);
                                }}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`extraServices.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Precio</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                Icon={Banknote}
                                placeholder="Ingrese el precio del servicio"
                                type={"number"}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(Number(e.target.value) || 0);
                                  updateExtraServiceSubtotal(index);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`extraServices.${index}.subtotal`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Subtotal</FormLabel>
                            <FormControl>
                              <InputWithIcon
                                Icon={Banknote}
                                placeholder="Ingrese el subtotal del servicio"
                                type={"number"}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        {fields.length > 0 && (
          <CardFooter className="bg-muted/20 border-t flex justify-between py-3">
            <div className="text-sm font-medium">Total Extra Servicios:</div>
            <div className="font-bold text-primary">
              S/. {watchExtraServices.reduce((sum, service) => sum + service.subtotal, 0).toFixed(2)}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Total Amount */}
      <div className="bg-primary/5 border-2 rounded-lg p-4 flex justify-between items-center">
        <div className="text-base font-semibold">Monto Total:</div>
        <div className="text-xl font-bold text-primary">S/. {form.getValues("totalAmount").toFixed(2)}</div>
      </div>
    </div>
  );
}
