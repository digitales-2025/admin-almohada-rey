import { differenceInDays, isBefore, parseISO } from "date-fns";
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
  // Function to disable dates before checkout date
  const isDateDisabled = (date: Date) => {
    return isBefore(date, originalCheckoutDate) || isBefore(date, new Date());
  };
  const roomPrice = reservation.room.RoomTypes.price;

  const originalCheckoutDate = reservation.checkOutDate ? parseISO(reservation.checkOutDate) : new Date();

  // Calculate costs
  const lateCheckoutCost = roomPrice / 2;
  const extendedStayCost = extendStayForm.watch("newCheckoutDate")
    ? roomPrice * differenceInDays(extendStayForm.watch("newCheckoutDate"), originalCheckoutDate)
    : 0;

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
