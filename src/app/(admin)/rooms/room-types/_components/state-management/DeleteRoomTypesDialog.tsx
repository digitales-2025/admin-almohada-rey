"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";

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
import { useRoomTypes } from "../../_hooks/use-room-types";
import { RoomType } from "../../_types/roomTypes";

interface DeleteRoomTypesDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  roomTypes: Row<RoomType>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteRoomTypesDialog({
  roomTypes,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteRoomTypesDialogProps) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onDeleteRoomTypes } = useRoomTypes();

  const onDeleteRoomTypesHandler = () => {
    startDeleteTransition(() => {
      onDeleteRoomTypes(roomTypes);
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Eliminar ({roomTypes.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará <span className="font-medium"> {roomTypes.length}</span>
              {roomTypes.length === 1 ? " tipo de habitación" : " tipos de habitación"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Desactivar tipos seleccionados"
              onClick={onDeleteRoomTypesHandler}
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
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Eliminar ({roomTypes.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción desactivará <span className="font-medium"> {roomTypes.length}</span>
            {roomTypes.length === 1 ? " tipo de habitación" : " tipos de habitación"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Desactivar tipos seleccionados"
            onClick={onDeleteRoomTypesHandler}
            disabled={isDeletePending}
          >
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
