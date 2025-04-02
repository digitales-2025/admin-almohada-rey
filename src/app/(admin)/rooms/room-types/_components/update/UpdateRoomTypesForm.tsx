import React, { useEffect } from "react";
import { Bed, CreditCard, User2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
/* import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; */
import { Textarea } from "@/components/ui/textarea";
import { UpdateRoomTypeSchema } from "../../_schema/roomTypesSchema";
import { /* FloorTypeEnum, */ RoomType } from "../../_types/roomTypes";
/* import { FloorTypeLabels } from "../../_utils/roomTypes.utils"; */
import { RoomTypeImagesManager } from "./RoomTypeImagesManager";

interface UpdateRoomTypeFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<UpdateRoomTypeSchema>;
  onSubmit: (data: UpdateRoomTypeSchema) => void;
  onUpdateMainImage: (roomTypeId: string, imageUpdate: { id: string; url: string; isMain: boolean }) => Promise<void>; // Cambiado a Promise<void>
  roomType: RoomType;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
}

export default function UpdateRoomTypeForm({
  children,
  form,
  onSubmit,
  onUpdateMainImage,
  roomType,
  selectedImageId,
  setSelectedImageId,
}: UpdateRoomTypeFormProps) {
  // Función para preparar y enviar el formulario
  const handleFormSubmit = (data: UpdateRoomTypeSchema) => {
    // Crear una copia para no modificar el objeto original
    const formData = { ...data };

    // 1. Manejar el caso de una imagen seleccionada para hacerla principal
    if (selectedImageId) {
      const selectedImage = roomType.imagesRoomType?.find((img) => img.id === selectedImageId);
      if (selectedImage) {
        // Importante: Usar 'id' en lugar de 'imageId' como espera el backend
        formData.imageUpdate = {
          id: selectedImage.id,
          url: selectedImage.url,
          isMain: selectedImage.isMain,
        };
      }
    }

    // Validación: si el esquema requiere imageUpdate y no lo tenemos, usar la imagen principal actual
    if (!formData.imageUpdate) {
      const mainImage = roomType.imagesRoomType?.find((img) => img.isMain);
      if (mainImage) {
        formData.imageUpdate = {
          id: mainImage.id,
          url: mainImage.url,
          isMain: true,
        };
      }
    }

    // Llamar a onSubmit con los datos actualizados
    onSubmit(formData);
  };

  // Inicializar la imagen seleccionada cuando se abre el formulario
  useEffect(() => {
    if (!selectedImageId && roomType.imagesRoomType) {
      const mainImage = roomType.imagesRoomType.find((img) => img.isMain);
      if (mainImage) {
        setSelectedImageId(mainImage.id);
      }
    }
  }, [roomType, selectedImageId, setSelectedImageId]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 gap-4">
        {/* Primera fila: Nombre y Número de huéspedes */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Bed} placeholder="Ej: Suite Presidencial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de huéspedes</FormLabel>
                <FormControl>
                  <InputWithIcon
                    Icon={User2}
                    placeholder="Ej: 2"
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Segunda fila: Área y Precio */}
        <div className="grid grid-cols-2 gap-4">
          {/*      <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (m²)</FormLabel>
                <FormControl>
                  <InputWithIcon
                    Icon={AreaChart}
                    placeholder="Ej: 30"
                    type="number"
                    min={0}
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por noche</FormLabel>
                <FormControl>
                  <InputWithIcon
                    Icon={CreditCard}
                    placeholder="Ej: 150.00"
                    type="number"
                    min={0}
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cama</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Bed} placeholder="Ej: King size con colchón ortopédico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tercera fila: TV y Cama */}
        {/* <div className="grid grid-cols-2 gap-4">
         <FormField
            control={form.control}
            name="tv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TV / Entretenimiento</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={MonitorDot} placeholder="Ej: TV 50 pulgadas con Netflix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>*/}

        {/* Tipo de piso (campo único) */}
        {/*       <FormField
          control={form.control}
          name="floorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Piso</FormLabel>
              <Select onValueChange={(value) => field.onChange(value as FloorTypeEnum)} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de piso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(FloorTypeLabels).map(([floorType, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={floorType} value={floorType} className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`size-4 ${config.className}`} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Descripción (campo que ocupa todo el ancho) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe las características de este tipo de habitación..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Componente de gestión de imágenes */}
        <RoomTypeImagesManager
          form={form}
          roomType={roomType}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
          onUpdateMainImage={onUpdateMainImage}
        />

        {children}
      </form>
    </Form>
  );
}
