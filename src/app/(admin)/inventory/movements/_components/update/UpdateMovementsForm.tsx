"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { CreateInventoryMovement } from "../../_schemas/createMovementsSchema";
import { CreateMovementDetailDto, MovementsType, ProductAvailable, SummaryMovements } from "../../_types/movements";
import { useProducts } from "../../../products/_hooks/use-products";
import { ProductType } from "../../../products/_types/products";
import { useWarehouse } from "../../../warehouse/_hooks/use-warehouse";
import { StockWarehouse } from "../../../warehouse/_types/warehouse";
import AvailableProductsMovements from "../create/AvailableProductsMovements";
import CreateHeaderMovements from "../create/CreateHeaderMovements";
import SelectedProductsMovements from "../create/SelectedProductsMovements";

interface UpdateMovementsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  form: UseFormReturn<CreateInventoryMovement>;
  onSubmit: (data: CreateInventoryMovement) => void;
  type: MovementsType;
  isLoadingUpdateMovements: boolean;
  selectedProducts: CreateMovementDetailDto[];
  setSelectedResources: React.Dispatch<React.SetStateAction<CreateMovementDetailDto[]>>;
  idWarehouse: string | undefined;
  movements: SummaryMovements;
}

export const UpdateMovementsForm = ({
  form,
  onSubmit,
  type,
  isLoadingUpdateMovements,
  selectedProducts,
  setSelectedResources,
  idWarehouse,
  movements,
}: UpdateMovementsFormProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { productByType } = useProducts({ type: form.watch("productType") as ProductType });

  const { warehouseById } = useWarehouse({
    id: idWarehouse,
    movementId: movements.id,
  });

  let transformedResources: ProductAvailable[] = [];

  if (warehouseById && warehouseById.stock && warehouseById.stock.length > 0) {
    transformedResources = warehouseById.stock.map((stockItem: StockWarehouse) => ({
      id: stockItem.product.id,
      name: stockItem.product.name,
      unitCost: stockItem.unitCost,
      quantity: stockItem.quantity,
    }));
  }

  const productsAvailible = Array.isArray(productByType)
    ? [
        // Mapeo de recursos presupuestados con actualización de cantidad y costo
        ...productByType.map((product) => {
          const stockItem = transformedResources.find((item) => item.id === product.id);
          return {
            ...product,
            unitCost: stockItem && stockItem.unitCost > 0 ? stockItem.unitCost : product.unitCost,
            quantity: stockItem ? stockItem.quantity : 0,
          };
        }),
        // Agregar los recursos que están solo en stock y no en el presupuesto
        ...transformedResources
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
    const currentValue = form.getValues("movementDetail");
    // Solo actualiza si los valores son diferentes
    if (JSON.stringify(currentValue) !== JSON.stringify(selectedProducts)) {
      form.setValue("movementDetail", selectedProducts, {
        shouldValidate: true,
      });
    }
  }, [selectedProducts]); // Elimina form de las dependencias

  const handleProductToggle = (productId: string, unitCost: number) => {
    setSelectedResources((prev) => {
      const isSelected = prev.some((r) => r.productId === productId);
      if (isSelected) {
        return prev.filter((r) => r.productId !== productId);
      } else {
        return [...prev, { productId, quantity: 1, unitCost: unitCost }];
      }
    });
  };

  const updateProductQuantity = (productId: string, newQuantity: number, stockQuantity?: number) => {
    setSelectedResources((prev) =>
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
    const formattedCost = Number(unitCost.toFixed(2));
    setSelectedResources((prev) =>
      prev.map((r) => (r.productId === productId ? { ...r, unitCost: formattedCost } : r))
    );
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
        <CreateHeaderMovements form={form} type={type} />

        <div className="space-y-4">
          <AvailableProductsMovements
            filteredProducts={filteredProducts}
            type={type}
            handleProductToggle={handleProductToggle}
            searchTerm={searchTerm}
            selectedProducts={selectedProducts}
            setSearchTerm={setSearchTerm}
            update={true}
          />
          <Card
            className={`overflow-hidden pt-0 ${type === MovementsType.INPUT ? "border-emerald-200 dark:border-emerald-800" : "border-red-200 dark:border-red-800"}`}
          >
            <div
              className={`p-2 ${
                type === MovementsType.INPUT
                  ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:bg-gradient-to-r dark:from-emerald-900 dark:to-emerald-800"
                  : "bg-gradient-to-r from-red-50 to-red-100 dark:bg-gradient-to-r dark:from-red-950 dark:to-red-900"
              }`}
            >
              <div className="flex flex-col items-center justify-between">
                <h3 className="text-lg font-medium py-2 text-center">Productos Seleccionados</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium h-fit ${
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
        <SheetFooter className="gap-2 pt-2 sm:space-x-0">
          <div className="flex flex-col-reverse gap-2 sm:flex-row-reverse">
            <Button type="submit" disabled={isLoadingUpdateMovements}>
              {isLoadingUpdateMovements && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Actualizar
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </form>
    </Form>
  );
};
