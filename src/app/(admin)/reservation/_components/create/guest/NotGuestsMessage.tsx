import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface NotGuestsMessageProps {
  handleAddGuest: () => void;
  setActiveGuest: (value: number) => void;
  setActiveStep: (value: number) => void;
  isMaxGuestsReached: boolean;
}

export default function NotGuestsMessage({
  handleAddGuest,
  setActiveGuest,
  setActiveStep,
  isMaxGuestsReached,
}: NotGuestsMessageProps) {
  return (
    <div className="text-center py-8 bg-card rounded-lg border shadow-sm p-6">
      <div className="inline-flex h-16 w-16 rounded-full bg-muted p-4 mb-4">
        <UserPlus className="h-full w-full text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">Gestión de Huéspedes</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
        Añada los huéspedes adicionales que se alojarán en esta habitación
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={() => {
            handleAddGuest();
            setTimeout(() => {
              setActiveGuest(0);
              setActiveStep(0);
            });
          }}
          disabled={isMaxGuestsReached}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir primer huésped
        </Button>
      </div>
    </div>
  );
}
