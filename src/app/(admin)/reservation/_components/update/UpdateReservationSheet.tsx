"use client";

import type React from "react";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

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
import { formatPeruBookingDate, formatTimeToHHMMAMPM, formDateToPeruISO } from "@/utils/peru-datetime";
import { UpdateParams, useReservation } from "../../_hooks/use-reservation";
import {
  DetailedReservation,
  ReservationGuest,
  UpdateReservationInput,
  updateReservationSchema,
} from "../../_schemas/reservation.schemas";
// import { useCustomers } from "../../_hooks/use-customers";
// import { customersSchema, type CreateCustomersSchema } from "../../_schema/createCustomersSchema";
// import { type Customer } from "../../_types/customer";
import UpdateReservationForm from "./UpdateReservationForm";

const infoSheet = {
  title: "Actualizar Reservación",
  description: "Actualiza la información de la reserva y guarda los cambios",
};

interface UpdateReservationSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  reservation: DetailedReservation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateReservationSheet({ reservation, open, onOpenChange }: UpdateReservationSheetProps) {
  // Obtener fechas actuales en formato Perú
  const today = new Date();
  // const tomorrow = new Date(today);
  // Formatear fechas en formato yyyy-MM-dd
  const todayFormatted = today.toISOString().split("T")[0];
  // Para la fecha de reservación (ahora)
  const reservationDateISO = formDateToPeruISO(todayFormatted, true, formatTimeToHHMMAMPM(new Date()));

  const { onUpdateReservation, updateReservationResponse } = useReservation();

  const defaultFormValues = {
    status: reservation.status ?? "PENDING",
    customerId: reservation.customerId ?? undefined,
    roomId: reservation.roomId ?? undefined,
    userId: reservation.userId ?? undefined,
    reservationDate: reservation.reservationDate ?? reservation.createdAt ?? reservationDateISO,
    checkInDate: reservation.checkInDate ?? undefined,
    checkOutDate: reservation.checkOutDate ?? undefined,
    guests: reservation.guests ? (JSON.parse(reservation.guests) as ReservationGuest[]) : [],
    origin: reservation.origin ?? undefined,
    reason: reservation.reason ?? undefined,
    observations: reservation.observations ?? undefined,
  };

  const form = useForm<UpdateReservationInput>({
    resolver: zodResolver(updateReservationSchema, undefined, {
      raw: true,
    }),
    defaultValues: defaultFormValues,
  });

  const formControl = form.control;

  const fieldArray = useFieldArray({
    control: formControl,
    name: "guests",
    rules: {
      minLength: 1,
    },
  });

  const customOnOpenChange = (open: boolean) => {
    form.reset();
    fieldArray.remove();
    onOpenChange(open);
  };

  useEffect(() => {
    if (updateReservationResponse.isSuccess) {
      form.reset();
      fieldArray.remove();
      customOnOpenChange(false);
      // setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateReservationResponse.isSuccess]);

  const onSubmit = async (input: UpdateReservationInput) => {
    const params: UpdateParams = {
      id: reservation.id,
      data: input,
    };
    onUpdateReservation(params);
  };

  const formattedReservationDate = formatPeruBookingDate(reservation.reservationDate);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge
              className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200 hover:bg-emerald-200"
              variant="secondary"
            >
              Reserva de {formattedReservationDate.localeDateString}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateReservationForm
            form={form}
            onSubmit={onSubmit}
            controlledFieldArray={fieldArray}
            reservation={reservation}
          >
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2 justify-center">
                <Button type="submit" disabled={updateReservationResponse.isLoading}>
                  {updateReservationResponse.isLoading && (
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateReservationForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
