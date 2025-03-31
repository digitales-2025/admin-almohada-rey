"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRooms } from "../../_hooks/use-rooms";
import {
  cleaningSchema,
  CleaningStatusRoomsSchema,
  statusRoomsSchema,
  UpdateStatusRoomsSchema,
} from "../../_schema/updateStatusRoomsSchema";
import { Room } from "../../_types/room";
import { useRoomsCleaning } from "../../[id]/clean/_hooks/use-rooms-cleaning";
import UpdateAvailabilityRoomsForm from "./UpdateAvailabilityRoomsForm";

const dataForm = {
  button: "Actualizar disponibilidad",
  title: "Actualizar Disponibilidad",
  description: "Seleccione la disponibilidad en la que desea actualizar la habitación.",
};

interface UpdateAvailabilityRoomsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  room: Room;
}

export function UpdateAvailabilityRoomsDialog({ open, setOpen, room }: UpdateAvailabilityRoomsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onUpdateRoomStatus, isSuccessUpdateRoomStatus, onUpdateRoom, isSuccessUpdateRoom } = useRooms();
  const { onCreateRoomCleaning, isSuccessCreateRoomCleaning } = useRoomsCleaning();
  const { refetch } = useRooms();

  // Form for status change
  const statusForm = useForm<UpdateStatusRoomsSchema>({
    resolver: zodResolver(statusRoomsSchema),
    defaultValues: {
      status: room.status,
    },
  });

  // Form for cleaning
  const cleaningForm = useForm<CleaningStatusRoomsSchema>({
    resolver: zodResolver(cleaningSchema),
    defaultValues: {
      checklist: {
        trashBin: room.trashBin,
        towel: room.towel,
        toiletPaper: room.toiletPaper,
        showerSoap: room.showerSoap,
        handSoap: room.handSoap,
        lamp: room.lamp,
      },
      cleanedBy: "",
      observations: "",
    },
  });

  const checklist = cleaningForm.watch("checklist");
  const allTasksCompleted = Object.values(checklist).every((value) => value === true);
  const completedTasksCount = Object.values(checklist).filter(Boolean).length;
  const totalTasks = Object.values(checklist).length;

  const onStatusSubmit = (data: UpdateStatusRoomsSchema) => {
    startCreateTransition(() => {
      onUpdateRoomStatus(room.id, data.status);
    });
  };

  // Handle save for cleaning
  const onCleaningSubmit = async (data: CleaningStatusRoomsSchema) => {
    startCreateTransition(async () => {
      try {
        // Verificar si algún valor del checklist ha cambiado respecto al valor original de room
        const checklistChanged =
          room.trashBin !== data.checklist.trashBin ||
          room.towel !== data.checklist.towel ||
          room.toiletPaper !== data.checklist.toiletPaper ||
          room.showerSoap !== data.checklist.showerSoap ||
          room.handSoap !== data.checklist.handSoap ||
          room.lamp !== data.checklist.lamp;

        const allChecked = Object.values(data.checklist).every((value) => value === true);

        // Primero actualizamos la habitación si es necesario
        if (checklistChanged) {
          await onUpdateRoom(
            {
              trashBin: data.checklist.trashBin,
              towel: data.checklist.towel,
              toiletPaper: data.checklist.toiletPaper,
              showerSoap: data.checklist.showerSoap,
              handSoap: data.checklist.handSoap,
              lamp: data.checklist.lamp,
              id: room.id,
            },
            !allChecked
          ); // Mostrar toast solo si no vamos a crear un registro de limpieza
        }

        // Solo después de que la actualización se complete correctamente,
        // crear el registro de limpieza si todos los elementos están marcados
        if (allChecked) {
          await onCreateRoomCleaning({
            staffName: data.cleanedBy || "",
            observations: data.observations || "",
            date: data.date,
            roomId: room.id,
          });
        }
      } catch (error) {
        console.error("Error al procesar la actualización:", error);
      }
    });
  };

  const handleClose = () => {
    statusForm.reset();
    cleaningForm.reset();
  };

  useEffect(() => {
    if (isSuccessUpdateRoomStatus) {
      statusForm.reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateRoomStatus]);

  useEffect(() => {
    // Para el flujo de limpieza:
    // 1. Si se creó un registro de limpieza (todos los elementos marcados)
    if (isSuccessCreateRoomCleaning) {
      cleaningForm.reset();
      refetch();
      setOpen(false);
    }
    // 2. Si solo se actualizaron elementos de la habitación sin crear registro de limpieza
    else if (isSuccessUpdateRoom) {
      // Verificamos si en el último envío del formulario, no se completaron todos los elementos
      const allChecked = Object.values(cleaningForm.getValues().checklist).every((value) => value === true);
      if (!allChecked) {
        cleaningForm.reset();
        setOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateRoom, isSuccessCreateRoomCleaning]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              <UpdateAvailabilityRoomsForm
                room={room}
                cleaningForm={cleaningForm}
                statusForm={statusForm}
                onStatusSubmit={onStatusSubmit}
                onCleaningSubmit={onCleaningSubmit}
                checklist={checklist}
                allTasksCompleted={allTasksCompleted}
                completedTasksCount={completedTasksCount}
                totalTasks={totalTasks}
              >
                <DialogFooter className="w-full">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isCreatePending} className="w-full">
                      {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      Registrar
                    </Button>
                  </div>
                </DialogFooter>
              </UpdateAvailabilityRoomsForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {dataForm.button}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
        </DrawerHeader>

        {/* The key fix is in this ScrollArea configuration */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[40vh] px-0">
            <div className="px-4">
              <UpdateAvailabilityRoomsForm
                room={room}
                cleaningForm={cleaningForm}
                statusForm={statusForm}
                onStatusSubmit={onStatusSubmit}
                onCleaningSubmit={onCleaningSubmit}
                checklist={checklist}
                allTasksCompleted={allTasksCompleted}
                completedTasksCount={completedTasksCount}
                totalTasks={totalTasks}
              >
                <DrawerFooter className="px-0 pt-2">
                  <Button disabled={isCreatePending} className="w-full">
                    {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    Registrar
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </UpdateAvailabilityRoomsForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
