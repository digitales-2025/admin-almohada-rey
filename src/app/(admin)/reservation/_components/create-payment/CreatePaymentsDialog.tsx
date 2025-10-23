"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { usePayments } from "@/app/(admin)/payments/_hooks/use-payments";
import { CreatePaymentSchema, paymentSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import { PaymentDetailMethod, PaymentDetailType } from "@/app/(admin)/payments/_types/payment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useServices } from "@/hooks/use-services";
import { calculateStayNights } from "@/utils/peru-datetime";
import { useAdvancedReservations } from "../../_hooks/useAdvancedReservations";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import CreatePaymentsForm from "./CreatePaymentsForm";
import { PaymentHeader } from "./PaymentHeader";
import { StepsSidebar } from "./PaymentStepsSidebar";

interface CreatePaymentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reservation: DetailedReservation;
}

export function CreatePaymentDialog({ open, setOpen, reservation }: CreatePaymentDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 920px)");
  const { dataServicesAll } = useServices();
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreatePayment, isSuccessCreatePayment } = usePayments();
  // Usar el hook avanzado para obtener el refetch
  const { refetch } = useAdvancedReservations({
    initialPagination: { page: 1, pageSize: 10 },
  });
  const [step, setStep] = useState(1);

  const nights = calculateStayNights(reservation.checkInDate, reservation.checkOutDate);

  const form = useForm<CreatePaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: "",
      description: "Pago por habitación",
      roomId: reservation.room.id,
      days: nights > 0 ? nights : 1,
      unitPrice: reservation.room.RoomTypes.price,
      subtotal: 0,
      extraServices: [],
      method: PaymentDetailMethod.CREDIT_CARD,
      totalAmount: 0,
    },
  });

  // Watch values for calculations
  const watchRoomUnitPrice = form.watch("unitPrice");
  const watchDays = form.watch("days");
  const watchExtraServices = form.watch("extraServices");

  // Calculate total amount (room + extras)
  const calculateTotalAmount = () => {
    const roomSubtotal = form.getValues("subtotal");
    const extrasTotal = watchExtraServices.reduce((sum, service) => sum + service.subtotal, 0);
    form.setValue("totalAmount", roomSubtotal + extrasTotal);
  };

  // Calculate room subtotal
  const calculateRoomSubtotal = () => {
    const subtotal = watchRoomUnitPrice * watchDays;
    form.setValue("subtotal", subtotal);
    calculateTotalAmount();
  };

  // Update calculations when values change
  useEffect(() => {
    calculateRoomSubtotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchRoomUnitPrice, watchDays]);

  useEffect(() => {
    calculateTotalAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchExtraServices, form.getValues("subtotal")]);

  const onSubmit = async (values: CreatePaymentSchema) => {
    // Calcular el monto total de la reserva (habitación)
    const roomAmount = nights * reservation.room.RoomTypes.price;

    // Calcular el monto total de los servicios extra
    const extraServicesAmount = values.extraServices.reduce(
      (sum, service) => sum + service.quantity * service.unitPrice,
      0
    );

    // Monto total que incluye habitación + servicios extra
    const totalReservationAmount = roomAmount + extraServicesAmount;

    // Determinar si el método de pago es PENDING_PAYMENT
    const isPendingPayment = values.method === PaymentDetailMethod.PENDING_PAYMENT;

    // Procesar los detalles de servicios
    const serviceDetails = values.extraServices.map((service) => ({
      paymentDate: values.paymentDate,
      description: `Servicio: ${service.name}`,
      type: PaymentDetailType.EXTRA_SERVICE,
      method: values.method,
      serviceId: service.id,
      quantity: service.quantity,
      unitPrice: service.unitPrice,
      // Si es pago pendiente, el subtotal es 0
      subtotal: isPendingPayment ? 0 : service.subtotal,
    }));

    // Detalle de pago para la habitación
    const roomDetail = {
      paymentDate: values.paymentDate,
      description: values.description || "Pago por habitación",
      type: PaymentDetailType.ROOM_RESERVATION,
      method: values.method,
      roomId: values.roomId,
      days: values.days,
      unitPrice: values.unitPrice,
      // Si es pago pendiente, el subtotal es 0
      subtotal: isPendingPayment ? 0 : values.subtotal,
    };

    // Transformar datos al formato esperado por la API
    const transformedPaymentData = {
      // El amount siempre incluye el monto total (habitación + servicios), independientemente del método de pago
      amount: totalReservationAmount,
      // Si es pago pendiente, el amountPaid es 0
      amountPaid: isPendingPayment ? 0 : values.totalAmount,
      reservationId: reservation.id,
      observations: values.observations || undefined,
      paymentDetail: [
        // Detalles de pago para la habitación
        roomDetail,
        // Detalles de pago para servicios extra
        ...serviceDetails,
      ],
    };

    startCreateTransition(() => {
      onCreatePayment(transformedPaymentData);
    });
  };

  useEffect(() => {
    if (isSuccessCreatePayment) {
      setOpen(false);
      refetch();
      // Reset form and step
      form.reset();
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreatePayment]);

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(["paymentDate", "description", "roomId", "days", "unitPrice"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const method = form.getValues("method");
      if (method) {
        setStep(3);
      } else {
        form.setError("method", {
          type: "required",
          message: "Debes seleccionar un método de pago",
        });
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Componente común para los botones de navegación
  const NavigationButtons = () => (
    <div className="flex justify-between pt-4 border-t mt-6 w-full">
      {step > 1 ? (
        <Button type="button" variant="outline" onClick={prevStep} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Atras
        </Button>
      ) : (
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      )}

      {step < 3 ? (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Prevenir cualquier comportamiento por defecto
            nextStep();
          }}
          className="gap-1"
        >
          Continuar <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button disabled={isCreatePending}>
          {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
          Crear Pago
        </Button>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Crear Pago</DialogTitle>
            <DialogDescription>Crea un nuevo pago para la reserva</DialogDescription>
          </DialogHeader>

          <div className="flex h-full">
            {/* Left sidebar with steps */}
            <StepsSidebar isDesktop={isDesktop} step={step} setStep={setStep} />

            {/* Main content */}
            <div className="flex-1 max-h-[80vh] overflow-y-auto">
              <div className="px-6 pt-6 pb-0">
                <PaymentHeader step={step} />
              </div>

              <ScrollArea className="h-full max-h-[65vh]">
                <div className="px-6">
                  <CreatePaymentsForm
                    form={form}
                    onSubmit={onSubmit}
                    step={step}
                    reservation={reservation}
                    dataServicesAll={dataServicesAll}
                    calculateTotalAmount={calculateTotalAmount}
                    nights={nights}
                    watchExtraServices={watchExtraServices}
                  >
                    <DialogFooter>
                      <NavigationButtons />
                    </DialogFooter>
                  </CreatePaymentsForm>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="pb-2">
          <DrawerTitle className="sr-only">Crear Pago</DrawerTitle>
          <DrawerDescription className="sr-only">Crea un nuevo pago para la reserva</DrawerDescription>
          <PaymentHeader step={step} />
        </DrawerHeader>

        <div className="px-4 pb-0 flex">
          <StepsSidebar isDesktop={isDesktop} step={step} setStep={setStep} />

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[60vh]">
              <div className="px-4">
                <CreatePaymentsForm
                  form={form}
                  onSubmit={onSubmit}
                  step={step}
                  reservation={reservation}
                  dataServicesAll={dataServicesAll}
                  calculateTotalAmount={calculateTotalAmount}
                  nights={nights}
                  watchExtraServices={watchExtraServices}
                >
                  <DrawerFooter className="px-0">
                    <NavigationButtons />
                  </DrawerFooter>
                </CreatePaymentsForm>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
