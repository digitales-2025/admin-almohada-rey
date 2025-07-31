"use client";

import { RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { PaymentDetail } from "@/app/(admin)/payments/_types/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GroupPaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";
import UpdateGroupPaymentDetailForm from "./UpdateGroupPaymentDetailForm";

const dataForm = {
  title: "Editar Grupo de Pagos",
  description: "Actualiza la información del grupo de pagos seleccionado",
};

interface UpdateGroupPaymentDetailDialogProps {
  isGroupDialogOpen: boolean;
  setIsGroupDialogOpen: (value: boolean) => void;
  groupForm: UseFormReturn<GroupPaymentDetailFormValues>;
  onSubmitGroup: (data: GroupPaymentDetailFormValues) => void;
  selectedDetails: Array<PaymentDetail>;
  isLoadingUpdatePaymentDetailsBatch: boolean;
}

export function UpdateGroupPaymentDetailDialog({
  isGroupDialogOpen,
  setIsGroupDialogOpen,
  groupForm,
  selectedDetails,
  onSubmitGroup,
  isLoadingUpdatePaymentDetailsBatch,
}: UpdateGroupPaymentDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 650px)");

  const handleClose = () => {
    groupForm.reset();
  };

  if (isDesktop)
    return (
      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent tabIndex={undefined} className="px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              <UpdateGroupPaymentDetailForm
                groupForm={groupForm}
                selectedDetails={selectedDetails}
                onSubmitGroup={onSubmitGroup}
              >
                <DialogFooter>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isLoadingUpdatePaymentDetailsBatch} className="w-full">
                      {isLoadingUpdatePaymentDetailsBatch && (
                        <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                      )}
                      Guardar Cambios
                    </Button>
                  </div>
                </DialogFooter>
              </UpdateGroupPaymentDetailForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
        </DrawerHeader>

        {/* The key fix is in this ScrollArea configuration */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] px-0">
            <div className="px-4">
              <UpdateGroupPaymentDetailForm
                groupForm={groupForm}
                selectedDetails={selectedDetails}
                onSubmitGroup={onSubmitGroup}
              >
                <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
                  <Button disabled={isLoadingUpdatePaymentDetailsBatch} className="w-full">
                    {isLoadingUpdatePaymentDetailsBatch && (
                      <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                    )}
                    Guardar Cambios
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </UpdateGroupPaymentDetailForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
