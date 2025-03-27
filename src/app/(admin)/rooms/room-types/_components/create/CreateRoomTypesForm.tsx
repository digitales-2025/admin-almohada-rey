import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AreaChart, Bed, CreditCard, ImageIcon, MonitorDot, User2, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateRoomTypeSchema } from "../../_schema/roomTypesSchema";
import { FloorTypeEnum } from "../../_types/roomTypes";
import { FloorTypeLabels } from "../../_utils/roomTypes.utils";

interface CreateRoomTypeFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateRoomTypeSchema>;
  onSubmit: (data: CreateRoomTypeSchema) => void;
}

export default function CreateRoomTypeForm({ children, form, onSubmit }: CreateRoomTypeFormProps) {
  // Estados para las vistas previas de las imágenes
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  // Estado temporal para las imágenes antes de asignarlas al form
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);

  // Función auxiliar para actualizar el campo 'images' del formulario
  const updateFormImages = (mainFile: File | null, additionalFiles: File[]) => {
    const allImages: File[] = [];

    // La primera imagen siempre es la principal
    if (mainFile) {
      allImages.push(mainFile);
    }

    // Agregar las imágenes adicionales
    if (additionalFiles.length > 0) {
      allImages.push(...additionalFiles);
    }

    // Actualizar el campo 'images' en el formulario
    form.setValue("images", allImages, { shouldValidate: true });

    // Mostrar en consola las imágenes actualizadas
    console.log("Imágenes actualizadas:", {
      total: allImages.length,
      imagenes: allImages.map((file) => ({
        nombre: file.name,
        tipo: file.type,
        tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      })),
    });
  };

  // Manejar la imagen principal
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea un archivo de imagen
    if (!file.type.startsWith("image/")) {
      form.setError("images", {
        type: "manual",
        message: "Solo se permiten archivos de imagen",
      });
      return;
    }

    // Limpiar error previo si existe
    form.clearErrors("images");

    // Si ya había una imagen principal, revocar su URL
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
    }

    // Crear vista previa y guardar en estado local
    const preview = URL.createObjectURL(file);
    setMainImagePreview(preview);
    setMainImageFile(file);

    // Actualizar el form con todas las imágenes
    updateFormImages(file, additionalImageFiles);
  };

  // Manejar la eliminación de la imagen principal
  const handleRemoveMainImage = () => {
    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
      setMainImagePreview(null);
      setMainImageFile(null);

      // Actualizar el form sin la imagen principal
      updateFormImages(null, additionalImageFiles);
    }
  };

  // Manejar la adición de imágenes adicionales
  const handleAddAdditionalImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Verificar cuántas imágenes adicionales podemos agregar
    const maxAdditionalImages = 4;
    const remainingSlots = maxAdditionalImages - additionalImageFiles.length;

    if (remainingSlots <= 0) {
      form.setError("images", {
        type: "manual",
        message: "Ya has agregado el máximo de 4 imágenes adicionales.",
      });
      return;
    }

    // Limitar la cantidad de archivos a seleccionar
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    // Validar que sean archivos de imagen
    const invalidFiles = filesToAdd.filter((file) => !file.type.startsWith("image/"));
    if (invalidFiles.length > 0) {
      form.setError("images", {
        type: "manual",
        message: "Solo se permiten archivos de imagen",
      });
      return;
    }

    // Limpiar error previo si existe
    form.clearErrors("images");

    // Agregar las imágenes al estado local
    const newFiles = [...additionalImageFiles, ...filesToAdd];
    const newPreviews = [...additionalImagePreviews];

    filesToAdd.forEach((file) => {
      newPreviews.push(URL.createObjectURL(file));
    });

    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);

    // Actualizar el form con todas las imágenes
    updateFormImages(mainImageFile, newFiles);
  };

  // Manejar la eliminación de imágenes adicionales
  const handleRemoveAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles];
    const newPreviews = [...additionalImagePreviews];

    // Revocar la URL para liberar memoria
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setAdditionalImageFiles(newFiles);
    setAdditionalImagePreviews(newPreviews);

    // Actualizar el form con todas las imágenes
    updateFormImages(mainImageFile, newFiles);
  };

  // Validación antes de enviar el formulario
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Verificar si las imágenes están presentes
      if (name === "images" || !name) {
        const images = value.images || [];

        // Validar imagen principal
        if (images.length === 0 || !mainImageFile) {
          form.setError("images", {
            type: "manual",
            message: "Debe agregar una imagen principal",
          });
        }
        // Validar que sean exactamente 5 imágenes (1 principal + 4 adicionales)
        else if (images.length < 5) {
          form.setError("images", {
            type: "manual",
            message: `Necesita agregar ${5 - images.length} imagen(es) más`,
          });
        } else if (images.length > 5) {
          form.setError("images", {
            type: "manual",
            message: "Solo se permiten 5 imágenes en total",
          });
        } else {
          form.clearErrors("images");
        }
      }

      // Mostrar todos los valores del formulario cuando cambian
      console.log("Form values:", value);
    });

    return () => subscription.unsubscribe();
  }, [form, mainImageFile]);

  // Función personalizada para manejar el envío
  const handleFormSubmit = (data: CreateRoomTypeSchema) => {
    // Mostrar los datos completos que se enviarán
    console.log("DATOS A ENVIAR:", {
      ...data,
      images: data.images?.map((file) => ({
        nombre: file.name,
        tipo: file.type,
        tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      })),
    });

    // Continuar con el envío normal
    onSubmit(data);
  };

  // Función para validar rango numérico
  const validateNumericRange = (value: string, min: number, max: number, isInteger: boolean = false): number | null => {
    // Remover caracteres no numéricos excepto punto decimal
    const sanitized = value.replace(/[^\d.]/g, "");

    // Parsear a número
    const numberValue = isInteger ? parseInt(sanitized) : parseFloat(sanitized);

    // Verificar si es un número válido
    if (isNaN(numberValue)) {
      return null;
    }

    // Aplicar límites
    if (numberValue < min) return min;
    if (numberValue > max) return max;

    return numberValue;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Campos básicos en grid de 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    max={50} /* Límite razonable de huéspedes */
                    {...field}
                    onChange={(e) => {
                      const validValue = validateNumericRange(e.target.value, 1, 50, true);
                      if (validValue !== null) {
                        field.onChange(validValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Asegurar que siempre tenga un valor válido al perder foco
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1) {
                        field.onChange(1);
                      }
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    min={1}
                    max={10000} /* Límite razonable para área */
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const validValue = validateNumericRange(e.target.value, 1, 10000, false);
                      if (validValue !== null) {
                        field.onChange(validValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Asegurar que siempre tenga un valor válido al perder foco
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value < 1) {
                        field.onChange(1);
                      }
                    }}
                    value={field.value || ""}
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
                    max={1000000} /* Límite razonable para precio */
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const validValue = validateNumericRange(e.target.value, 0, 1000000, false);
                      if (validValue !== null) {
                        field.onChange(validValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Asegurar que siempre tenga un valor válido al perder foco
                      const value = parseFloat(e.target.value);
                      if (isNaN(value) || value < 0) {
                        field.onChange(0);
                      }
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>

        {/* Campo de descripción (ocupa todo el ancho) */}
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

        {/* Sección de imágenes - ahora utilizando un único campo 'images' */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <>
              {/* Sección de imagen principal */}
              <FormItem>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span>Imagen Principal</span>
                      </div>
                      <Badge className="bg-primary text-white">Principal</Badge>
                    </Label>
                    {!mainImagePreview ? (
                      <div className="mt-2">
                        <Input
                          type="file"
                          id="mainImage"
                          accept="image/*"
                          onChange={handleMainImage}
                          className="hidden"
                        />
                        <Label
                          htmlFor="mainImage"
                          className="inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors"
                        >
                          <ImageIcon className="w-5 h-5 mr-2" />
                          <span>Seleccionar imagen principal</span>
                        </Label>
                      </div>
                    ) : (
                      <div className="mt-4 relative group">
                        <div className="w-full flex justify-center">
                          <div className="relative">
                            <Image
                              src={mainImagePreview}
                              alt="Imagen Principal"
                              className="rounded-lg object-contain"
                              width={400}
                              height={300}
                              style={{
                                maxHeight: "250px",
                                width: "auto",
                                maxWidth: "100%",
                              }}
                            />
                            <Button
                              type="button"
                              size={"icon"}
                              onClick={handleRemoveMainImage}
                              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/80"
                            >
                              <X className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FormItem>

              {/* Sección de imágenes adicionales */}
              <FormItem>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Label className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        <span>Imágenes Adicionales</span>
                      </div>
                      <Badge variant="outline">{additionalImagePreviews.length}/4 imágenes</Badge>
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        onChange={handleAddAdditionalImages}
                        className="hidden"
                        multiple
                      />
                      <Label
                        htmlFor="additionalImages"
                        className={`inline-flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted transition-colors ${
                          additionalImagePreviews.length >= 4 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        <span>
                          {additionalImagePreviews.length >= 4
                            ? "Máximo de imágenes alcanzado"
                            : `Agregar ${4 - additionalImagePreviews.length} imágenes más`}
                        </span>
                      </Label>
                    </div>

                    {additionalImagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {additionalImagePreviews.map((image: string, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={image}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                              width={400}
                              height={300}
                            />
                            <Button
                              type="button"
                              size={"icon"}
                              onClick={() => handleRemoveAdditionalImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/80"
                            >
                              <X className="w-4 h-4 text-white" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            </>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
