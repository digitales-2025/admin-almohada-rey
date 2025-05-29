"use client";

import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CreateInventoryMovement } from "../../_schemas/createMovementsSchema";
import { CreateMovementDetailDto, MovementsType, ProductAvailable } from "../../_types/movements";
import { useProducts } from "../../../products/_hooks/use-products";
import { ProductType } from "../../../products/_types/products";
import { useWarehouse } from "../../../warehouse/_hooks/use-warehouse";
import { StockWarehouse, WarehouseType } from "../../../warehouse/_types/warehouse";
import AvailableProductsMovements from "./AvailableProductsMovements";
import CreateHeaderMovements from "./CreateHeaderMovements";
import SelectedProductsMovements from "./SelectedProductsMovements";

interface CreateMovementsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateInventoryMovement>;
  onSubmit: (data: CreateInventoryMovement) => void;
  type: MovementsType;
  idWarehouse: string | undefined;
}

export const CreateMovementsForm = ({ children, form, onSubmit, type, idWarehouse }: CreateMovementsFormProps) => {
  const [selectedProducts, setSelectedProducts] = useState<CreateMovementDetailDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const warehouseToProductType = (warehouseType: WarehouseType | string | undefined): ProductType | undefined => {
    if (warehouseType === "DEPOSIT") return "INTERNAL_USE" as ProductType;
    if (warehouseType === "COMMERCIAL") return "COMMERCIAL" as ProductType;
    if (warehouseType === "INTERNAL_USE") return "INTERNAL_USE" as ProductType;
    return undefined;
  };

  const { productByType } = useProducts({
    type: warehouseToProductType(form.watch("productType")),
  });
  const { warehouseById } = useWarehouse({
    id: idWarehouse,
  });

  let transformedProducts: ProductAvailable[] = [];

  if (warehouseById && warehouseById.stock && warehouseById.stock.length > 0) {
    transformedProducts = warehouseById.stock.map((stockItem: StockWarehouse) => ({
      id: stockItem.product.id,
      name: stockItem.product.name,
      unitCost: stockItem.unitCost,
      quantity: stockItem.quantity,
    }));
  }

  const productsAvailible = Array.isArray(productByType)
    ? [
        // Mapeo de productos
        ...productByType.map((product) => {
          const stockItem = transformedProducts.find((item) => item.id === product.id);
          return {
            ...product,
            unitCost: stockItem && stockItem.unitCost > 0 ? stockItem.unitCost : product.unitCost,
            quantity: stockItem ? stockItem.quantity : 0,
          };
        }),
        // Agregar los productos que están solo en stock
        ...transformedProducts
          .filter((stockItem) => !productByType.some((product) => product.id === stockItem.id))
          .map((stockItem) => ({
            id: stockItem.id,
            name: stockItem.name,
            unitCost: stockItem.unitCost || 0,
            quantity: stockItem.quantity || 0,
          })),
      ]
    : [];

  useEffect(() => {
    form.setValue("movementDetail", selectedProducts);
  }, [selectedProducts, form]);

  const handleProductToggle = (productId: string, unitCost: number, stockQuantity?: number) => {
    // Si es un movimiento de salida (stockQuantity está definido) y el stock es 0, no permitir la selección
    if (stockQuantity !== undefined && stockQuantity <= 0) {
      // Mostrar una notificación al usuario
      toast.error("No se puede seleccionar un producto sin stock disponible", {
        description: "El producto seleccionado no tiene unidades disponibles para salida",
        duration: 3000,
      });
      return;
    }

    setSelectedProducts((prev) => {
      const isSelected = prev.some((r) => r.productId === productId);
      if (isSelected) {
        return prev.filter((r) => r.productId !== productId);
      } else {
        return [...prev, { productId, quantity: 1, unitCost: unitCost }];
      }
    });
  };

  const updateProductQuantity = (productId: string, newQuantity: number, stockQuantity?: number) => {
    setSelectedProducts((prev) =>
      prev.map((r) =>
        r.productId === productId
          ? {
              ...r,
              quantity: Math.max(1, stockQuantity !== undefined ? Math.min(newQuantity, stockQuantity) : newQuantity),
            }
          : r
      )
    );
  };

  const updateProductUnitCost = (productId: string, unitCost: number) => {
    setSelectedProducts((prev) => prev.map((r) => (r.productId === productId ? { ...r, unitCost } : r)));
  };

  const filteredProducts = Array.isArray(productsAvailible)
    ? productsAvailible.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-1">
        <CreateHeaderMovements form={form} type={type} />

        {/* Sección mejorada de selección de productos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Productos Disponibles - Diseño mejorado */}
          <AvailableProductsMovements
            filteredProducts={filteredProducts}
            type={type}
            handleProductToggle={handleProductToggle}
            searchTerm={searchTerm}
            selectedProducts={selectedProducts}
            setSearchTerm={setSearchTerm}
          />

          {/* Productos Seleccionados - Diseño mejorado */}
          <Card
            className={`overflow-hidden pt-0 ${type === MovementsType.INPUT ? "border-emerald-200 dark:border-emerald-800" : "border-red-200 dark:border-red-800"}`}
          >
            <div
              className={`p-4 ${
                type === MovementsType.INPUT
                  ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800"
                  : "bg-gradient-to-r from-red-50 to-red-100 dark:bg-gradient-to-r dark:from-red-950 dark:to-red-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium py-4">Productos Seleccionados</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    type === MovementsType.INPUT ? "bg-emerald-200 text-emerald-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {selectedProducts.length} {selectedProducts.length === 1 ? "producto" : "productos"}
                </span>
              </div>
            </div>

            <SelectedProductsMovements
              form={form}
              handleProductToggle={handleProductToggle}
              productsAvailible={productsAvailible}
              selectedProducts={selectedProducts}
              type={type}
              updateProductQuantity={updateProductQuantity}
              updateProductUnitCost={updateProductUnitCost}
            />
          </Card>
        </div>
        {children}
      </form>
    </Form>
  );
};
