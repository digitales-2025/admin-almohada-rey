"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { usePayments } from "@/app/(admin)/payments/_hooks/use-payments";
import {
  CreateRoomPaymentDetailSchema,
  roomPaymentDetailSchema,
} from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import { PaymentDetailMethod, PaymentDetailType, SummaryPayment } from "@/app/(admin)/payments/_types/payment";
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
import CreatePaymentsForm from "./CreatePaymentDetailRoomForm";
import CreatePaymentDetailRoomForm from "./CreatePaymentDetailRoomForm";
import { PaymentDetailRoomHeader } from "./PaymentDetailRoomHeader";
import { PaymentDetailRoomStepsSidebar } from "./PaymentDetailRoomStepsSidebar";

interface CreatePaymentDetailRoomDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  payment: SummaryPayment;
}

export function CreatePaymentDetailRoomDialog({ open, setOpen, payment }: CreatePaymentDetailRoomDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 920px)");
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreatePaymentDetails, isSuccessCreatePaymentDetails } = usePayments();
  const [step, setStep] = useState(1);
  const { roomPaymentDetailsByPaymentId } = usePayments({
    idPaymentRoomDetails: payment.id as string,
  });

  const nights = Number(roomPaymentDetailsByPaymentId?.missingDays) || 0;

  const form = useForm<CreateRoomPaymentDetailSchema>({
    resolver: zodResolver(roomPaymentDetailSchema),
    defaultValues: {
      paymentDate: "",
      description: "Pago por habitación",
      roomId: roomPaymentDetailsByPaymentId?.reservation?.room?.id || "",
      days: nights,
      unitPrice: Number(roomPaymentDetailsByPaymentId?.reservation?.room?.RoomTypes?.price) || 0,
      subtotal: 0,
      method: PaymentDetailMethod.CREDIT_CARD,
      totalAmount: 0,
    },
  });

  // Watch values for calculations
  const watchRoomUnitPrice = form.watch("unitPrice");
  const watchDays = form.watch("days");

  // Calculate room subtotal
  const calculateRoomSubtotal = () => {
    const unitPrice = Number(watchRoomUnitPrice) || 0;
    const days = Number(watchDays) || 0;
    const subtotal = unitPrice * days;

    // Sólo actualiza si es un número válido
    if (!isNaN(subtotal)) {
      form.setValue("subtotal", subtotal);
      form.setValue("totalAmount", subtotal);
    }
  };

  // Update calculations when values change
  useEffect(() => {
    calculateRoomSubtotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchRoomUnitPrice, watchDays]);

  // Añade este useEffect después de declarar el form
  useEffect(() => {
    if (open && roomPaymentDetailsByPaymentId) {
      // Forzar el cálculo inicial cuando se abre el diálogo
      const price = Number(roomPaymentDetailsByPaymentId?.reservation?.room?.RoomTypes?.price) || 0;
      const days = Number(roomPaymentDetailsByPaymentId?.missingDays) || 0;
      const initialSubtotal = price * days;

      form.setValue("unitPrice", price);
      form.setValue("days", days);
      form.setValue("subtotal", initialSubtotal);
      form.setValue("totalAmount", initialSubtotal);
      form.setValue("roomId", roomPaymentDetailsByPaymentId?.reservation?.room?.id || "");
    }
  }, [open, roomPaymentDetailsByPaymentId]);

  const onSubmit = async (values: CreateRoomPaymentDetailSchema) => {
    // Determinar si el método de pago es PENDING_PAYMENT
    const isPendingPayment = values.method === PaymentDetailMethod.PENDING_PAYMENT;

    // Detalle de pago para la habitación como un array con un solo elemento
    const paymentDetail = [
      {
        paymentDate: values.paymentDate,
        description: values.description || "Pago por habitación",
        type: PaymentDetailType.ROOM_RESERVATION,
        method: values.method,
        roomId: values.roomId,
        days: Number(values.days) || 0,
        unitPrice: Number(values.unitPrice) || 0,
        // Si es pago pendiente, el subtotal es 0
        subtotal: isPendingPayment ? 0 : Number(values.subtotal) || 0,
      },
    ];

    startCreateTransition(() => {
      onCreatePaymentDetails({
        paymentId: payment.id,
        paymentDetail,
      });
    });
  };

  useEffect(() => {
    if (isSuccessCreatePaymentDetails) {
      setOpen(false);
      // Reset form and step
      form.reset();
      setStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreatePaymentDetails]);

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
            <PaymentDetailRoomStepsSidebar isDesktop={isDesktop} step={step} setStep={setStep} />

            {/* Main content */}
            <div className="flex-1 max-h-[80vh] overflow-y-auto">
              <div className="px-6 pt-6 pb-0">
                <PaymentDetailRoomHeader step={step} />
              </div>

              <ScrollArea className="h-full max-h-[65vh]">
                <div className="px-6">
                  <CreatePaymentDetailRoomForm
                    form={form}
                    onSubmit={onSubmit}
                    step={step}
                    roomPaymentDetailsByPaymentId={roomPaymentDetailsByPaymentId}
                    nights={nights}
                  >
                    <DialogFooter>
                      <NavigationButtons />
                    </DialogFooter>
                  </CreatePaymentDetailRoomForm>
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
          <PaymentDetailRoomHeader step={step} />
        </DrawerHeader>

        <div className="px-4 pb-0 flex">
          <PaymentDetailRoomStepsSidebar isDesktop={isDesktop} step={step} setStep={setStep} />

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[60vh]">
              <div className="px-4">
                <CreatePaymentsForm
                  form={form}
                  onSubmit={onSubmit}
                  step={step}
                  roomPaymentDetailsByPaymentId={roomPaymentDetailsByPaymentId}
                  nights={nights}
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
