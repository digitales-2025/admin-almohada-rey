"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { RefreshCcw } from "lucide-react";

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
import useExtendReservation from "../../_hooks/use-extend-reservation";

interface DeleteLateCheckoutDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  id: string;
}

export function DeleteLateCheckoutDialog({ id, ...props }: DeleteLateCheckoutDialogProps) {
  const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onRemoveLateCheckout } = useExtendReservation();

  const onDeleteLateCheckoutHandler = () => {
    onRemoveLateCheckout(id);
    props.onOpenChange?.(false);
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el late checkout de la reserva seleccionada. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected rows"
              onClick={onDeleteLateCheckoutHandler}
              disabled={isDeletePending}
            >
              {isDeletePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
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
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción eliminará el late checkout de la reserva seleccionada. Esta acción no se puede deshacer.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onDeleteLateCheckoutHandler} disabled={isDeletePending}>
            {isDeletePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
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
