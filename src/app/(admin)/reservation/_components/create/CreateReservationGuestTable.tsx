"use client";

import { useState } from "react";
import { ChevronRight, MapPin, Save, Trash2, User, UserPlus, X } from "lucide-react";
import { type UseFieldArrayReturn, type UseFormRegister, type UseFormReturn, type UseFormWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";
import type { CreateReservationInput, DetailedRoom } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { steps } from "../../_utils/reservationPayment.utils";
import AdditionalInformation from "./guest/AdditionalInformation";
import ContactStep from "./guest/ContactStep";
import DocumentStep from "./guest/DocumentStep";
import NotGuestsMessage from "./guest/NotGuestsMessage";
import PersonalDataStep from "./guest/PersonalDataStep";

interface CreateReservationGuestTableProps {
  controlledFieldArray: UseFieldArrayReturn<CreateReservationInput>;
  register: UseFormRegister<CreateReservationInput>;
  form: UseFormReturn<CreateReservationInput>;
  watch: UseFormWatch<CreateReservationInput>;
  handleAddGuest: () => void;
  handleRemoveGuest: (index: number) => void;
  guestNumber: number;
  selectedRoom: DetailedRoom | undefined;
}

export default function CreateReservationGuestTable({
  controlledFieldArray,
  form,
  handleAddGuest,
  handleRemoveGuest,
  guestNumber,
  watch,
  register,
  selectedRoom,
}: CreateReservationGuestTableProps) {
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

  const maxGuests = selectedRoom?.RoomTypes?.guests || 4;
  const isMaxGuestsReached = maxGuests ? guestNumber >= maxGuests - 1 : false;

  // Función para calcular el porcentaje de completitud
  const calculateCompletionPercentage = (index: number) => {
    const guest = watchFieldArray?.[index];
    if (!guest) return 0;

    let fields = 0;
    let completedFields = 0;

    if (FORMSTATICS.guests.subFields?.name?.required) {
      fields++;
      if (guest.name) completedFields++;
    }

    if (FORMSTATICS.guests.subFields?.age?.required) {
      fields++;
      if (guest.age) completedFields++;
    }

    if (FORMSTATICS.guests.subFields?.documentType?.required) {
      fields++;
      if (guest.documentType) completedFields++;
    }

    if (FORMSTATICS.guests.subFields?.documentId?.required) {
      fields++;
      if (guest.documentId) completedFields++;
    }

    if (FORMSTATICS.guests.subFields?.phone?.required) {
      fields++;
      if (guest.phone) completedFields++;
    }

    if (FORMSTATICS.guests.subFields?.email?.required) {
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

  return (
    <div className="space-y-8 sm:col-span-2">
      {/* Título y descripción */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Gestión de Huéspedes</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Administre la información de los huéspedes para esta reserva
        </p>
      </div>

      {/* Visualización de huéspedes como avatares */}
      <div className="relative overflow-hidden rounded-lg border shadow-sm p-6 bg-card">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-muted rounded-lg px-3 py-1.5 text-sm font-medium">
            Habitación {selectedRoom?.number || "Seleccionada"}
          </div>
          <div className="bg-muted rounded-lg px-3 py-1.5 text-sm font-medium">
            {controlledFields.length + 1} / {maxGuests} huéspedes
          </div>
        </div>

        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Huésped principal */}
            <div className="relative">
              <div className="relative bg-sidebar rounded-lg p-4 border-2 border-sidebar-primary shadow-sm flex flex-col items-center justify-center aspect-square">
                <div className="absolute -top-3 -right-3 bg-sidebar-primary text-sidebar-primary-foreground rounded-full p-1.5 shadow-sm">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="h-12 w-12 rounded-full bg-sidebar-accent flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-sidebar-primary" />
                </div>
                <span className="font-medium text-sm text-center mb-2">Huésped Principal</span>
                <span className="text-xs text-muted-foreground text-center">Titular de la reserva</span>
              </div>
            </div>

            {/* Huéspedes adicionales */}
            {Array.from({ length: maxGuests - 1 }).map((_, idx) => {
              const guest = controlledFields[idx];
              const completionPercentage = guest ? calculateCompletionPercentage(idx) : 0;
              const isComplete = completionPercentage === 100;

              return (
                <div key={idx} className="relative">
                  <div
                    className={`relative ${guest ? "bg-card" : "bg-muted/50"} rounded-lg p-4 border-2 ${
                      guest ? (isComplete ? "border-green-500" : "border-amber-500") : "border-dashed border-border"
                    } shadow-sm flex flex-col items-center justify-center aspect-square cursor-pointer transition-all hover:shadow-md`}
                    onClick={() => {
                      if (guest) {
                        setActiveGuest(idx);
                        setActiveStep(0);
                      } else if (!isMaxGuestsReached) {
                        handleAddGuest();
                        setTimeout(() => {
                          setActiveGuest(controlledFields.length);
                          setActiveStep(0);
                        }, 100);
                      }
                    }}
                  >
                    {guest ? (
                      <>
                        {/* Botón de eliminar para huéspedes existentes */}
                        <Button
                          type="button"
                          className="absolute -top-3 -right-3 rounded-full"
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
                          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                            <User className={`h-6 w-6`} />
                          </div>
                        </div>
                        <span className="font-medium text-sm text-center line-clamp-1">
                          {guest.name || "Sin nombre"}
                        </span>
                        <span className="text-xs text-muted-foreground text-center">
                          {completionPercentage}% completo
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2 border-2 border-dashed border-border">
                          <UserPlus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-sm">Añadir Huésped</span>
                        <span className="text-xs text-muted-foreground">Haz clic para agregar</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      </div>

      {/* Panel de edición de huésped con pasos */}
      {activeGuest !== null && activeGuest < controlledFields.length && activeStep !== null && (
        <div className="bg-card rounded-lg border shadow-md overflow-hidden">
          {/* Cabecera con pasos */}
          <div className="bg-sidebar p-4">
            <div className="flex justify-between items-center text-sidebar-foreground mb-4">
              <h3 className="font-bold text-lg">Huésped {activeGuest + 1}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  onClick={() => {
                    setActiveGuest(null);
                    setActiveStep(null);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cerrar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 justify-between">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  className={`flex flex-col items-center cursor-pointer hover:bg-accent py-2 ${
                    idx === activeStep ? "text-sidebar-foreground" : "text-sidebar-foreground/60"
                  } transition-colors`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center mb-1 ${
                      idx === activeStep ? "bg-sidebar-primary text-sidebar-primary-foreground" : "bg-sidebar-accent/20"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido del paso actual */}
          <div className="p-6">
            {activeStep === 0 && <PersonalDataStep activeGuest={activeGuest} form={form} register={register} />}

            {activeStep === 1 && (
              <DocumentStep
                activeGuest={activeGuest}
                controlledFieldArray={controlledFieldArray}
                form={form}
                register={register}
                watch={watch}
              />
            )}

            {activeStep === 2 && <ContactStep activeGuest={activeGuest} form={form} register={register} />}

            {activeStep === 3 && <AdditionalInformation activeGuest={activeGuest} form={form} register={register} />}
          </div>

          {/* Navegación entre pasos */}
          <div className="bg-muted/20 p-4 flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Anterior
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => handleGuestComplete()}
                className="text-white hover:bg-[var(--chart-4)]/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar y cerrar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay huéspedes */}
      {controlledFields.length === 0 && !activeGuest && !isMaxGuestsReached && (
        <NotGuestsMessage
          handleAddGuest={handleAddGuest}
          isMaxGuestsReached={isMaxGuestsReached}
          setActiveGuest={setActiveGuest}
          setActiveStep={setActiveStep}
        />
      )}

      {/* Mensaje de error global */}
      {form.formState.errors.guests && (
        <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
          <FormMessage className="text-destructive">{form.formState.errors.guests.message}</FormMessage>
        </div>
      )}
    </div>
  );
}
