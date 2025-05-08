"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMovements } from "../../_hooks/use-movements";
import { CreateInventoryMovement, inventoryMovementSchema } from "../../_schemas/createMovementsSchema";
import { MovementCreate, MovementsType } from "../../_types/movements";
import { ProductType } from "../../../products/_types/products";
import { useWarehouse } from "../../../warehouse/_hooks/use-warehouse";
import { CreateMovementsForm } from "./CreateMovementsForm";

interface CreateMovementsDialogProps {
  diferentPage?: boolean;
  type: MovementsType;
}

export function CreateMovementsDialog({ diferentPage, type }: CreateMovementsDialogProps) {
  const isInput = type === MovementsType.INPUT;

  const dataForm = {
    button: isInput ? "Crear ingreso" : "Crear salida",
    title: isInput ? "Crear Ingreso" : "Crear Salida",
    description: isInput
      ? "Complete los detalles a continuación para crear nuevos ingresos."
      : "Complete los detalles a continuación para crear nuevas salidas.",
  };
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 800px)");

  const { onCreateMovements, isSuccessCreateMovements } = useMovements();

  const form = useForm<CreateInventoryMovement>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: {
      description: "",
      documentNumber: "",
      type: undefined,
      dateMovement: "",
      movementDetail: [],
      productType: ProductType.COMMERCIAL,
      hasPaymentReceipt: false,
    },
  });

  const { warehouseByType } = useWarehouse({
    type: form.watch("productType"),
  });

  const onSubmit = async (input: CreateInventoryMovement) => {
    const { hasPaymentReceipt, ...rest } = input;

    try {
      startCreateTransition(() => {
        // Define el tipo explícitamente para dataToSend
        const dataToSend: MovementCreate = {
          description: rest.description,
          dateMovement: rest.dateMovement || "",
          type, // Este es MovementsType.INPUT o MovementsType.OUTPUT
          warehouseId: warehouseByType?.id ?? "",
          movementDetail: rest.movementDetail,
        };

        // Solo incluir estos campos si hasPaymentReceipt es true
        if (hasPaymentReceipt) {
          dataToSend.typePurchaseOrder = rest.type;
          dataToSend.documentNumber = rest.documentNumber;
        }

        onCreateMovements(dataToSend);
      });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (isSuccessCreateMovements) {
      form.reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateMovements]);

  const handleClose = () => {
    form.reset();
  };
  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {diferentPage ? (
              <UserPlus className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <Plus className="mr-2 size-4" aria-hidden="true" />
            )}
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] w-full justify-center gap-4 px-0">
            <div className="px-6">
              <CreateMovementsForm form={form} onSubmit={onSubmit} type={type} idWarehouse={warehouseByType?.id}>
                <DialogFooter>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isCreatePending} className="w-full">
                      {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      Registrar
                    </Button>
                  </div>
                </DialogFooter>
              </CreateMovementsForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {dataForm.button}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="mt-4 max-h-full w-full justify-center gap-4 px-4">
          <CreateMovementsForm form={form} onSubmit={onSubmit} type={type} idWarehouse={warehouseByType?.id}>
            <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
              <Button disabled={isCreatePending} className="w-full">
                {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                Registrar
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </CreateMovementsForm>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
