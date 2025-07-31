"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMovements } from "../../_hooks/use-movements";
import { CreateInventoryMovement, inventoryMovementSchema } from "../../_schemas/createMovementsSchema";
import { CreateMovementDetailDto, MovementsType, SummaryMovements } from "../../_types/movements";
import { useWarehouse } from "../../../warehouse/_hooks/use-warehouse";
import { WarehouseType } from "../../../warehouse/_types/warehouse";
import { UpdateMovementsForm } from "./UpdateMovementsForm";

const infoSheet = {
  title: "Actualizar Movimiento",
  description: "Modifique los detalles del movimiento de inventario y guarde los cambios.",
};

interface UpdateMovementsSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  movements: SummaryMovements;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: MovementsType;
}

export function UpdateMovementsSheet({ movements, open, onOpenChange, type }: UpdateMovementsSheetProps) {
  const { onUpdateMovements, isSuccessUpdateMovements, isLoadingUpdateMovements } = useMovements();
  const { movementsById } = useMovements({ id: movements.id });
  const [selectedProducts, setSelectedProducts] = useState<CreateMovementDetailDto[]>([]);

  useEffect(() => {
    if (movementsById && movementsById.movementsDetail) {
      setSelectedProducts(
        movementsById.movementsDetail.map((detail) => ({
          productId: detail.product?.id ?? "",
          quantity: detail.quantity,
          unitCost: detail.unitCost,
        }))
      );
    }
  }, [movementsById]);

  const form = useForm<CreateInventoryMovement>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      description: movements.description ?? "",
      dateMovement: movements.dateMovement ?? "",
      hasPaymentReceipt: (movements.typePurchaseOrder ? true : false) as true | false,
      movementDetail: movementsById?.movementsDetail ?? [],
      productType: movements.typeProduct as WarehouseType,
      ...(movements.type === MovementsType.INPUT && {
        type: movements.typePurchaseOrder ?? undefined,
        documentNumber: movements.documentNumber ?? "",
      }),
    },
  });

  useEffect(() => {
    if (open) {
      // Determinar si tiene comprobante de pago
      const hasPaymentValue = !!movements.typePurchaseOrder;

      // Crear el objeto de formulario según el caso
      if (hasPaymentValue) {
        // Caso cuando hasPaymentReceipt es true
        form.reset({
          description: movements.description ?? "",
          dateMovement: movements.dateMovement ?? "",
          hasPaymentReceipt: true,
          type: movements.typePurchaseOrder!,
          productType: movements.typeProduct as WarehouseType,
          documentNumber: movements.documentNumber ?? "",
          movementDetail: movementsById?.movementsDetail ?? [],
        });
      } else {
        // Caso cuando hasPaymentReceipt es false
        form.reset({
          description: movements.description ?? "",
          dateMovement: movements.dateMovement ?? "",
          hasPaymentReceipt: false,
          productType: movements.typeProduct as WarehouseType,
          movementDetail: movementsById?.movementsDetail ?? [],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, movements, movementsById]);

  const { warehouseByType } = useWarehouse({
    type: form.watch("productType"),
  });

  const onSubmit = async (input: CreateInventoryMovement) => {
    const { hasPaymentReceipt, ...rest } = input;
    await onUpdateMovements({
      ...rest,
      id: movements.id,
      warehouseId: warehouseByType?.id,
      typePurchaseOrder: hasPaymentReceipt ? rest.type : undefined,
      documentNumber: hasPaymentReceipt ? rest.documentNumber : undefined,
      type,
      hasPaymentReceipt: hasPaymentReceipt,
    });
  };

  useEffect(() => {
    if (isSuccessUpdateMovements) {
      setSelectedProducts([]); // Limpia los recursos
      form.reset(); // Resetea el formulario
      onOpenChange(false); // Cierra el modal
    }
  }, [isSuccessUpdateMovements]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge
              className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200 hover:bg-emerald-200"
              variant="secondary"
            >
              {movements.codeUnique}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateMovementsForm
            form={form}
            onSubmit={onSubmit}
            type={type}
            isLoadingUpdateMovements={isLoadingUpdateMovements}
            selectedProducts={selectedProducts}
            setSelectedResources={setSelectedProducts}
            idWarehouse={warehouseByType?.id}
            movements={movements}
          />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
