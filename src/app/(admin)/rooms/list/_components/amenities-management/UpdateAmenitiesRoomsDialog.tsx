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
import { updateAmenities, UpdateAmenitiesSchema } from "../../_schema/updateStatusRoomsSchema";
import { Room } from "../../_types/room";
import UpdateAmenitiesRoomsForm from "./UpdateAmenitiesRoomsForm";

const dataForm = {
  button: "Actualizar amenidades",
  title: "Actualizar Amenidades",
  description: "Manejo de amenidades de la habitación.",
};

interface UpdateAmenitiesRoomsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  room: Room;
}

export function UpdateAmenitiesRoomsDialog({ open, setOpen, room }: UpdateAmenitiesRoomsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onUpdateAmenities, isSuccessUpdateAmenities } = useRooms();
  const { refetch } = useRooms();

  // Form for cleaning
  const amenitiesForm = useForm<UpdateAmenitiesSchema>({
    resolver: zodResolver(updateAmenities),
    defaultValues: {
      checklist: {
        trashBin: room.trashBin,
        towel: room.towel,
        toiletPaper: room.toiletPaper,
        showerSoap: room.showerSoap,
        handSoap: room.handSoap,
        lamp: room.lamp,
      },
    },
  });

  const checklist = amenitiesForm.watch("checklist");
  const allTasksCompleted = Object.values(checklist).every((value) => value === true);
  const completedTasksCount = Object.values(checklist).filter(Boolean).length;
  const totalTasks = Object.values(checklist).length;

  // Handle save for cleaning
  const onUpdateAmenitiesSubmit = async (data: UpdateAmenitiesSchema) => {
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

        // Primero actualizamos la habitación si es necesario
        if (checklistChanged) {
          await onUpdateAmenities({
            trashBin: data.checklist.trashBin,
            towel: data.checklist.towel,
            toiletPaper: data.checklist.toiletPaper,
            showerSoap: data.checklist.showerSoap,
            handSoap: data.checklist.handSoap,
            lamp: data.checklist.lamp,
            id: room.id,
          });
        }
      } catch (error) {
        console.error("Error al procesar la actualización:", error);
      }
    });
  };

  const handleClose = () => {
    amenitiesForm.reset();
  };

  useEffect(() => {
    // Para el flujo de actualizar amenidades, no necesitamos limpiar el formulario
    if (isSuccessUpdateAmenities) {
      amenitiesForm.reset();
      refetch();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateAmenities]);

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
              <UpdateAmenitiesRoomsForm
                amenitiesForm={amenitiesForm}
                onUpdateAmenitiesSubmit={onUpdateAmenitiesSubmit}
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
              </UpdateAmenitiesRoomsForm>
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
              <UpdateAmenitiesRoomsForm
                amenitiesForm={amenitiesForm}
                onUpdateAmenitiesSubmit={onUpdateAmenitiesSubmit}
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
              </UpdateAmenitiesRoomsForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
