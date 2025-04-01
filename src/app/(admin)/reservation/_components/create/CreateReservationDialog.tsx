"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createPeruBookingDateTime, formatTimeToHHMMAMPM, formDateToPeruISO } from "@/utils/peru-datetime";
import { useReservation } from "../../_hooks/use-reservation";
import { CreateReservationInput, createReservationSchema } from "../../_schemas/reservation.schemas";
import CreateReservationForm from "./CreateReservationForm";

const dataForm = {
  button: "Nueva reservación",
  title: "Crear Reservación",
  description: "Complete los detalles a continuación para registrar una nueva reservación.",
};

export function CreateReservationDialog() {
  // Obtener fechas actuales en formato Perú
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Formatear fechas en formato yyyy-MM-dd
  const todayFormatted = today.toISOString().split("T")[0];
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  const dayAfterTomorrowFormatted = dayAfterTomorrow.toISOString().split("T")[0];

  // Crear fechas en formato ISO con zonas horarias correctas
  const { checkIn, checkOut } = createPeruBookingDateTime(tomorrowFormatted, dayAfterTomorrowFormatted); // POdemos definir horas especificas, pero sino, se toman las predefinidas

  // Para la fecha de reservación (ahora)
  const reservationDateISO = formDateToPeruISO(todayFormatted, true, formatTimeToHHMMAMPM(new Date()));

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateReservation, createReservationResponse } = useReservation();
  const router = useRouter();
  const { user } = useProfile();

  //   {
  //     status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELED";
  //     customerId: string;
  //     roomId: string;
  //     userId: string;
  //     reservationDate: string;
  //     checkInDate: string;
  //     checkOutDate: string;
  //     guests?: {
  //         ...;
  //     }[] | undefined;
  //     observations?: string | undefined;
  // }
  const form = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationSchema, undefined, {
      raw: true,
    }),
    defaultValues: {
      status: "PENDING",
      customerId: undefined,
      roomId: undefined,
      userId: undefined,
      reservationDate: reservationDateISO,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: [],
      origin: "",
      reason: "",
      observations: undefined,
    },
  });

  const formControl = form.control;

  const fieldArray = useFieldArray({
    control: formControl,
    name: "guests",
    rules: {
      minLength: 1,
    },
  });
  // const { remove } = fieldArray;

  useEffect(() => {
    if (createReservationResponse.isSuccess) {
      form.reset();
      fieldArray.remove();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createReservationResponse.isSuccess]);

  if (!user) {
    router.push("/log-in");
    return <div>Cargando...</div>;
  } else {
    form.setValue("userId", user.id);
  }

  const onOpenChange = (open: boolean) => {
    form.reset();
    fieldArray.remove();
    setOpen(open);
  };

  const onSubmit = async (input: CreateReservationInput) => {
    startCreateTransition(() => {
      onCreateReservation(input);
    });
  };

  const handleClose = () => {
    form.reset();
    fieldArray.remove();
    setOpen(false);
  };

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            {dataForm.button}
          </Button>
        </DialogTrigger>
        <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              <CreateReservationForm form={form} onSubmit={onSubmit} controlledFieldArray={fieldArray}>
                <DialogFooter className="w-full">
                  <div className="flex gap-2 w-full">
                    <DialogClose asChild>
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button disabled={isCreatePending} className="w-full">
                      {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      Registrar
                    </Button>
                  </div>
                </DialogFooter>
              </CreateReservationForm>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          {dataForm.button}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
        </DrawerHeader>

        {/* The key fix is in this ScrollArea configuration */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[40vh] px-0">
            <div className="px-4">
              <CreateReservationForm form={form} onSubmit={onSubmit} controlledFieldArray={fieldArray}>
                <DrawerFooter className="px-0 pt-2">
                  <Button disabled={isCreatePending} className="w-full">
                    {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    Registrar
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full" onClick={handleClose}>
                      Cancelar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </CreateReservationForm>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
