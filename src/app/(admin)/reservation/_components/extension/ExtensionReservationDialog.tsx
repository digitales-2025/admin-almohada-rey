"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, parseISO } from "date-fns";
import { CalendarClock, CalendarDays } from "lucide-react";
import { useForm } from "react-hook-form";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DEFAULT_EXTENDED_CHECKOUT_TIME } from "@/utils/peru-datetime";
import useExtendReservation from "../../_hooks/use-extend-reservation";
import {
  extendStaySchema,
  lateCheckoutSchema,
  type CreateExtendStay,
  type CreateLateCheckout,
} from "../../_schemas/extension-reservation.schemas";
import type { DetailedReservation } from "../../_schemas/reservation.schemas";
import ExtensionReservationForm from "./ExtensionReservationForm";
import SideBarExtensionReservationDialog from "./SideBarExtensionReservationDialog";

interface ExtensionReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: DetailedReservation;
}

export function ExtensionReservationDialog({ open, onOpenChange, reservation }: ExtensionReservationDialogProps) {
  // Use media query to detect mobile screens
  const isMobile = useMediaQuery("(max-width: 950px)");

  // Destructuring de las funciones y estados del hook de extensión
  const {
    onApplyLateCheckout,
    isLoadingLateCheckout,
    isSuccessLateCheckout,
    onExtendStay,
    isLoadingExtendStay,
    isSuccessExtendStay,
  } = useExtendReservation();

  // Estado para transiciones en UI
  const [isPendingLateCheckout, startLateCheckoutTransition] = useTransition();
  const [isPendingExtendStay, startExtendStayTransition] = useTransition();

  // Determinar si el Late Checkout ya ha sido aplicado
  const lateCheckoutApplied = Boolean(reservation.appliedLateCheckOut);

  // Si el late checkout ya está aplicado, empezar con la pestaña de extend-stay
  const [selectedTab, setSelectedTab] = useState<"late-checkout" | "extend-stay">(
    lateCheckoutApplied ? "extend-stay" : "late-checkout"
  );

  const [renderCount, setRenderCount] = useState(0);

  // Estado de procesamiento combinado
  const isProcessing = isLoadingLateCheckout || isLoadingExtendStay || isPendingLateCheckout || isPendingExtendStay;

  // Formulario para Late Checkout
  const lateCheckoutForm = useForm<CreateLateCheckout>({
    resolver: zodResolver(lateCheckoutSchema),
    defaultValues: {
      lateCheckoutTime: DEFAULT_EXTENDED_CHECKOUT_TIME.split(" ")[0],
      additionalNotes: reservation.observations ?? "",
      paymentMethod: PaymentDetailMethod.CASH,
      paymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Formulario para Extend Stay
  const extendStayForm = useForm<CreateExtendStay>({
    resolver: zodResolver(extendStaySchema),
    defaultValues: {
      newCheckoutDate: reservation.checkOutDate ? addDays(parseISO(reservation.checkOutDate), 1) : undefined,
      additionalNotes: reservation.observations ?? "",
      paymentMethod: PaymentDetailMethod.CASH,
      paymentDate: format(new Date(), "yyyy-MM-dd"),
      discount: 0,
    },
  });

  // Increment render count when tab changes to force calendar re-render
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, [selectedTab]);

  // Efectos para manejar éxito en operaciones
  useEffect(() => {
    if (isSuccessLateCheckout) {
      lateCheckoutForm.reset();
      onOpenChange(false);
    }
  }, [isSuccessLateCheckout, lateCheckoutForm, onOpenChange]);

  useEffect(() => {
    if (isSuccessExtendStay) {
      extendStayForm.reset();
      onOpenChange(false);
    }
  }, [isSuccessExtendStay, extendStayForm, onOpenChange]);

  // Manejador de envío para Late Checkout
  const onSubmitLateCheckout = (data: CreateLateCheckout) => {
    // Iniciar transición para mejorar experiencia de usuario
    startLateCheckoutTransition(() => {
      onApplyLateCheckout(reservation.id, data);
    });
  };

  // Manejador de envío para Extend Stay
  const onSubmitExtendStay = (data: CreateExtendStay) => {
    // Iniciar transición para mejorar experiencia de usuario
    startExtendStayTransition(() => {
      onExtendStay(reservation.id, data);
    });
  };

  // Handle closing logic for both components
  const handleOpenChange = (value: boolean) => {
    // Prevenir cierre durante procesamiento
    if (isProcessing && !value) return;

    // Resetear formularios al cerrar
    if (!value) {
      lateCheckoutForm.reset();
      extendStayForm.reset();
    }

    onOpenChange(value);
  };

  // Common content for both Dialog and Drawer
  const renderDialogContent = () => (
    <>
      {/* Panel lateral con información de la reserva */}
      {!isMobile && <SideBarExtensionReservationDialog reservation={reservation} />}

      <div className={isMobile ? "w-full" : "-pl-8"}>
        {/* Encabezado con información de tipo de extensión */}
        {isMobile ? (
          <DrawerHeader className="flex flex-row items-start py-4">
            <div className="p-2.5">
              {selectedTab === "late-checkout" ? (
                <CalendarClock className="h-5 w-5 text-primary" />
              ) : (
                <CalendarDays className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DrawerTitle className="text-lg">
                {selectedTab === "late-checkout" ? "Late Checkout" : "Extender Estadía"}
              </DrawerTitle>
              <DrawerDescription>
                {selectedTab === "late-checkout" ? "Extensión de horario de salida" : "Extensión de días de estadía"}
              </DrawerDescription>
            </div>
            <DrawerClose className="absolute right-4 top-4" />
          </DrawerHeader>
        ) : (
          <DialogHeader className="flex flex-row items-start py-4">
            <div className="p-2.5">
              {selectedTab === "late-checkout" ? (
                <CalendarClock className="h-5 w-5 text-primary" />
              ) : (
                <CalendarDays className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg">
                {selectedTab === "late-checkout" ? "Late Checkout" : "Extender Estadía"}
              </DialogTitle>
              <DialogDescription>
                {selectedTab === "late-checkout" ? "Extensión de horario de salida" : "Extensión de días de estadía"}
              </DialogDescription>
            </div>
          </DialogHeader>
        )}
        <ScrollArea className={`${isMobile ? "max-h-[60vh]" : "max-h-[80vh]"} h-full`}>
          <div className={isMobile ? "px-4 pb-16" : "pr-4"}>
            {isMobile && (
              <div className="mb-4">
                <SideBarExtensionReservationDialog reservation={reservation} />
              </div>
            )}
            <ExtensionReservationForm
              extendStayForm={extendStayForm}
              isProcessing={isProcessing}
              lateCheckoutApplied={lateCheckoutApplied}
              lateCheckoutForm={lateCheckoutForm}
              onOpenChange={onOpenChange}
              onSubmitExtendStay={onSubmitExtendStay}
              onSubmitLateCheckout={onSubmitLateCheckout}
              renderCount={renderCount}
              reservation={reservation}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>
        </ScrollArea>
      </div>
    </>
  );

  // Conditionally render Dialog or Drawer based on screen size
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="px-0 h-[70vh]">{renderDialogContent()}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[950px] p-0 flex flex-col md:flex-row">{renderDialogContent()}</DialogContent>
    </Dialog>
  );
}
