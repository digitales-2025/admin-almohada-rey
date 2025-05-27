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
import { useMovements } from "../../_hooks/use-movements";
import { SummaryMovements } from "../../_types/movements";

interface DeleteMovementsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  movements: SummaryMovements;
  onSuccess?: () => void;
}

export function DeleteMovementsDialog({ movements, onSuccess, ...props }: DeleteMovementsDialogProps) {
  const [isDeletePending] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onDeleteMovements } = useMovements();

  const onDeleteMovementsHandler = () => {
    onDeleteMovements(movements.id);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el movimiento{" "}
              <span className="font-medium text-red-500">{movements.codeUnique}</span>. Esta acción afectará
              directamente en el almacen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Delete selected rows"
              onClick={onDeleteMovementsHandler}
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
            Esta acción eliminará a <span className="font-medium text-red-500">{movements.codeUnique}</span>. Esta
            acción afectará directamente en el almacen.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button aria-label="Delete selected rows" onClick={onDeleteMovementsHandler} disabled={isDeletePending}>
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
