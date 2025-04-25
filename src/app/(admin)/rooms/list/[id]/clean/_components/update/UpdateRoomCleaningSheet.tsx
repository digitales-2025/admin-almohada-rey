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
import { useRoomsCleaning } from "../../_hooks/use-rooms-cleaning";
import { roomCleaningSchema, UpdateRoomCleaningSchema } from "../../_schemas/updateCleaningRoomsSchema";
import { RoomCleaning } from "../../_types/roomCleaning";
import UpdateRoomCleaningForm from "./UpdateRoomCleaningForm";

const infoSheet = {
  title: "Actualizar Habitación",
  description: "Actualiza la información del habitación y guarda los cambios",
};

interface UpdateRoomCleaningSheetProps
  extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  roomCleaning: RoomCleaning;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateRoomCleaningSheet({ roomCleaning, open, onOpenChange }: UpdateRoomCleaningSheetProps) {
  const { onUpdateRoomCleaning, isSuccessUpdateRoomCleaning, isLoadingUpdateRoomCleaning } = useRoomsCleaning();

  const form = useForm<UpdateRoomCleaningSchema>({
    resolver: zodResolver(roomCleaningSchema),
    defaultValues: {
      date: roomCleaning.date,
      staffName: roomCleaning.staffName,
      observations: roomCleaning.observations,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        date: roomCleaning.date,
        staffName: roomCleaning.staffName,
        observations: roomCleaning.observations,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, roomCleaning]);

  const onSubmit = async (input: UpdateRoomCleaningSchema) => {
    onUpdateRoomCleaning({
      ...input,
      id: roomCleaning.id,
    });
  };

  useEffect(() => {
    if (isSuccessUpdateRoomCleaning) {
      form.reset();
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateRoomCleaning, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">{infoSheet.title}</SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateRoomCleaningForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="submit" disabled={isLoadingUpdateRoomCleaning}>
                  {isLoadingUpdateRoomCleaning && (
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateRoomCleaningForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
