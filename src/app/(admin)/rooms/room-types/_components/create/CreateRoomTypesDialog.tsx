"use client";

import { useEffect, useState, useTransition } from "react";
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
import { useRoomTypes } from "../../_hooks/use-room-types";
import { CreateRoomTypeSchema, createRoomTypeSchema } from "../../_schema/roomTypesSchema";
import CreateRoomTypeForm from "./CreateRoomTypesForm";

const dataForm = {
  button: "Crear tipo de habitación",
  title: "Crear Tipo de Habitación",
  description: "Complete los detalles a continuación para crear un nuevo tipo de habitación.",
};

export function CreateRoomTypeDialog() {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateRoomType, isSuccessCreateRoomType, refetchDataCreatableTypeRooms } = useRoomTypes();

  const form = useForm<CreateRoomTypeSchema>({
    resolver: zodResolver(createRoomTypeSchema),
    defaultValues: {
      name: "",
      nameEn: "",
      guests: 0,
      price: 0,
      description: "",
      descriptionEn: "",
      bed: "",
      bedEn: "",
      images: [],
    },
  });

  const onSubmit = async (input: CreateRoomTypeSchema) => {
    startCreateTransition(() => {
      onCreateRoomType(input);
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessCreateRoomType) {
      form.reset();
      refetchDataCreatableTypeRooms();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateRoomType]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              <CreateRoomTypeForm form={form} onSubmit={onSubmit}>
                <DialogFooter className="w-full">
                  <div className=" grid grid-cols-2 gap-2 w-full">
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
              </CreateRoomTypeForm>
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

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[80vh] px-0">
            <div className="px-4">
              <CreateRoomTypeForm form={form} onSubmit={onSubmit}>
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
              </CreateRoomTypeForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
