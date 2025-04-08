import { format, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  getMethodColor,
  getMethodIcon,
  getPaymentMethodLabel,
} from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CreateExtraServiceItem, CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import { CategoryPayment, PaymentDetailMethod } from "../../_types/payment";

interface PaymentDetailInformationProps {
  children: React.ReactNode;
  form: UseFormReturn<CreatePaymentDetailSchema>;
  getCategoryById: (categoryId: string) => CategoryPayment;
  fields: CreateExtraServiceItem[];
}

export default function PaymentDetailInformation({
  children,
  form,
  getCategoryById,
  fields,
}: PaymentDetailInformationProps) {
  const watchMethod = form.watch("method");
  const watchPaymentDate = form.watch("paymentDate");
  const watchDescription = form.watch("description");
  return (
    <div>
      <TabsContent value="payment" className="flex-1 flex flex-col p-0 m-0 border-none">
        <div className="grid grid-cols-[1fr_300px] h-full">
          {/* Main payment form */}
          <div className="p-6 border-r">
            <h3 className="text-lg font-bold mb-6">Información del Pago</h3>

            <div className="space-y-6">
              {/* Payment Date */}
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Pago</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese descripción del pago" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Payment Method */}
              <div>
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pago</FormLabel>
                      <div className="grid grid-cols-4 gap-3 mt-2">
                        {Object.values(PaymentDetailMethod).map((method) => (
                          <div
                            key={method}
                            className={cn(
                              "relative overflow-hidden rounded-md border-2 cursor-pointer transition-all hover:shadow-md p-3",
                              field.value === method
                                ? "border-primary shadow-sm"
                                : "border-muted hover:border-primary/50"
                            )}
                            onClick={() => field.onChange(method)}
                          >
                            {field.value === method && (
                              <div className="absolute top-2 right-2">
                                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="h-2.5 w-2.5 text-white" />
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col items-center">
                              <div
                                className={cn(
                                  "h-10 w-10 rounded-md flex items-center justify-center mb-2 text-white bg-gradient-to-br",
                                  getMethodColor(method as PaymentDetailMethod)
                                )}
                              >
                                {getMethodIcon(method as PaymentDetailMethod)}
                              </div>
                              <div className="text-sm font-normal text-center">{getPaymentMethodLabel(method)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Services Table */}
              <div>
                <h4 className="font-medium mb-3">Servicios seleccionados</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-normal">Servicio</th>
                        <th className="text-center p-3 text-sm font-normal">Cantidad</th>
                        <th className="text-right p-3 text-sm font-normal">Precio</th>
                        <th className="text-right p-3 text-sm font-normal">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-6 text-muted-foreground text-sm">
                            No hay servicios agregados aún
                          </td>
                        </tr>
                      ) : (
                        fields.map((service, index) => {
                          const category = getCategoryById(service.category);
                          return (
                            <tr key={service.id + index} className="border-t">
                              <td className="p-3">
                                <div className="flex items-center">
                                  <div
                                    className="h-8 w-8 rounded-md flex items-center justify-center text-white mr-3"
                                    style={{ backgroundColor: category.color }}
                                  >
                                    {category.icon}
                                  </div>
                                  <div>
                                    <div className="text-sm font-normal">{service.name}</div>
                                    <div className="text-xs text-muted-foreground">{category.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center text-sm font-normal">{service.quantity}</td>
                              <td className="p-3 text-right text-sm font-normal">S/. {service.unitPrice.toFixed(2)}</td>
                              <td className="p-3 text-right text-sm font-normal">S/. {service.subtotal.toFixed(2)}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                    <tfoot className="bg-muted/30">
                      <tr className="border-t">
                        <td colSpan={3} className="p-3 text-right text-sm font-medium">
                          Total
                        </td>
                        <td className="p-3 text-right text-sm font-bold">
                          S/. {form.getValues("totalAmount").toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Summary */}
          <div className="p-6 bg-muted/10 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Resumen</h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Fecha</div>
                <div className="font-medium text-sm">
                  {watchPaymentDate ? (
                    format(parseISO(watchPaymentDate), "d 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span className="italic text-muted-foreground">No seleccionada</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Descripción</div>
                <div className="font-medium text-sm">
                  {watchDescription || <span className="italic text-muted-foreground">Sin descripción</span>}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Método de Pago</div>
                <div className="text-sm flex items-center gap-1">
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full bg-gradient-to-r text-white flex items-center gap-1",
                      getMethodColor(watchMethod as PaymentDetailMethod)
                    )}
                  >
                    {getMethodIcon(watchMethod as PaymentDetailMethod)}
                    <span className="font-medium text-sm">{getPaymentMethodLabel(watchMethod)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Items</div>
                <div className="font-medium text-sm">{fields.length}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Monto Total</div>
                <div className="text-sm font-bold">S/. {form.getValues("totalAmount").toFixed(2)}</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start space-x-3 mb-6">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Verifique todos los detalles antes de enviar</p>
                <p className="text-xs text-amber-700 mt-1">Esto creará un nuevo registro de pago en el sistema.</p>
              </div>
            </div>

            {children}
          </div>
        </div>
      </TabsContent>
    </div>
  );
}
