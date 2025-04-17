import { ComponentPropsWithoutRef, useEffect } from "react";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";
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

interface ReactivateReservationsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  reservations: Row<DetailedReservation>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const ReactivateReservationsDialog = ({
  reservations,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateReservationsDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onReactivateReservations, reactivateReservationsResponse } = useReservation();

  const { isLoading, isSuccess, isError, error } = reactivateReservationsResponse;

  const onReactivateReservationsHandler = () => {
    onReactivateReservations({
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
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Restaurar ({reservations.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción restaurará a <span className="font-medium"> {reservations.length}</span>
              {reservations.length === 1 ? " reserva" : " reservas"}
            </AlertDialogDescription>
            <AlertDialogDescription className="text-pretty">
              Puede que algunas reservaciones no se puedan restaurar debido a:
              <ul className="list-disc pl-6 mt-2">
                <li>Ya ha pasado su fecha de check-in</li>
                <li>Ya no hay horarios disponibles para su habitación desde su cancelación o desactivación</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Reactivate selected rows"
              onClick={onReactivateReservationsHandler}
              disabled={isLoading}
            >
              {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Reactivar
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
            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
            Restaurar ({reservations.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción restaurará a<span className="font-medium">{reservations.length}</span>
            {reservations.length === 1 ? " reserva" : " reservas"}
          </DrawerDescription>
          <DrawerDescription className="text-pretty">
            Puede que algunas reservaciones no se puedan restaurar debido a:
            <ul className="list-disc pl-6 mt-2">
              <li>Ya ha pasado su fecha de check-in</li>
              <li>Ya no hay horarios disponibles para su habitación desde su cancelación o desactivación</li>
            </ul>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Reactivate selected rows" onClick={onReactivateReservationsHandler} disabled={isLoading}>
            {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Restaurar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
