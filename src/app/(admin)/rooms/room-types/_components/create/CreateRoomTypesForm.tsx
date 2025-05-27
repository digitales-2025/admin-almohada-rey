import React from "react";
import { Bed, CreditCard, User2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
/* import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; */
import { Textarea } from "@/components/ui/textarea";
import { CreateRoomTypeSchema } from "../../_schema/roomTypesSchema";
/* import { FloorTypeEnum } from "../../_types/roomTypes";
import { FloorTypeLabels } from "../../_utils/roomTypes.utils"; */
import { CreateRoomTypeImagesManager } from "./CreateRoomTypeImagesManager";

interface CreateRoomTypeFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateRoomTypeSchema>;
  onSubmit: (data: CreateRoomTypeSchema) => void;
}

export default function CreateRoomTypeForm({ children, form, onSubmit }: CreateRoomTypeFormProps) {
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

  // Función personalizada para manejar el envío
  const handleFormSubmit = (data: CreateRoomTypeSchema) => {
    // Continuar con el envío normal
    onSubmit(data);
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
                <FormDescription>Obligatorio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nameEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre (en inglés)</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Bed} placeholder="Ej: Presidential Suite" {...field} />
                </FormControl>
                <FormDescription>Opcional (Para la Landing)</FormDescription>
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
                <FormDescription>Obligatorio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    min={1}
                    max={10000} 
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
                <FormDescription>Obligatorio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*          <FormField
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
*/}
          <FormField
            control={form.control}
            name="bed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cama</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Bed} placeholder="Ej: King size con colchón ortopédico" {...field} />
                </FormControl>
                <FormDescription>Obligatorio</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedEn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cama (en inglés)</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Bed} placeholder="Ej: King size con colchón ortopédico" {...field} />
                </FormControl>
                <FormDescription>Opcional (Para la Landing)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*     <FormField
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
          />*/}
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
              <FormDescription>Obligatorio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (en inglés)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe las características de este tipo de habitación..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Obligatorio</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Componente de gestión de imágenes */}
        <CreateRoomTypeImagesManager form={form} />

        {children}
      </form>
    </Form>
  );
}
