import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon, Pencil, Settings, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UpdateRoomTypeSchema } from "../../_schema/roomTypesSchema";
import { RoomType } from "../../_types/roomTypes";

interface RoomTypeImagesManagerProps {
  form: UseFormReturn<UpdateRoomTypeSchema>;
  roomType: RoomType;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  onUpdateMainImage: (roomTypeId: string, imageUpdate: { id: string; url: string; isMain: boolean }) => Promise<void>; // Cambiado de Promise<RoomType> a Promise<void>
}

export function RoomTypeImagesManager({
  form,
  roomType,
  selectedImageId,
  setSelectedImageId,
  onUpdateMainImage,
}: RoomTypeImagesManagerProps) {
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
  const confirmMainImageChange = async () => {
    if (!configImageId) return;

    const selectedImage = roomType.imagesRoomType?.find((img) => img.id === configImageId);

    if (selectedImage && roomType.id) {
      try {
        // Llamar al endpoint para actualizar la imagen principal
        await onUpdateMainImage(roomType.id, {
          id: selectedImage.id,
          url: selectedImage.url,
          isMain: true,
        });

        // Actualizar la UI después de una actualización exitosa
        handleSelectMainImage(configImageId);
      } catch (error) {
        // El toast ya es manejado por onUpdateMainImage
        console.error("Error al actualizar imagen principal:", error);
      }
    }

    // Limpiar estados
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

  // Obtener solo las imágenes secundarias (no principales)
  const secondaryImages = roomType.imagesRoomType?.filter((img) => !img.isMain) || [];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <h3 className="text-lg font-medium border-b pb-2">Imágenes del tipo de habitación</h3>

        {/* Sección para mostrar la imagen principal en un lugar destacado */}
        {mainImage && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary" />
                  <span>Imagen Principal</span>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={(e) => handleToggleEdit(mainImage.id, e)}
                          className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cambiar imagen</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sección de imágenes secundarias (no principales) */}
        {secondaryImages.length > 0 && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                <span>Imágenes</span>
                <span className="text-sm text-muted-foreground ml-2">(selecciona para establecer como principal)</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {secondaryImages.map((image) => (
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
                    {selectedImageId === image.id && (
                      <Badge className="absolute bottom-2 left-2 bg-emerald-500">Seleccionada</Badge>
                    )}

                    {/* Botones de acción para cada imagen */}
                    <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Botón de configuración */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={(e) => handleToggleConfig(image.id, e)}
                            className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Establecer como principal</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Botón de edición */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            onClick={(e) => handleToggleEdit(image.id, e)}
                            className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white hover:text-primary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cambiar imagen</p>
                        </TooltipContent>
                      </Tooltip>
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
                          ? "Principal"
                          : "Secundaria"}
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size={"icon"}
                              onClick={handleRemoveNewImage}
                              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/80"
                            >
                              <X className="w-4 h-4 text-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar imagen</p>
                          </TooltipContent>
                        </Tooltip>
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
      </div>
    </TooltipProvider>
  );
}
