"use client";

import React from "react";
import { format, parse } from "date-fns";
import { Calendar, Clock, Edit3, Eye, Plus, Save, Trash2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CustomerReservationHitoryFormData } from "../../_schema/createCustomerReservationHistorySchema";
import { CustomerReservationHistoryResponse } from "../../_types/customer-reservation-history";
import { formatDate, getRelativeTime } from "../../_utils/customer-reservation-history.utils";

type DialogMode = "archive" | "create" | "edit" | "view";

interface ManagePastReservationsFormProps {
  mode: DialogMode;
  selectedReservation: CustomerReservationHistoryResponse | null;
  form: UseFormReturn<CustomerReservationHitoryFormData>;
  onSubmit: (data: CustomerReservationHitoryFormData) => Promise<void>;
  onBackToCreate: () => void;
  onEdit: (reservation: CustomerReservationHistoryResponse) => void;
  onDelete: (reservation: CustomerReservationHistoryResponse) => void;
}

export function ManagePastReservationsForm({
  mode,
  selectedReservation,
  form,
  onSubmit,
  onBackToCreate,
  onEdit,
  onDelete,
}: ManagePastReservationsFormProps) {
  return (
    <div className="space-y-4">
      {/* Header dinámico */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2">
          {mode === "create" && <Plus className="h-4 w-4 text-primary" />}
          {mode === "edit" && <Edit3 className="h-4 w-4 text-primary" />}
          {mode === "view" && <Eye className="h-4 w-4 text-primary" />}
          <span className="text-base font-medium">
            {mode === "create" && "Agregar Fecha"}
            {mode === "edit" && "Editar Fecha"}
            {mode === "view" && "Ver Detalles"}
          </span>
        </div>
        {(mode === "edit" || mode === "view") && (
          <Button variant="ghost" size="sm" onClick={onBackToCreate} className="gap-1 text-xs">
            <Plus className="h-3 w-3" />
            Nuevo
          </Button>
        )}
      </div>

      {/* Contenido dinámico */}
      {mode === "view" && selectedReservation && (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-accent/10">
            <div className="space-y-3">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Fecha de Reserva
                  </Label>
                  <p className="text-base">{formatDate(selectedReservation.date)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Tiempo Transcurrido
                  </Label>
                  <p className="text-sm text-primary">{getRelativeTime(selectedReservation.date)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => onDelete(selectedReservation)} className="gap-2 flex-1">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
            <Button onClick={() => onEdit(selectedReservation)} className="gap-2 flex-1">
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      )}

      {(mode === "create" || mode === "edit") && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-4 border rounded-lg bg-accent/5">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">Fecha de Reserva Pasada</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = format(date, "yyyy-MM-dd");
                            field.onChange(formattedDate);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-2">Solo fechas pasadas del historial del cliente</p>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="gap-2 flex-1">
                <Save className="h-4 w-4" />
                {mode === "create" ? "Agregar" : "Guardar"}
              </Button>
              {mode === "edit" && (
                <Button type="button" variant="outline" onClick={onBackToCreate} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
