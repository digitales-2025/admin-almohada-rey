import { CreditCardIcon, Hotel, Receipt } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepsSidebarProps {
  isDesktop: boolean;
  step: number;
  setStep: (step: number) => void;
}

export const StepsSidebar = ({ isDesktop, step, setStep }: StepsSidebarProps) => (
  <div className={cn("bg-primary/5 flex flex-col border-r", isDesktop ? "w-[200px] p-6" : "p-4")}>
    <div className="text-xl font-bold text-primary mb-6">Pago</div>

    <div className="space-y-4 flex-1">
      <div
        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 1 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
        onClick={() => step > 1 && setStep(1)}
        style={{ cursor: step > 1 ? "pointer" : "default" }}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <Hotel className="h-4 w-4 shrink-0" />
        </div>
        <span>Habitación</span>
      </div>

      <div
        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 2 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
        onClick={() => step > 2 && setStep(2)}
        style={{ cursor: step > 2 ? "pointer" : "default" }}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <CreditCardIcon className="h-4 w-4 shrink-0" />
        </div>
        <span>Método de Pago</span>
      </div>

      <div
        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 3 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
        >
          <Receipt className="h-4 w-4" />
        </div>
        <span>Confirmación</span>
      </div>
    </div>

    <div className="mt-auto pt-6">
      <div className="text-xs text-muted-foreground">Paso {step} de 3</div>
    </div>
  </div>
);
