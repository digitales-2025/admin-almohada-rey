"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
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
import { useRoomTypes } from "../../_hooks/use-room-types";
import { UpdateRoomTypeSchema, updateRoomTypeSchema } from "../../_schema/roomTypesSchema";
import { RoomType } from "../../_types/roomTypes";
import UpdateRoomTypeForm from "./UpdateRoomTypesForm";

const infoSheet = {
  title: "Actualizar Tipo de Habitación",
  description: "Actualiza la información del tipo de habitación y guarda los cambios",
};

interface UpdateRoomTypeSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  roomType: RoomType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateRoomTypeSheet({ roomType, open, onOpenChange }: UpdateRoomTypeSheetProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const {
    onUpdateRoomType,
    isSuccessUpdateRoomType,
    onUpdateMainImage, // <-- Añadir esta importación
  } = useRoomTypes();

  // Inicializar con la imagen principal
  const mainImage = roomType.imagesRoomType?.find((img) => img.isMain);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(mainImage?.id || null);

  // Inicializar el formulario
  const form = useForm<UpdateRoomTypeSchema>({
    resolver: zodResolver(updateRoomTypeSchema),
    defaultValues: {
      name: roomType.name,
      guests: roomType.guests,
      price: roomType.price,
      tv: roomType.tv || "",
      floorType: roomType.floorType,
      description: roomType.description || "",
      area: roomType.area,
      bed: roomType.bed || "",
      newImage: undefined,
      // IMPORTANTE: Inicializar con la imagen principal actual como punto de partida
      imageUpdate: mainImage
        ? {
            id: mainImage.id,
            url: mainImage.url,
            isMain: mainImage.isMain,
          }
        : undefined,
    },
  });

  // Reset del formulario cuando cambia el roomType
  useEffect(() => {
    if (open) {
      const mainImage = roomType.imagesRoomType?.find((img) => img.isMain);

      form.reset({
        name: roomType.name,
        guests: roomType.guests,
        price: roomType.price,
        tv: roomType.tv || "",
        floorType: roomType.floorType,
        description: roomType.description || "",
        area: roomType.area,
        bed: roomType.bed || "",
        newImage: undefined,
        // IMPORTANTE: Reiniciar con la imagen principal actual
        imageUpdate: mainImage
          ? {
              id: mainImage.id,
              url: mainImage.url,
              isMain: mainImage.isMain,
            }
          : undefined,
      });

      setSelectedImageId(mainImage?.id || null);
    }
  }, [open, roomType, form]);

  // La función onSubmit recibe los datos ya preparados por el formulario
  const onSubmit = async (formData: UpdateRoomTypeSchema) => {
    startUpdateTransition(() => {
      onUpdateRoomType({
        ...formData,
        id: roomType?.id,
      });
    });
  };

  useEffect(() => {
    if (isSuccessUpdateRoomType) {
      form.reset();
      onOpenChange(false);
    }
  }, [isSuccessUpdateRoomType, onOpenChange, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
              {roomType.name}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <div className="px-5">
            <UpdateRoomTypeForm
              form={form}
              onSubmit={onSubmit}
              roomType={roomType}
              selectedImageId={selectedImageId}
              setSelectedImageId={setSelectedImageId}
              onUpdateMainImage={onUpdateMainImage} // <-- Pasar la nueva función aquí
            >
              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <div className="flex flex-row-reverse gap-2">
                  <Button type="submit" disabled={isUpdatePending}>
                    {isUpdatePending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                    Actualizar
                  </Button>
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </UpdateRoomTypeForm>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
