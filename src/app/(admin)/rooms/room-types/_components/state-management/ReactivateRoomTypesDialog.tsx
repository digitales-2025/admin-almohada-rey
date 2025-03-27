"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";

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

interface ReactivateRoomTypesDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  roomTypes: Row<RoomType>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function ReactivateRoomTypesDialog({
  roomTypes,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateRoomTypesDialogProps) {
  const [isReactivatePending, startReactivateTransition] = useTransition();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onReactivateRoomTypes } = useRoomTypes();

  const onReactivateRoomTypesHandler = () => {
    startReactivateTransition(() => {
      onReactivateRoomTypes(roomTypes);
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
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Reactivar ({roomTypes.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará <span className="font-medium"> {roomTypes.length}</span>
              {roomTypes.length === 1 ? " tipo de habitación" : " tipos de habitación"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Reactivar tipos seleccionados"
              onClick={onReactivateRoomTypesHandler}
              disabled={isReactivatePending}
            >
              {isReactivatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
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
            Reactivar ({roomTypes.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción reactivará <span className="font-medium"> {roomTypes.length}</span>
            {roomTypes.length === 1 ? " tipo de habitación" : " tipos de habitación"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Reactivar tipos seleccionados"
            onClick={onReactivateRoomTypesHandler}
            disabled={isReactivatePending}
          >
            {isReactivatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Reactivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
