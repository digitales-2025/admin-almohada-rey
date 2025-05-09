import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { UseFormReturn } from "react-hook-form";

import { ProductType } from "@/app/(admin)/inventory/products/_types/products";
import { useWarehouse } from "@/app/(admin)/inventory/warehouse/_hooks/use-warehouse";
import { useRooms } from "@/app/(admin)/rooms/list/_hooks/use-rooms";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useServices } from "@/hooks/use-services";
import { cn } from "@/lib/utils";
import { PaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";
import PaymentDetailSidebar from "./PaymentDetailSidebar";
import UpdatePaymentDetailRoom from "./UpdatePaymentDetailRoom";
import UpdatePaymentDetailService from "./UpdatePaymentDetailService";

interface UpdatePaymentDetailFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  detailId: string | null;
  children: React.ReactNode;
  detailForm: UseFormReturn<PaymentDetailFormValues>;
  onSubmitDetail: (data: PaymentDetailFormValues) => void;
  getCurrentDetailTypeConfig: () => {
    icon: React.ReactNode;
    color: string;
  };
  missingDays: number;
  paymentDays: number;
  selectedDetailDays: number;
}

export default function UpdatePaymentDetailForm({
  detailId,
  children,
  detailForm,
  onSubmitDetail,
  getCurrentDetailTypeConfig,
  missingDays,
  paymentDays,
  selectedDetailDays,
}: UpdatePaymentDetailFormProps) {
  const isDesktop = useMediaQuery("(min-width: 890px)");
  const watchDetailType = detailForm.watch("detailType");
  const [searchTerm, setSearchTerm] = useState("");
  const { dataServicesAll } = useServices();
  const { productsStockByType } = useWarehouse({
    typeStockProduct: ProductType.COMMERCIAL,
    paymentDetailId: detailId ?? undefined,
  });

  // Efecto para asignar stockQuantity cuando se selecciona un productId
  useEffect(() => {
    const detailType = detailForm.watch("detailType");
    const productId = detailForm.watch("productId");

    if (detailType === "PRODUCT" && productId && productsStockByType) {
      const selectedProductStock = productsStockByType.find((stock) => stock.product.id === productId);

      if (selectedProductStock) {
        detailForm.setValue("stockQuantity", selectedProductStock.quantity);
      }
    }
  }, [detailForm.watch("productId"), detailForm.watch("detailType"), productsStockByType]);
  const { dataRoomsAll } = useRooms();

  // Filtrar productos o servicios según el término de búsqueda
  const filteredProducts = searchTerm
    ? productsStockByType?.filter((stock) => stock.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : productsStockByType;

  const filteredServices = searchTerm
    ? dataServicesAll?.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : dataServicesAll;

  return (
    <Form {...detailForm}>
      <form onSubmit={detailForm.handleSubmit(onSubmitDetail)} className="flex flex-col h-full">
        <div
          className={cn(
            "px-6 py-4 border-b flex items-center justify-between",
            `bg-gradient-to-r from-${getCurrentDetailTypeConfig().color}/10 to-${getCurrentDetailTypeConfig().color}/5`
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-white",
                getCurrentDetailTypeConfig().color
              )}
            >
              {getCurrentDetailTypeConfig().icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Editar Detalle de Pago</h3>
            </div>
          </div>
        </div>

        {!isDesktop && (
          <div className="p-4 border-b bg-muted/10">
            <PaymentDetailSidebar detailForm={detailForm} isDesktop={isDesktop} watchDetailType={watchDetailType} />
          </div>
        )}

        <div className="flex-1 overflow-hidden flex">
          {/* Sidebar con opciones de tipo - solo visible en desktop */}
          {isDesktop && (
            <div className="w-[180px] border-r bg-muted/20 p-4 flex flex-col">
              <PaymentDetailSidebar detailForm={detailForm} isDesktop={isDesktop} watchDetailType={watchDetailType} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={detailForm.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                  control={detailForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Input placeholder="Descripción del pago" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {watchDetailType === "ROOM" ? (
                <UpdatePaymentDetailRoom
                  detailForm={detailForm}
                  dataRoomsAll={dataRoomsAll}
                  missingDays={missingDays}
                  paymentDays={paymentDays}
                  selectedDetailDays={selectedDetailDays}
                />
              ) : (
                <UpdatePaymentDetailService
                  detailForm={detailForm}
                  watchDetailType={watchDetailType}
                  filteredProducts={filteredProducts}
                  filteredServices={filteredServices}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              )}
            </div>
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}
