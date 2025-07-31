"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Receipt, RefreshCcw, ShoppingBag, Utensils, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { ProductType } from "@/app/(admin)/inventory/products/_types/products";
import { useWarehouse } from "@/app/(admin)/inventory/warehouse/_hooks/use-warehouse";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useServices } from "@/hooks/use-services";
import { usePayments } from "../../_hooks/use-payments";
import { paymentDetailSchema, type CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import {
  PaymentDetailMethod,
  PaymentDetailType,
  type CategoryPayment,
  type SummaryPayment,
} from "../../_types/payment";
import CreatePaymentDetailForm from "./CreatePaymentDetailForm";

interface CreatePaymentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: SummaryPayment;
}

export function CreatePaymentDetailDialog({ open, onOpenChange, payment }: CreatePaymentDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 950px)");
  const [searchTerm, setSearchTerm] = useState("");
  const { dataServicesAll } = useServices();
  const { productsStockByType } = useWarehouse({ typeStockProduct: ProductType.COMMERCIAL });
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreatePaymentDetails, isSuccessCreatePaymentDetails } = usePayments();

  const categories: CategoryPayment[] = [
    {
      id: "services",
      name: "Servicios",
      icon: <Utensils className="h-5 w-5" />,
      color: "#0891b2", // Color cyan-600 en hexadecimal
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
      color: "#db2777", // Color pink-600 en hexadecimal
      items:
        productsStockByType
          ?.filter((stock) => stock.quantity > 0)
          .map((stock) => ({
            id: stock.product.id,
            name: stock.product.name,
            price: stock.product.unitCost ?? 0,
            code: stock.product.code ?? "",
            quantity: stock.quantity,
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

  // Contenido común para ambos componentes (Dialog y Drawer)
  const renderContent = () => (
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
        {activeTab !== "services" && (
          <Button type="button" variant="outline" className="w-full" onClick={() => setActiveTab("services")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>
        )}
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
  );

  // Contenido del encabezado común para ambos componentes
  const headerContent = (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
        <Receipt className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-xl font-bold">Agregar Pago</div>
        <div className="text-xs text-muted-foreground mt-1">Crear un nuevo pago para servicios adicionales</div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 rounded-xl sm:max-w-[950px] flex flex-col">
          <DialogHeader className="px-6 pt-6 flex-shrink-0">
            <DialogTitle className="sr-only">Agregar Pago</DialogTitle>
            <div className="flex items-center justify-between">{headerContent}</div>
          </DialogHeader>

          <div className="px-0 h-full">{renderContent()}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="px-4 pb-2 flex-shrink-0">
          <DrawerTitle className="sr-only">Agregar Pago</DrawerTitle>
          <div className="text-left">{headerContent}</div>
        </DrawerHeader>

        <div className="px-0">{renderContent()}</div>
      </DrawerContent>
    </Drawer>
  );
}
