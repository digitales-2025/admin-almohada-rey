"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { usePayments } from "@/app/(admin)/payments/_hooks/use-payments";
import type { PaymentDetail } from "@/app/(admin)/payments/_types/payment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

interface DeletePaymentDetailDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  paymentDetail: PaymentDetail | null;
}

export function DeletePaymentDetailDialog({ paymentDetail, ...props }: DeletePaymentDetailDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { onRemovePaymentDetail, isSuccessRemovePaymentDetail, isLoadingRemovePaymentDetail } = usePayments();

  const handleDelete = () => {
    if (paymentDetail?.id) {
      onRemovePaymentDetail(paymentDetail.id);
    }
  };

  // Format payment date if available
  const formattedDate = paymentDetail?.paymentDate
    ? format(parseISO(paymentDetail.paymentDate), "d 'de' MMMM, yyyy", { locale: es })
    : "";

  // Get item name based on type (product, service, or room)
  const getItemName = () => {
    if (paymentDetail?.product) return paymentDetail.product.name;
    if (paymentDetail?.service) return paymentDetail.service.name;
    if (paymentDetail?.room) return `Habitación ${paymentDetail.room.number} (${paymentDetail.room.RoomTypes.name})`;
    return paymentDetail?.description || "Detalle de pago";
  };

  useEffect(() => {
    if (isSuccessRemovePaymentDetail) {
      props.onOpenChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessRemovePaymentDetail]);

  const PaymentInfo = () => (
    <div className="mt-4 space-y-3">
      <div className="rounded-md bg-amber-50 p-3 text-amber-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-medium">Esta acción no se puede deshacer</p>
        </div>
      </div>

      <div className="rounded-md bg-muted p-3">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="font-medium text-muted-foreground">Concepto:</dt>
            <dd className="font-semibold">{getItemName()}</dd>
          </div>

          {formattedDate && (
            <div className="flex justify-between">
              <dt className="font-medium text-muted-foreground">Fecha:</dt>
              <dd>{formattedDate}</dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="font-medium text-muted-foreground">Monto:</dt>
            <dd className="font-semibold">S/. {paymentDetail?.subtotal.toFixed(2)}</dd>
          </div>

          {paymentDetail?.method && (
            <div className="flex justify-between">
              <dt className="font-medium text-muted-foreground">Método:</dt>
              <dd>
                <Badge variant="outline">{paymentDetail.method}</Badge>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar detalle de pago?</AlertDialogTitle>
            <AlertDialogDescription>Se eliminará permanentemente el siguiente detalle de pago:</AlertDialogDescription>
          </AlertDialogHeader>

          <PaymentInfo />

          <AlertDialogFooter className="mt-4 gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoadingRemovePaymentDetail}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoadingRemovePaymentDetail && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Eliminar detalle de pago?</DrawerTitle>
          <DrawerDescription>Se eliminará permanentemente el siguiente detalle de pago:</DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <PaymentInfo />
        </div>

        <DrawerFooter className="mt-2 gap-2 sm:space-x-0">
          <Button
            onClick={handleDelete}
            disabled={isLoadingRemovePaymentDetail}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoadingRemovePaymentDetail && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Eliminar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
