import { ComponentPropsWithoutRef } from "react";
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
import { useRooms } from "../../_hooks/use-rooms";
import { Room } from "../../_types/room";

interface ReactivateRoomsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  rooms: Row<Room>["original"][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const ReactivateRoomsDialog = ({
  rooms,
  showTrigger = true,
  onSuccess,
  ...props
}: ReactivateRoomsDialogProps) => {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { onReactivateRooms, isLoadingReactivateRooms } = useRooms();

  const onReactivateRoomsHandler = () => {
    onReactivateRooms(rooms);
    props.onOpenChange?.(false);
    onSuccess?.();
  };

  if (isDesktop) {
    return (
      <AlertDialog {...props}>
        {showTrigger ? (
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
              Reactivar ({rooms.length})
            </Button>
          </AlertDialogTrigger>
        ) : null}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará a <span className="font-medium"> {rooms.length}</span>
              {rooms.length === 1 ? " habitación" : " habitaciones"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction
              aria-label="Reactivate selected rows"
              onClick={onReactivateRoomsHandler}
              disabled={isLoadingReactivateRooms}
            >
              {isLoadingReactivateRooms && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
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
            Reactivar ({rooms.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>¿Estás absolutamente seguro?</DrawerTitle>
          <DrawerDescription>
            Esta acción reactivará a<span className="font-medium">{rooms.length}</span>
            {rooms.length === 1 ? " habitación" : " habitaciones"}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <Button
            aria-label="Reactivate selected rows"
            onClick={onReactivateRoomsHandler}
            disabled={isLoadingReactivateRooms}
          >
            {isLoadingReactivateRooms && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Reactivar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
