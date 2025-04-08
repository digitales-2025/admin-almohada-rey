"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Receipt, RefreshCcw, ShoppingBag, Utensils, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { useProducts } from "@/app/(admin)/inventory/products/_hooks/use-products";
import { ProductType } from "@/app/(admin)/inventory/products/_types/products";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServices } from "@/hooks/use-services";
import { usePayments } from "../../_hooks/use-payments";
import { CreatePaymentDetailSchema, paymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import { CategoryPayment, PaymentDetailMethod, PaymentDetailType, SummaryPayment } from "../../_types/payment";
import CreatePaymentDetailForm from "./CreatePaymentDetailForm";

interface CreatePaymentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: SummaryPayment;
}

export function CreatePaymentDetailDialog({ open, onOpenChange, payment }: CreatePaymentDetailDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { dataServicesAll } = useServices();
  const { productByType } = useProducts({ type: ProductType.COMMERCIAL });
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreatePaymentDetails, isSuccessCreatePaymentDetails } = usePayments();

  const categories: CategoryPayment[] = [
    {
      id: "services",
      name: "Servicios",
      icon: <Utensils className="h-5 w-5" />,
      color: "#6366f1",
      items:
        dataServicesAll?.map((service) => ({
          id: service.id,
          name: service.name,
          price: service.price,
          code: service.code,
          description: service.description,
        })) || [],
    },
    {
      id: "products",
      name: "Productos Comerciales",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "#f59e0b",
      items:
        productByType?.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.unitCost,
          code: product.code,
        })) || [],
    },
  ];

  const [filteredItems, setFilteredItems] = useState<CategoryPayment[]>([]);
  const [activeTab, setActiveTab] = useState("services");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const form = useForm({
    resolver: zodResolver(paymentDetailSchema),
    defaultValues: {
      paymentDate: "",
      description: "Pagos adicionales",
      type: PaymentDetailType.EXTRA_SERVICE,
      method: PaymentDetailMethod.CREDIT_CARD,
      extraServices: [],
      totalAmount: 0,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "extraServices",
  });

  // Watch values for calculations
  const watchExtraServices = form.watch("extraServices");

  // Calculate total amount
  const calculateTotalAmount = () => {
    const total = watchExtraServices.reduce((sum, service) => sum + service.subtotal, 0);
    form.setValue("totalAmount", total);
  };

  // Update calculations when values change
  useEffect(() => {
    calculateTotalAmount();
  }, [watchExtraServices]);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems([]);
      return;
    }
    const results: CategoryPayment[] = [];
    categories.forEach((category) => {
      const matchingItems = category.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.code.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchingItems.length > 0) {
        results.push({
          ...category,
          items: matchingItems,
        });
      }
    });

    setFilteredItems(results);
  }, [searchTerm]);

  const onSubmit = async (input: CreatePaymentDetailSchema) => {
    // Transformar los servicios adicionales al formato esperado por la API
    const paymentDetail = input.extraServices.map((service) => {
      // Determinar si es un producto o un servicio basado en la categoría
      const isProduct = service.category === "products";

      return {
        paymentDate: input.paymentDate,
        description: input.description,
        type: PaymentDetailType.EXTRA_SERVICE,
        method: input.method,
        // Asignar productId o serviceId según corresponda
        ...(isProduct ? { productId: service.id } : { serviceId: service.id }),
        quantity: service.quantity,
        unitPrice: service.unitPrice,
        subtotal: service.subtotal,
      };
    });

    console.log("paymentDetail", JSON.stringify(paymentDetail, null, 2));

    startCreateTransition(() => {
      onCreatePaymentDetails({
        paymentId: payment.id,
        paymentDetail,
      });
    });
  };

  useEffect(() => {
    if (isSuccessCreatePaymentDetails) {
      form.reset();
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreatePaymentDetails]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 rounded-xl sm:max-w-[900px]">
        <div className="flex flex-col">
          {/* Header with tabs */}
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">Agregar Pago</DialogTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    Crear un nuevo pago para servicios adicionales
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[85vh]">
            <CreatePaymentDetailForm
              form={form}
              onSubmit={onSubmit}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              filteredItems={filteredItems}
              fields={fields}
              append={append}
              remove={remove}
              update={update}
            >
              <div className="mt-auto space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => setActiveTab("services")}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Regresar
                </Button>
                <Button type="submit" disabled={isCreatePending || fields.length === 0} className="w-full">
                  {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                  Agregar Pago
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CreatePaymentDetailForm>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
