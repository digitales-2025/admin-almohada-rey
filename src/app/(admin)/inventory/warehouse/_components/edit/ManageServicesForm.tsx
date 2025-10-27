"use client";

import { useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Edit, FileText, RefreshCcw, Save, Settings, Tag, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { TextareaWithIcon } from "@/components/form/TextareaWithIcon";
import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useServices } from "@/hooks/use-services";
import { Service } from "@/types/services";
import { EditServiceSchema, editServiceSchema } from "../../_schemas/editServiceSchema";

interface ManageServicesFormProps {
  service: Service;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ManageServicesForm({
  service,
  isEditing,
  onEdit,
  onCancel,
  onSuccess,
}: ManageServicesFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const { onUpdateService, isSuccessUpdateService } = useServices();

  const form = useForm<EditServiceSchema>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: {
      name: service.name,
      description: service.description,
      price: service.price,
    },
  });

  const handleCancel = () => {
    form.reset({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    onCancel(); // Llamar la función onCancel del diálogo padre
  };

  const handleSave = async (data: EditServiceSchema) => {
    startUpdateTransition(() => {
      onUpdateService({ ...data, id: service.id });
    });
  };

  useEffect(() => {
    if (isSuccessUpdateService) {
      form.reset();
      onSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateService]);

  return (
    <div className="flex flex-col h-full">
      {/* Header del panel */}
      <div className="px-4 py-4 border-b bg-gradient-to-r from-muted/50 to-muted/30 dark:from-muted/30 dark:to-muted/20">
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {isEditing ? "Editar Servicio" : "Detalles del Servicio"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEditing ? "Modifica la información del servicio" : "Información completa del servicio"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <Button onClick={onEdit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Edit className="h-4 w-4 mr-2" />
                Editar Servicio
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del panel */}
      <div className="flex-1 overflow-y-auto p-6 px-4">
        {isEditing ? (
          <div className="max-w-2xl">
            <Form {...form}>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Servicio</FormLabel>
                        <FormControl>
                          <InputWithIcon Icon={Tag} placeholder="Ingrese el nombre del servicio" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <TextareaWithIcon
                            {...field}
                            Icon={FileText}
                            placeholder="Ingrese la descripción del servicio"
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
                        <FormLabel>Precio (S/)</FormLabel>
                        <FormControl>
                          <InputWithIcon
                            Icon={Banknote}
                            type="number"
                            min={0.01}
                            step={0.01}
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Botones de acción al final del formulario */}
                <div className="flex gap-2 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={form.handleSubmit(handleSave)}
                    disabled={!form.formState.isValid || isUpdatePending}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isUpdatePending ? (
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Nombre
                </label>
                <div className="p-2 bg-muted/50 rounded-lg border">
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-primary" />
                  Precio
                </label>
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-bold text-primary">S/ {service.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Descripción
              </label>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Código del Servicio
              </label>
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-mono font-medium text-primary">{service.code}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
