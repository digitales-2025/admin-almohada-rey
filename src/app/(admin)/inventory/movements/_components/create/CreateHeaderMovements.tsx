import { format, parse } from "date-fns";
import { Package } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { ExpenseDocumentTypeLabels } from "@/app/(admin)/expenses/_utils/expenses.utils";
import { InputWithIcon } from "@/components/input-with-icon";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreateInventoryMovement } from "../../_schemas/createMovementsSchema";
import { MovementsType } from "../../_types/movements";
import { WarehouseType } from "../../../warehouse/_types/warehouse";
import { WarehouseTypeLabels } from "../../../warehouse/_utils/warehouses.utils";

interface CreateHeaderMovementsProps {
  form: UseFormReturn<CreateInventoryMovement>;
  type: MovementsType;
}

export default function CreateHeaderMovements({ form, type }: CreateHeaderMovementsProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">Descripción del Movimiento</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Package} id="description" placeholder="Ej: Compra de productos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateMovement"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="dateMovement">Fecha del Movimiento</FormLabel>
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
          {type === MovementsType.INPUT && (
            <FormField
              control={form.control}
              name="hasPaymentReceipt"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-input p-4">
                  <div className="space-y-0.5">
                    <FormLabel htmlFor="hasPaymentReceipt">Comprobante de Pago</FormLabel>
                    <FormDescription>
                      {field.value ? "Movimiento con comprobante" : "Movimiento sin comprobante"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="hasPaymentReceipt"
                      aria-label="Alternar comprobante de pago"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {form.watch("hasPaymentReceipt") && (
            <>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un tipo de documento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ExpenseDocumentTypeLabels).map(([value, { label, icon: Icon, className }]) => (
                          <SelectItem key={value} value={value} className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Icon size={14} className={`flex-shrink-0 ${className}`} />
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="documentNumber">Número de documento</FormLabel>
                    <FormControl>
                      <Input
                        id="documentNumber"
                        placeholder="Ingrese el número de documento"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="type">Tipo de Almacén</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el tipo de producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(WarehouseType).map((warehouseType) => {
                        const warehouseTypeConfig = WarehouseTypeLabels[warehouseType];
                        const Icon = warehouseTypeConfig.icon;

                        return (
                          <SelectItem key={warehouseType} value={warehouseType} className="flex items-center gap-2">
                            <Icon className={`size-4 ${warehouseTypeConfig.className}`} />
                            <span>{warehouseTypeConfig.label}</span>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
