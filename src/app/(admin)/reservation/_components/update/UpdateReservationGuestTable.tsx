"use client";

import { useState } from "react";
import { ChevronRight, CreditCard, Edit3, Phone, Save, Trash2, User, UserPlus, X } from "lucide-react";
import {
  Controller,
  type UseFieldArrayReturn,
  type UseFormRegister,
  type UseFormReturn,
  type UseFormWatch,
} from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DetailedRoom, DocumentType, UpdateReservationInput } from "../../_schemas/reservation.schemas";
import { UPDATE_FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";

interface UpdateReservationGuestTableProps {
  controlledFieldArray: UseFieldArrayReturn<UpdateReservationInput>;
  register: UseFormRegister<UpdateReservationInput>;
  form: UseFormReturn<UpdateReservationInput>;
  watch: UseFormWatch<UpdateReservationInput>;
  handleAddGuest: () => void;
  handleRemoveGuest: (index: number) => void;
  selectedRoom: DetailedRoom | undefined;
}

export default function UpdateReservationGuestTable({
  controlledFieldArray,
  form,
  handleAddGuest,
  handleRemoveGuest,
  watch,
  register,
  selectedRoom,
}: UpdateReservationGuestTableProps) {
  const { fields } = controlledFieldArray;
  const watchFieldArray = watch("guests");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activeGuest, setActiveGuest] = useState<number | null>(null);

  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });

  // Modifica estas líneas
  const maxGuests = selectedRoom?.RoomTypes?.guests || 4;
  const actualGuestCount = controlledFields.length;

  // Consideramos que hay un huésped principal (el que reserva) que no está en controlledFields
  const totalGuestCount = actualGuestCount + 1; // +1 por el huésped principal
  const remainingGuests = maxGuests ? Math.max(0, maxGuests - totalGuestCount) : 0;
  const isMaxGuestsReached = maxGuests ? totalGuestCount >= maxGuests : false;

  // Función para calcular el porcentaje de completitud
  const calculateCompletionPercentage = (index: number) => {
    const guest = watchFieldArray?.[index];
    if (!guest) return 0;

    let fields = 0;
    let completedFields = 0;

    if (UPDATE_FORMSTATICS.guests.subFields?.name?.required) {
      fields++;
      if (guest.name) completedFields++;
    }

    if (UPDATE_FORMSTATICS.guests.subFields?.age?.required) {
      fields++;
      if (guest.age) completedFields++;
    }

    if (UPDATE_FORMSTATICS.guests.subFields?.documentType?.required) {
      fields++;
      if (guest.documentType) completedFields++;
    }

    if (UPDATE_FORMSTATICS.guests.subFields?.documentId?.required) {
      fields++;
      if (guest.documentId) completedFields++;
    }

    if (UPDATE_FORMSTATICS.guests.subFields?.phone?.required) {
      fields++;
      if (guest.phone) completedFields++;
    }

    if (UPDATE_FORMSTATICS.guests.subFields?.email?.required) {
      fields++;
      if (guest.email) completedFields++;
    }

    return fields > 0 ? Math.round((completedFields / fields) * 100) : 0;
  };

  // Función para manejar la finalización de un huésped
  const handleGuestComplete = () => {
    setActiveGuest(null);
    setActiveStep(null);
  };

  // Pasos para el formulario de huésped
  const steps = [
    { id: "personal", title: "Datos Personales", icon: <User className="h-5 w-5" /> },
    { id: "document", title: "Documento", icon: <CreditCard className="h-5 w-5" /> },
    { id: "contact", title: "Contacto", icon: <Phone className="h-5 w-5" /> },
    { id: "additional", title: "Adicional", icon: <Edit3 className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8 sm:col-span-2">
      {/* Título y descripción */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Actualizar Huéspedes</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Modifique la información de los huéspedes para esta reserva
        </p>
      </div>

      {/* Visualización de huéspedes como avatares */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {controlledFields.map((field, idx) => {
          const completionPercentage = calculateCompletionPercentage(idx);
          const isComplete = completionPercentage === 100;

          return (
            <div key={field.id} className="relative">
              <div
                className={`relative bg-card rounded-lg p-3 border-2 ${
                  isComplete ? "border-green-500" : "border-amber-500"
                } shadow-sm flex flex-col items-center justify-center aspect-square cursor-pointer transition-all hover:shadow-md`}
                onClick={() => {
                  setActiveGuest(idx);
                  setActiveStep(0);
                }}
              >
                {/* Botón de eliminar para huéspedes existentes */}
                <Button
                  type="button"
                  className="absolute -top-2 -right-2 rounded-full"
                  size={"icon"}
                  variant={"destructive"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveGuest(idx);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </Button>
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2">
                    <User className={`h-5 w-5`} />
                  </div>
                </div>
                <span className="font-medium text-xs text-center line-clamp-1">{field.name || "Sin nombre"}</span>
                <span className="text-[10px] text-muted-foreground text-center">{completionPercentage}% completo</span>
              </div>
            </div>
          );
        })}

        {/* Botón para añadir huésped */}
        {!isMaxGuestsReached && (
          <div className="relative">
            <div
              className="relative bg-muted/50 rounded-lg p-3 border-2 border-dashed border-border shadow-sm flex flex-col items-center justify-center aspect-square cursor-pointer transition-all hover:shadow-md"
              onClick={handleAddGuest}
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-2 border-2 border-dashed border-border">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-xs">Añadir Huésped</span>
              <span className="text-[10px] text-muted-foreground">
                {remainingGuests} lugar{remainingGuests !== 1 ? "es" : ""} disponible{remainingGuests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Panel de edición de huésped con pasos */}
      {activeGuest !== null && activeGuest < controlledFields.length && activeStep !== null && (
        <div className="bg-card rounded-lg border shadow-md overflow-hidden mt-4 animate-in fade-in-0 zoom-in-95">
          {/* Cabecera con pasos */}
          <div className="bg-muted p-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-base">Huésped {activeGuest + 1}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveGuest(null);
                    setActiveStep(null);
                  }}
                  className="h-8 px-2"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cerrar
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  className={`flex flex-col items-center ${
                    idx === activeStep ? "text-foreground" : "text-muted-foreground"
                  } transition-colors`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${
                      idx === activeStep ? "bg-primary text-primary-foreground" : "bg-muted/50"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-medium hidden sm:block">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="p-4">
            {activeStep === 0 && (
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Nombre y Apellido</FormLabel>
                    <FormControl>
                      <Input {...register(`guests.${activeGuest}.name` as const)} />
                    </FormControl>
                    <CustomFormDescription
                      required={UPDATE_FORMSTATICS.guests.subFields?.name?.required ?? false}
                      validateOptionalField={true}
                    />
                    <FormMessage>
                      {form.formState.errors.guests?.[activeGuest]?.name &&
                        form.formState.errors.guests[activeGuest]?.name?.message}
                    </FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Edad</FormLabel>
                    <FormControl>
                      <Input
                        {...register(`guests.${activeGuest}.age` as const)}
                        type="number"
                        min={0}
                        placeholder="0"
                      />
                    </FormControl>
                    <CustomFormDescription
                      required={UPDATE_FORMSTATICS.guests.subFields?.age.required ?? false}
                      validateOptionalField={true}
                    />
                    <FormMessage>
                      {form.formState.errors.guests?.[activeGuest]?.age &&
                        form.formState.errors.guests[activeGuest]?.age?.message}
                    </FormMessage>
                  </FormItem>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="bg-muted/30 border border-border rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Documento de Identidad</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Necesitamos el documento oficial de identidad para registrar al huésped según las normativas
                        hoteleras.
                      </p>
                    </div>
                  </div>
                </div>

                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    {...register(`guests.${activeGuest}.documentType` as const)}
                    defaultValue={controlledFields[activeGuest].documentType}
                    onValueChange={(val) => {
                      form.setValue(`guests.${activeGuest}.documentType`, val as DocumentType);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={UPDATE_FORMSTATICS.guests.subFields?.documentType.placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.values(documentTypeStatusConfig).map((documentType, idx) => {
                          const Icon = documentType.icon || CreditCard;
                          return (
                            <SelectItem
                              key={`${documentType.value}-${idx}`}
                              value={documentType.value}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${documentType.textColor || "text-primary"}`} />
                                <span>{documentType.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <CustomFormDescription
                    required={UPDATE_FORMSTATICS.guests.subFields?.documentType?.required ?? false}
                    validateOptionalField={true}
                  />
                  <FormMessage>
                    {form.formState.errors.guests?.[activeGuest]?.documentType &&
                      form.formState.errors.guests[activeGuest]?.documentType?.message}
                  </FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input
                      disabled={!controlledFields[activeGuest].documentType}
                      {...register(`guests.${activeGuest}.documentId` as const)}
                    />
                  </FormControl>
                  <CustomFormDescription
                    required={UPDATE_FORMSTATICS.guests.subFields?.documentId.required ?? false}
                    validateOptionalField={true}
                  />
                  <FormMessage>
                    {form.formState.errors.guests?.[activeGuest]?.documentId &&
                      form.formState.errors.guests[activeGuest]?.documentId?.message}
                  </FormMessage>
                </FormItem>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <Controller
                      control={form.control}
                      name={`guests.${activeGuest}.phone`}
                      render={({ field: { onChange, value } }) => (
                        <FormControl>
                          <PhoneInput
                            defaultCountry="PE"
                            placeholder="Ingrese el número de teléfono"
                            value={value}
                            onChange={onChange}
                          />
                        </FormControl>
                      )}
                    />
                    <CustomFormDescription
                      required={UPDATE_FORMSTATICS.guests.subFields?.phone.required ?? false}
                      validateOptionalField={true}
                    />
                    <FormMessage>
                      {form.formState.errors.guests?.[activeGuest]?.phone &&
                        form.formState.errors.guests[activeGuest]?.phone?.message}
                    </FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...register(`guests.${activeGuest}.email` as const)} />
                    </FormControl>
                    <CustomFormDescription
                      required={UPDATE_FORMSTATICS.guests.subFields?.email.required ?? false}
                      validateOptionalField={true}
                    />
                    <FormMessage>
                      {form.formState.errors.guests?.[activeGuest]?.email &&
                        form.formState.errors.guests[activeGuest]?.email?.message}
                    </FormMessage>
                  </FormItem>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <FormItem>
                  <FormLabel>Información Adicional</FormLabel>
                  <FormControl>
                    <Textarea
                      {...register(`guests.${activeGuest}.additionalInfo` as const, {
                        setValueAs: (v) => (v === "" ? undefined : String(v)),
                      })}
                      placeholder="Preferencias, necesidades especiales, alergias, etc."
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <CustomFormDescription
                    required={UPDATE_FORMSTATICS.guests.subFields?.additionalInfo.required ?? false}
                    validateOptionalField={true}
                  />
                  <FormMessage>
                    {form.formState.errors.guests?.[activeGuest]?.additionalInfo &&
                      form.formState.errors.guests[activeGuest]?.additionalInfo?.message}
                  </FormMessage>
                </FormItem>
              </div>
            )}
          </div>

          {/* Navegación entre pasos */}
          <div className="bg-muted/20 p-3 flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              size="sm"
              className="h-8"
            >
              Anterior
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-8"
                size="sm"
              >
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => handleGuestComplete()}
                className="bg-green-500 text-white hover:bg-green/90 h-8"
                size="sm"
              >
                <Save className="mr-1 h-4 w-4" />
                Guardar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Botón para añadir huésped (versión móvil/alternativa) */}
      {!isMaxGuestsReached && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={handleAddGuest} className="border-dashed" size="sm" type="button">
            <UserPlus className="mr-2 h-4 w-4" />
            Añadir Huésped ({remainingGuests} disponible{remainingGuests !== 1 ? "s" : ""})
          </Button>
        </div>
      )}
    </div>
  );
}
