import { differenceInDays, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { Bed, Clock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateExtendStay, CreateLateCheckout } from "../../_schemas/extension-reservation.schemas";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import ExtendedStayForm from "./ExtendedStayForm";
import LateCheckoutForm from "./LateCheckoutForm";

interface ExtensionReservationFormProps {
  lateCheckoutApplied: boolean;
  selectedTab: "late-checkout" | "extend-stay";
  setSelectedTab: (tab: "late-checkout" | "extend-stay") => void;
  isProcessing: boolean;
  onOpenChange: (open: boolean) => void;
  lateCheckoutForm: UseFormReturn<CreateLateCheckout>;
  onSubmitLateCheckout: (data: CreateLateCheckout) => void;
  reservation: DetailedReservation;
  extendStayForm: UseFormReturn<CreateExtendStay>;
  onSubmitExtendStay: (data: CreateExtendStay) => void;
  renderCount: number;
}

export default function ExtensionReservationForm({
  lateCheckoutApplied,
  selectedTab,
  setSelectedTab,
  isProcessing,
  lateCheckoutForm,
  onOpenChange,
  onSubmitLateCheckout,
  reservation,
  extendStayForm,
  onSubmitExtendStay,
  renderCount,
}: ExtensionReservationFormProps) {
  const roomPrice = reservation.room.RoomTypes.price;

  const originalCheckInDate = reservation.checkInDate ? parseISO(reservation.checkInDate) : new Date();
  const originalCheckoutDate = reservation.checkOutDate ? parseISO(reservation.checkOutDate) : new Date();

  // Function to disable only dates within the current reservation period (check-in to check-out)
  // All dates after check-out should be available, even if they are before today
  const isDateDisabled = (date: Date) => {
    // Bloquear fechas desde check-in hasta check-out (inclusive)
    // Esto incluye el check-in y el check-out
    // Verificar si la fecha es igual o después del check-in
    const isOnOrAfterCheckIn = isSameDay(date, originalCheckInDate) || isAfter(date, originalCheckInDate);
    // Verificar si la fecha es igual o antes del check-out
    const isOnOrBeforeCheckOut = isSameDay(date, originalCheckoutDate) || isBefore(date, originalCheckoutDate);

    // Si la fecha está dentro del rango de la reserva actual (check-in a check-out), bloquearla
    return isOnOrAfterCheckIn && isOnOrBeforeCheckOut;
  };

  // Calculate costs
  const lateCheckoutCost = roomPrice / 2;
  const additionalNights = extendStayForm.watch("newCheckoutDate")
    ? differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)
    : 0;
  const discount = extendStayForm.watch("discount") ?? 0;
  const extendedStayCost = additionalNights > 0 ? Math.max(0, roomPrice * additionalNights - discount) : 0;

  // Si late checkout fue aplicado, forzar la selección del tab "extend-stay"
  if (lateCheckoutApplied && selectedTab === "late-checkout") {
    setSelectedTab("extend-stay");
  }

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(v) => setSelectedTab(v as "late-checkout" | "extend-stay")}
      className="w-full"
    >
      {lateCheckoutApplied ? (
        // Si late checkout fue aplicado, mostrar solo el tab de extender estadía
        <TabsList className="hidden">
          <TabsTrigger value="extend-stay" />
        </TabsList>
      ) : (
        // Si late checkout no fue aplicado, mostrar ambos tabs
        <TabsList className="grid grid-cols-2 w-full bg-muted/50">
          <TabsTrigger
            value="late-checkout"
            className="data-[state=active]:bg-background data-[state=active]:border-primary"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate text-ellipsis">Late Checkout</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="extend-stay"
            className="data-[state=active]:bg-background data-[state=active]:border-primary"
          >
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 shrink-0" />
              <span className="truncate text-ellipsis">Extender Estadía</span>
            </div>
          </TabsTrigger>
        </TabsList>
      )}

      {/* Contenido de los formularios */}
      <div className="bg-background">
        {/* Solo renderizar el formulario de Late Checkout si no ha sido aplicado */}
        {!lateCheckoutApplied && (
          <LateCheckoutForm
            isProcessing={isProcessing}
            lateCheckoutCost={lateCheckoutCost}
            lateCheckoutForm={lateCheckoutForm}
            onOpenChange={onOpenChange}
            onSubmitLateCheckout={onSubmitLateCheckout}
            reservation={reservation}
            roomPrice={roomPrice}
          />
        )}

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
  );
}
