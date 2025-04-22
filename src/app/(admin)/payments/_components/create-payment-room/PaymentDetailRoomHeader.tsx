import { CreditCardIcon, Hotel, Info } from "lucide-react";

interface PaymentDetailRoomHeaderProps {
  step: number;
}

export const PaymentDetailRoomHeader = ({ step }: PaymentDetailRoomHeaderProps) => (
  <>
    <div className="flex items-center space-x-2">
      {step === 1 && <Hotel className="h-5 w-5 text-primary shrink-0" />}
      {step === 2 && <CreditCardIcon className="h-5 w-5 text-primary shrink-0" />}
      {step === 3 && <Info className="h-5 w-5 text-primary shrink-0" />}
      <div className="text-2xl font-bold">
        {step === 1 && "Habitación"}
        {step === 2 && "Método de Pago"}
        {step === 3 && "Resumen"}
      </div>
    </div>
    <div className="pt-2 text-sm text-muted-foreground">
      {step === 1 && "Ingrese los detalles de la habitación y el pago"}
      {step === 2 && "Seleccione cómo realizará el pago el huésped"}
      {step === 3 && "Revise la información del pago antes de confirmar"}
    </div>
  </>
);
