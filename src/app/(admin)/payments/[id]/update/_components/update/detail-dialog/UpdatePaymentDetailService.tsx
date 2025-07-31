import { useRef, useState } from "react";
import { Banknote, Minus, Package, Plus, Search, Utensils } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { StockWarehouse } from "@/app/(admin)/inventory/warehouse/_types/warehouse";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Service } from "@/types/services";
import { PaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";
import { getPaymentDetailTypesConfigs } from "../../../_utils/updatePaymentDetail.utils";

interface UpdatePaymentDetailServiceProps {
  detailForm: UseFormReturn<PaymentDetailFormValues>;
  watchDetailType: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredServices: Service[] | undefined;
  filteredProducts: StockWarehouse[] | undefined;
}

export default function UpdatePaymentDetailService({
  detailForm,
  watchDetailType,
  searchTerm,
  setSearchTerm,
  filteredServices,
  filteredProducts,
}: UpdatePaymentDetailServiceProps) {
  // Referencia para controlar cuando se puede mostrar un toast
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [canShowToast, setCanShowToast] = useState(true);

  // Función para validar la cantidad respetando el stock disponible
  const validateQuantity = (value: number) => {
    const stockQuantity = detailForm.watch("stockQuantity");

    if (watchDetailType === "PRODUCT" && stockQuantity !== undefined && value > stockQuantity) {
      // Solo mostrar el toast si está permitido
      if (canShowToast) {
        toast.warning(`No puede exceder el stock disponible (${stockQuantity} unidades)`);

        // Desactivar la posibilidad de mostrar más toasts
        setCanShowToast(false);

        // Reactivar después de un tiempo
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
          setCanShowToast(true);
        }, 2000); // Esperar 2 segundos antes de permitir otro toast
      }

      return Math.min(value, stockQuantity);
    }

    return value;
  };

  return (
    <div className="space-y-6">
      {/* Service or Product selection section */}
      <div className={cn("border rounded-lg overflow-hidden")}>
        <div className={cn("p-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3")}>
          <div className="flex items-center gap-2">
            {watchDetailType === "SERVICE" ? (
              <Utensils
                className={cn(
                  "h-4 w-4",
                  getPaymentDetailTypesConfigs().find((type) => type.value === "SERVICE")?.textColor
                )}
              />
            ) : (
              <Package
                className={cn(
                  "h-4 w-4",
                  getPaymentDetailTypesConfigs().find((type) => type.value === "PRODUCT")?.textColor
                )}
              />
            )}
            <h4
              className={cn(
                "font-medium",
                getPaymentDetailTypesConfigs().find((type) => type.value === watchDetailType)?.textColor
              )}
            >
              {watchDetailType === "SERVICE" ? "Seleccionar Servicio" : "Seleccionar Producto"}
            </h4>
          </div>
          <div className="relative w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={watchDetailType === "SERVICE" ? "Buscar servicios..." : "Buscar productos..."}
              className="pl-8 h-8 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 max-h-[250px] overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {watchDetailType === "SERVICE"
              ? filteredServices?.map((service) => {
                  const serviceConfig = getPaymentDetailTypesConfigs().find((type) => type.value === "SERVICE");
                  return (
                    <div
                      key={service.id}
                      className={cn(
                        "flex items-center justify-between p-2 border rounded-md cursor-pointer transition-all",
                        detailForm.watch("serviceId") === service.id
                          ? cn(
                              serviceConfig?.bgColor || "bg-cyan-50",
                              "border-2",
                              serviceConfig?.borderColor || "border-cyan-300"
                            )
                          : "hover:bg-muted/50 hover:border-cyan-200"
                      )}
                      onClick={() => {
                        detailForm.setValue("serviceId", service.id);
                        detailForm.setValue("unitPrice", service.price);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-md flex items-center justify-center text-white",
                            serviceConfig?.color
                          )}
                        >
                          <Utensils className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium dark:text-slate-800">{service.name}</div>
                          <div className="text-xs text-muted-foreground">{service.code}</div>
                        </div>
                      </div>

                      <div className="font-medium text-sm">S/ {service.price}</div>
                    </div>
                  );
                })
              : filteredProducts?.map((stock) => {
                  const productConfig = getPaymentDetailTypesConfigs().find((type) => type.value === "PRODUCT");
                  return (
                    <div
                      key={stock.product.id}
                      className={cn(
                        "flex items-center justify-between p-2 border rounded-md cursor-pointer transition-all",
                        detailForm.watch("productId") === stock.product.id
                          ? cn(
                              productConfig?.bgColor || "bg-pink-50",
                              "border-2",
                              productConfig?.borderColor || "border-pink-300",
                              "shadow-md"
                            )
                          : "hover:bg-muted/50 hover:border-pink-200"
                      )}
                      onClick={() => {
                        detailForm.setValue("productId", stock.product.id);
                        detailForm.setValue("unitPrice", stock.product.unitCost ?? 0);
                        detailForm.setValue("stockQuantity", stock.quantity);
                        detailForm.setValue("quantity", 1);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-md flex items-center justify-center text-white",
                            productConfig?.color
                          )}
                        >
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{stock.product.name}</div>
                          <div className="text-xs text-muted-foreground">{stock.product.code}</div>
                        </div>
                      </div>
                      <div className="font-medium text-sm">S/ {stock.product.unitCost}</div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={detailForm.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
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
                    max={detailForm.watch("stockQuantity")}
                    className="rounded-none text-center h-9"
                    {...field}
                    value={field.value === null ? 1 : field.value}
                    onChange={(e) => {
                      const inputValue = Number(e.target.value);
                      if (inputValue < 1) {
                        field.onChange(1);
                        return;
                      }

                      const validatedValue = validateQuantity(inputValue);
                      field.onChange(validatedValue);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-l-none"
                    onClick={() => {
                      const currentValue = field.value || 1;
                      const newValue = currentValue + 1;
                      const validatedValue = validateQuantity(newValue);

                      // Solo mostrar el toast si realmente se limitó el valor
                      if (watchDetailType === "PRODUCT" && validatedValue !== newValue) {
                        toast.warning(
                          `No puede exceder el stock disponible (${detailForm.watch("stockQuantity")} unidades)`
                        );
                      }

                      field.onChange(validatedValue);
                    }}
                    disabled={
                      watchDetailType === "PRODUCT" &&
                      detailForm.watch("stockQuantity") !== undefined &&
                      (field.value || 1) >= (detailForm.watch("stockQuantity") ?? 0)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={detailForm.control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio Unitario</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Banknote className="h-4 w-4 text-muted-foreground" />
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

      <div className={cn("border rounded-lg p-3 flex justify-between items-center")}>
        <span className={cn("text-sm font-medium")}>
          {watchDetailType === "SERVICE" ? "Subtotal Servicio:" : "Subtotal Producto:"}
        </span>
        <span className={cn("font-bold text-lg")}>S/ {detailForm.watch("subtotal").toFixed(2)}</span>
      </div>
    </div>
  );
}
