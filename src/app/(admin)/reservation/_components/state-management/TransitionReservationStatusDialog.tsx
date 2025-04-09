"use client";

import { ComponentPropsWithoutRef, useEffect } from "react";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatPeruBookingDate } from "@/utils/peru-datetime";
import { processError } from "@/utils/process-error";
import { useReservation } from "../../_hooks/use-reservation";
import { DetailedReservation, ReservationStatus } from "../../_schemas/reservation.schemas";
import { DIALOG_DICTIONARY } from "./reservation-status-dialog-config";

interface TransitionReservationStatusDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  reservation: Row<DetailedReservation>["original"];
  newStatus: ReservationStatus;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function TransitionReservationStatusDialog({
  reservation,
  newStatus,
  showTrigger = true,
  onSuccess,
  ...props
}: TransitionReservationStatusDialogProps) {
  const formattedCheckInDate = formatPeruBookingDate(reservation.checkInDate).localeDateString;

  const DIALOG_CONFIG = DIALOG_DICTIONARY[newStatus];
  //   const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onTransitionReservationStatus, transitionReservationStatusResponse } = useReservation();
  const { isLoading, isSuccess, isError, error } = transitionReservationStatusResponse;

  const onTransitionReservationStatusHandler = () => {
    onTransitionReservationStatus({
      id: reservation.id,
      status: newStatus,
    });
  };

  const handleCLose = () => {
    if (isSuccess) {
      onSuccess?.();
      props.onOpenChange?.(false);
    }
  };

  useEffect(() => {
    handleCLose();
  }, [isSuccess, props]);

  useEffect(() => {
    if (isError) {
      toast.error(processError(error) ?? "Error desconocido al cambiar el estado de la reservación");
    }
  }, [isError]);

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <DIALOG_CONFIG.icon className="mr-2 size-4" aria-hidden="true" />
              {DIALOG_CONFIG.buttonLabel}
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{DIALOG_CONFIG.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {DIALOG_CONFIG.description}
              <span className="font-medium">{formattedCheckInDate}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Salir</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={onTransitionReservationStatusHandler} disabled={isLoading}>
              {isLoading && <DIALOG_CONFIG.icon className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              {DIALOG_CONFIG.buttonLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <DIALOG_CONFIG.icon className="mr-2 size-4" aria-hidden="true" />
            {DIALOG_CONFIG.buttonLabel}
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{DIALOG_CONFIG.title}</DrawerTitle>
          <DrawerDescription>
            {DIALOG_CONFIG.description}
            <span className="font-medium">{formattedCheckInDate}</span>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onTransitionReservationStatusHandler} disabled={isLoading}>
            {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            {DIALOG_CONFIG.buttonLabel}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Salir</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
