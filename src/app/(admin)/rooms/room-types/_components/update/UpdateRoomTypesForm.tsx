import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AreaChart, Bed, CreditCard, ImageIcon, MonitorDot, Pencil, Settings, User2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UpdateRoomTypeSchema } from "../../_schema/roomTypesSchema";
import { FloorTypeEnum, RoomType } from "../../_types/roomTypes";
import { FloorTypeLabels } from "../../_utils/roomTypes.utils";

interface UpdateRoomTypeFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<UpdateRoomTypeSchema>;
  onSubmit: (data: UpdateRoomTypeSchema) => void;
  roomType: RoomType;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
}

export default function UpdateRoomTypeForm({
  children,
  form,
  onSubmit,
  roomType,
  selectedImageId,
  setSelectedImageId,
}: UpdateRoomTypeFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [configImageId, setConfigImageId] = useState<string | null>(null);
  const [switchValue, setSwitchValue] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Manejar la selección de una nueva imagen
  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea un archivo de imagen
    if (!file.type.startsWith("image/")) {
      form.setError("newImage", {
        type: "manual",
        message: "El archivo debe ser una imagen",
      });
      return;
    }

    // Mostrar vista previa
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Guardar en el formulario
    form.setValue("newImage", file, { shouldValidate: true });
  };

  // Manejar la selección de una imagen como principal
  const handleSelectMainImage = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  // Confirmar cambio a imagen principal
  const confirmMainImageChange = () => {
    handleSelectMainImage(configImageId!);
    setShowConfirmation(false);
    setConfigImageId(null);
    setSwitchValue(false);
  };

  // Cancelar cambio a imagen principal
  const cancelMainImageChange = () => {
    setShowConfirmation(false);
    setSwitchValue(false);
  };

  // Eliminar la imagen nueva
  const handleRemoveNewImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    form.setValue("newImage", undefined, { shouldValidate: true });
  };

  // Mostrar opciones de edición
  const handleToggleEdit = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se seleccione la imagen
    setEditingImageId(editingImageId === imageId ? null : imageId);
    setConfigImageId(null); // Cerrar menú de configuración si está abierto
    setShowConfirmation(false);
    setSwitchValue(false);
  };

  // Mostrar opciones de configuración
  const handleToggleConfig = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se seleccione la imagen
    setConfigImageId(configImageId === imageId ? null : imageId);
    setEditingImageId(null); // Cerrar edición si está abierta
    setShowConfirmation(false);
    setSwitchValue(false);
  };

  // Cerrar todos los menús
  const handleCloseMenus = () => {
    setEditingImageId(null);
    setConfigImageId(null);
    setShowConfirmation(false);
    setSwitchValue(false);
  };

  // Encontrar la imagen principal actual
  const mainImage = roomType.imagesRoomType?.find((img) => img.isMain);

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
          id: selectedImage.id, // <-- CAMBIO AQUÍ: imageId -> id
          url: selectedImage.url,
          isMain: true, // Esta imagen será la principal
        };

        console.log("Se establecerá como imagen principal:", selectedImage.id);
      }
    }

    // 2. Manejar el caso de reemplazar una imagen existente con una nueva
    if (editingImageId && formData.newImage) {
      const imageToUpdate = roomType.imagesRoomType?.find((img) => img.id === editingImageId);
      if (imageToUpdate) {
        // Si ya tenemos imageUpdate de una selección principal, mantener esa
        // De lo contrario, crear un objeto imageUpdate para la imagen que estamos editando
        if (!formData.imageUpdate) {
          formData.imageUpdate = {
            id: imageToUpdate.id, // <-- CAMBIO AQUÍ: imageId -> id
            url: imageToUpdate.url,
            isMain: imageToUpdate.isMain, // Mantener el estado principal que ya tenía
          };
        }

        // ELIMINAR la línea que establece imageToUpdateId
        // formData.imageToUpdateId = editingImageId;  <-- ELIMINAR ESTA LÍNEA

        console.log("Se reemplazará la imagen:", editingImageId);
      }
    }

    // Validación: si el esquema requiere imageUpdate y no lo tenemos, usar la imagen principal actual
    if (!formData.imageUpdate) {
      const mainImage = roomType.imagesRoomType?.find((img) => img.isMain);
      if (mainImage) {
        formData.imageUpdate = {
          id: mainImage.id, // <-- CAMBIO AQUÍ: imageId -> id
          url: mainImage.url,
          isMain: true,
        };
        console.log("Usando imagen principal actual como imageUpdate");
      } else {
        console.error("No se encontró una imagen principal y no se seleccionó ninguna imagen");
      }
    }

    // Log para depuración
    console.log("Datos a enviar:", {
      ...formData,
      newImage: formData.newImage
        ? {
            nombre: formData.newImage.name,
            tipo: formData.newImage.type,
            tamaño: `${(formData.newImage.size / 1024).toFixed(2)} KB`,
          }
        : undefined,
      imageUpdate: formData.imageUpdate,
      // Ya no mostramos imageToUpdateId porque lo eliminamos
    });

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
          <FormField
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
          />

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
        </div>

        {/* Tercera fila: TV y Cama */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Tipo de piso (campo único) */}
        <FormField
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
        />

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

        {/* Sección para mostrar la imagen principal en un lugar destacado */}
        {mainImage && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>Principal</span>
                </div>
                <Badge className="bg-primary text-white">Principal</Badge>
              </Label>
              <div className="w-full flex justify-center">
                <div
                  className={`relative border-2 rounded-lg ${
                    selectedImageId === mainImage.id ? "border-primary" : "border-transparent"
                  }`}
                  onClick={() => handleSelectMainImage(mainImage.id)}
                >
                  <Image
                    src={mainImage.url}
                    alt={`${roomType.name} - Imagen Principal`}
                    className="rounded-lg object-contain"
                    width={400}
                    height={300}
                    style={{
                      maxHeight: "250px",
                      width: "auto",
                      maxWidth: "100%",
                    }}
                  />
                  {selectedImageId === mainImage.id && (
                    <Badge className="absolute bottom-2 left-2 bg-emerald-500">Seleccionada</Badge>
                  )}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <Button
                      type="button"
                      onClick={(e) => handleToggleEdit(mainImage.id, e)}
                      className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sección de todas las imágenes existentes */}
        {roomType.imagesRoomType && roomType.imagesRoomType.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                <span>Todas las imágenes</span>
                <span className="text-sm text-muted-foreground ml-2">(selecciona para establecer como principal)</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {roomType.imagesRoomType.map((image) => (
                  <div
                    key={image.id}
                    className={`relative group cursor-pointer border-2 rounded-lg ${
                      selectedImageId === image.id ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => {
                      handleSelectMainImage(image.id);
                      handleCloseMenus();
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={`${roomType.name} - Imagen`}
                      className="w-full h-24 object-cover rounded-lg"
                      width={400}
                      height={300}
                    />
                    {image.isMain && <Badge className="absolute top-2 right-2 bg-primary/70">Principal</Badge>}
                    {selectedImageId === image.id && (
                      <Badge className="absolute bottom-2 left-2 bg-emerald-500">Seleccionada</Badge>
                    )}

                    {/* Botones de acción para cada imagen */}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Botón de configuración (solo para imágenes no principales) */}
                      {!image.isMain && (
                        <Button
                          type="button"
                          onClick={(e) => handleToggleConfig(image.id, e)}
                          className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Botón de edición */}
                      <Button
                        type="button"
                        onClick={(e) => handleToggleEdit(image.id, e)}
                        className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sección para agregar una nueva imagen - solo visible cuando se edita una imagen */}
        {editingImageId && (
          <FormField
            control={form.control}
            name="newImage"
            render={() => (
              <FormItem>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                        <span>Reemplazar imagen seleccionada</span>
                      </div>
                      <Badge variant="outline">
                        {roomType.imagesRoomType?.find((img) => img.id === editingImageId)?.isMain
                          ? "Imagen Principal"
                          : "Imagen Secundaria"}
                      </Badge>
                    </Label>
                    <div className="mt-2">
                      <input type="file" id="newImage" accept="image/*" onChange={handleNewImage} className="hidden" />
                      <label
                        htmlFor="newImage"
                        className={`inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors ${
                          imagePreview ? "opacity-50" : ""
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        <span>{imagePreview ? "Cambiar imagen" : "Agregar imagen"}</span>
                      </label>
                    </div>

                    {imagePreview && (
                      <div className="mt-4 relative group">
                        <Image
                          src={imagePreview}
                          alt="Nueva imagen"
                          className="w-full max-h-48 object-contain rounded-lg"
                          width={400}
                          height={300}
                        />
                        <Button
                          type="button"
                          size={"icon"}
                          onClick={handleRemoveNewImage}
                          className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/80"
                        >
                          <X className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingImageId(null);
                          handleRemoveNewImage();
                        }}
                        variant="outline"
                      >
                        Cancelar
                      </Button>
                    </div>
                    <FormMessage />
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />
        )}

        {/* Sección para configurar una imagen como principal */}
        {configImageId && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <span>Configurar imagen</span>
                </div>
                <Badge variant="outline">Opciones de imagen</Badge>
              </Label>

              {/* Vista previa de la imagen que se está configurando */}
              {roomType.imagesRoomType?.find((img) => img.id === configImageId) && (
                <div className="w-full flex justify-center mt-2">
                  <Image
                    src={roomType.imagesRoomType.find((img) => img.id === configImageId)!.url}
                    alt="Imagen configurada"
                    className="rounded-lg object-contain max-h-32"
                    width={200}
                    height={150}
                  />
                </div>
              )}

              {!showConfirmation ? (
                <div className="flex items-center justify-between mt-4 p-2 border rounded-md">
                  <Label htmlFor="make-main-image" className="text-sm font-medium cursor-pointer">
                    Establecer como imagen principal
                  </Label>
                  <Switch
                    id="make-main-image"
                    checked={switchValue}
                    onCheckedChange={(checked) => {
                      setSwitchValue(checked);
                      if (checked) {
                        setShowConfirmation(true);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="mt-4 p-4 bg-muted rounded-md space-y-3">
                  <p className="text-sm font-medium text-center">¿Confirmar establecer esta imagen como principal?</p>
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelMainImageChange}
                      className="min-w-20 dark:border-white"
                    >
                      No
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={confirmMainImageChange}
                      className="min-w-20 bg-secondary dark:bg-white dark:border-white hover:bg-gray-700"
                    >
                      Sí
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setConfigImageId(null);
                    setSwitchValue(false);
                    setShowConfirmation(false);
                  }}
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {children}
      </form>
    </Form>
  );
}
