"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRooms } from "../../_hooks/use-rooms";
import { CreateRoomsSchema, roomsSchema } from "../../_schema/createRoomsSchema";
import { Room } from "../../_types/room";
import UpdateRoomsForm from "./UpdateRoomsForm";

const infoSheet = {
  title: "Actualizar Habitación",
  description: "Actualiza la información del habitación y guarda los cambios",
};

interface UpdateCustomerSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateCustomerSheet({ room, open, onOpenChange }: UpdateCustomerSheetProps) {
  const { onUpdateRoom, isSuccessUpdateRoom, isLoadingUpdateRoom } = useRooms();

  const form = useForm<CreateRoomsSchema>({
    resolver: zodResolver(roomsSchema),
    defaultValues: {
      number: room.number,
      roomTypeId: room.roomTypeId,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        number: room.number,
        roomTypeId: room.roomTypeId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, room]);

  const onSubmit = async (input: CreateRoomsSchema) => {
    onUpdateRoom({
      ...input,
      id: room.id,
    });
  };

  useEffect(() => {
    if (isSuccessUpdateRoom) {
      form.reset();
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateRoom, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">{infoSheet.title}</SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateRoomsForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="submit" disabled={isLoadingUpdateRoom}>
                  {isLoadingUpdateRoom && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateRoomsForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
