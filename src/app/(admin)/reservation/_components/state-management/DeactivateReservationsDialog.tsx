"use client";

import { ComponentPropsWithoutRef, useEffect } from "react";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";
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
import { processError } from "@/utils/process-error";
import { useReservation } from "../../_hooks/use-reservation";
import { DetailedReservation } from "../../_schemas/reservation.schemas";

interface DeleteReservationsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  reservations: Row<DetailedReservation>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeactivateReservationsDialog({
  reservations,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteReservationsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onDeactivateReservations, deactivateReservationResponse } = useReservation();

  const { isLoading, isSuccess, isError, error } = deactivateReservationResponse;

  const onDeleteReservationsHandler = () => {
    onDeactivateReservations({
      ids: reservations.map((reservation) => reservation.id),
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
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Archivar ({reservations.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción archivará a<span className="font-medium"> {reservations.length}</span>
              {reservations.length === 1 ? " reservación" : " reservaciones"}
            </AlertDialogDescription>
            <div className="text-pretty text-sm">
              Algunas reservaciones no se pueden archivar debido a:
              <ul className="mt-2 ml-5 list-disc">
                <li>Conflictos de horario</li>
                <li>
                  Ya han sido marcadas como <span className="font-medium">check-in</span>
                </li>
                <li>
                  Ya han sido marcadas como <span className="font-medium">check-out</span>
                </li>
                <li>
                  Han sido <span className="font-medium">canceladas</span>
                </li>
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected rows"
              onClick={onDeleteReservationsHandler}
              disabled={isLoading}
            >
              {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Archivar
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
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Archivar ({reservations.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción archivará a<span className="font-medium">{reservations.length}</span>
            {reservations.length === 1 ? " cliente" : " clientes"}
          </DrawerDescription>
          <DrawerDescription className="text-pretty">
            Algunas reservaciones no se pueden archivar debido a:
            <ul className="mt-2 ml-5 list-disc">
              <li>Conflictos de horario</li>
              <li>
                Ya han sido marcadas como <span className="font-medium">check-in</span>
              </li>
              <li>
                Ya han sido marcadas como <span className="font-medium">check-out</span>
              </li>
              <li>
                Han sido <span className="font-medium">canceladas</span>
              </li>
            </ul>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onDeleteReservationsHandler} disabled={isLoading}>
            {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Archivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
