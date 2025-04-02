import { CreditCardIcon, Hotel, Receipt } from "lucide-react";

interface PaymentHeaderProps {
  step: number;
}

export const PaymentHeader = ({ step }: PaymentHeaderProps) => (
  <>
    <div className="flex items-center space-x-2">
      {step === 1 && <Hotel className="h-5 w-5 text-primary shrink-0" />}
      {step === 2 && <CreditCardIcon className="h-5 w-5 text-primary shrink-0" />}
      {step === 3 && <Receipt className="h-5 w-5 text-primary shrink-0" />}
      <div className="text-2xl font-bold">
        {step === 1 && "Habitación y Servicios Extra"}
        {step === 2 && "Método de Pago"}
        {step === 3 && "Confirmación"}
      </div>
    </div>
    <div className="pt-2 text-sm text-muted-foreground">
      {step === 1 && "Ingrese los detalles de la habitación y agregue servicios adicionales"}
      {step === 2 && "Seleccione cómo realizará el pago el huésped"}
      {step === 3 && "Revise la información del pago antes de confirmar"}
    </div>
  </>
);
