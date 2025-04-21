import { RefreshCcw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
import { PaymentDetailFormValues } from "../../_schemas/updatePaymentDetailSchema";
import UpdatePaymentDetailForm from "./UpdatePaymentDetailForm";

interface UpdatePaymentDetailDialogProps {
  isDetailDialogOpen: boolean;
  setIsDetailDialogOpen: (open: boolean) => void;
  detailForm: UseFormReturn<PaymentDetailFormValues>;
  onSubmitDetail: (data: PaymentDetailFormValues) => void;
  getCurrentDetailTypeConfig: () => {
    icon: React.ReactNode;
    color: string;
  };
  missingDays: number;
  paymentDays: number;
  selectedDetailDays: number;
  isLoadingUpdatePaymentDetail: boolean;
}

export default function UpdatePaymentDetailDialog({
  isDetailDialogOpen,
  setIsDetailDialogOpen,
  detailForm,
  onSubmitDetail,
  getCurrentDetailTypeConfig,
  missingDays,
  paymentDays,
  selectedDetailDays,
  isLoadingUpdatePaymentDetail,
}: UpdatePaymentDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 890px)");
  const handleClose = () => {
    detailForm.reset();
  };

  const formContent = (
    <UpdatePaymentDetailForm
      detailForm={detailForm}
      onSubmitDetail={onSubmitDetail}
      getCurrentDetailTypeConfig={getCurrentDetailTypeConfig}
      missingDays={missingDays}
      paymentDays={paymentDays}
      selectedDetailDays={selectedDetailDays}
    >
      {isDesktop ? (
        <DialogFooter>
          <div className="grid grid-cols-2 gap-2 w-full p-6">
            <DialogClose asChild>
              <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                Cancelar
              </Button>
            </DialogClose>
            <Button disabled={isLoadingUpdatePaymentDetail} className="w-full">
              {isLoadingUpdatePaymentDetail && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Actualizar Detalle
            </Button>
          </div>
        </DialogFooter>
      ) : (
        <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
          <Button disabled={isLoadingUpdatePaymentDetail} className="w-full">
            {isLoadingUpdatePaymentDetail && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Actualizar Detalle
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full" onClick={handleClose}>
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      )}
    </UpdatePaymentDetailForm>
  );

  if (isDesktop) {
    return (
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Actualizar Detalle de Pago</DialogTitle>
            <DialogDescription>Editar los detalles del pago seleccionado</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full">{formContent}</ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
      <DrawerContent>
        <DrawerHeader className="pb-2 sr-only">
          <DrawerTitle>Actualizar Detalle de Pago</DrawerTitle>
          <DrawerDescription>Editar los detalles del pago seleccionado</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh] px-0">
            <div className="px-4">{formContent}</div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
