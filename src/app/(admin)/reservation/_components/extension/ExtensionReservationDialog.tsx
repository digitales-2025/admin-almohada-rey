"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { Bed, CalendarClock, CalendarDays, Clock } from "lucide-react";
import { useForm } from "react-hook-form";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_CHECKOUT_TIME } from "@/utils/peru-datetime";
import {
  extendStaySchema,
  lateCheckoutSchema,
  type ExtendStayFormValues,
  type ExtensionReservationFormValues,
  type LateCheckoutFormValues,
} from "../../_schemas/extension-reservation.schemas";
import type { DetailedReservation } from "../../_schemas/reservation.schemas";
import ExtendedStayForm from "./ExtendedStayForm";
import LateCheckoutForm from "./LateCheckoutForm";
import SideBarExtensionReservationDialog from "./SideBarExtensionReservationDialog";

interface ExtensionReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: DetailedReservation;
}

export function ExtensionReservationDialog({ open, onOpenChange, reservation }: ExtensionReservationDialogProps) {
  const [selectedTab, setSelectedTab] = useState<"late-checkout" | "extend-stay">("late-checkout");
  const [renderCount, setRenderCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const originalCheckoutDate = reservation.checkOutDate ? parseISO(reservation.checkOutDate) : new Date();
  const roomPrice = reservation.room.RoomTypes.price;

  // Formulario para Late Checkout
  const lateCheckoutForm = useForm<LateCheckoutFormValues>({
    resolver: zodResolver(lateCheckoutSchema),
    defaultValues: {
      lateCheckoutTime: DEFAULT_CHECKOUT_TIME.split(" ")[0],
      additionalNotes: "",
      paymentMethod: PaymentDetailMethod.CASH,
      paymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Formulario para Extend Stay
  const extendStayForm = useForm<ExtendStayFormValues>({
    resolver: zodResolver(extendStaySchema),
    defaultValues: {
      newCheckoutDate: reservation.checkOutDate ? addDays(parseISO(reservation.checkOutDate), 1) : undefined,
      additionalNotes: "",
      paymentMethod: PaymentDetailMethod.CASH,
      paymentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Calculate costs
  const lateCheckoutCost = roomPrice / 2;
  const extendedStayCost = extendStayForm.watch("newCheckoutDate")
    ? roomPrice * differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)
    : 0;

  // Increment render count when tab changes to force calendar re-render
  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, [selectedTab]);

  // Function to disable dates before checkout date
  const isDateDisabled = (date: Date) => {
    return isBefore(date, originalCheckoutDate) || isBefore(date, new Date());
  };

  // Manejador de envío para Late Checkout
  const onSubmitLateCheckout = (data: LateCheckoutFormValues) => {
    setIsProcessing(true);

    // Crear el objeto de datos completo con el tipo discriminador
    const formData: ExtensionReservationFormValues = {
      type: "late-checkout",
      ...data,
    };

    console.log("Late Checkout Form Data:", formData);

    // Simulación de procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
    }, 800);
  };

  // Manejador de envío para Extend Stay
  const onSubmitExtendStay = (data: ExtendStayFormValues) => {
    setIsProcessing(true);

    // Crear el objeto de datos completo con el tipo discriminador
    const formData: ExtensionReservationFormValues = {
      type: "extend-stay",
      ...data,
    };

    console.log("Extend Stay Form Data:", formData);

    // Simulación de procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] p-0 flex flex-col md:flex-row">
        {/* Panel lateral con información de la reserva */}
        <SideBarExtensionReservationDialog reservation={reservation} />
        <div className="-pl-8">
          {/* Encabezado con información de tipo de extensión */}
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
          <ScrollArea className="max-h-[80vh] h-full">
            <div className="pr-4">
              {/* Tabs de navegación */}
              <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "late-checkout" | "extend-stay")}>
                <TabsList className="grid grid-cols-2 w-full bg-muted/50">
                  <TabsTrigger
                    value="late-checkout"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Late Checkout</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="extend-stay"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                  >
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      <span>Extender Estadía</span>
                    </div>
                  </TabsTrigger>
                </TabsList>

                {/* Contenido de los formularios */}
                <div className="bg-background">
                  <LateCheckoutForm
                    isProcessing={isProcessing}
                    lateCheckoutCost={lateCheckoutCost}
                    lateCheckoutForm={lateCheckoutForm}
                    onOpenChange={onOpenChange}
                    onSubmitLateCheckout={onSubmitLateCheckout}
                    reservation={reservation}
                    roomPrice={roomPrice}
                  />

                  <ExtendedStayForm
                    isProcessing={isProcessing}
                    extendedStayCost={extendedStayCost}
                    extendStayForm={extendStayForm}
                    onOpenChange={onOpenChange}
                    onSubmitExtendStay={onSubmitExtendStay}
                    reservation={reservation}
                    roomPrice={roomPrice}
                    isDateDisabled={isDateDisabled}
                    originalCheckoutDate={originalCheckoutDate}
                    renderCount={renderCount}
                  />
                </div>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
