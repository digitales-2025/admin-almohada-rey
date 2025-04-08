import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryItemPayment, CategoryPayment } from "../../_types/payment";

interface PaymentServiceCardProps {
  service: CategoryItemPayment;
  category: CategoryPayment;
  onSelect: (service: CategoryItemPayment, category: CategoryPayment) => void;
}

export default function PaymentServiceCard({ service, category, onSelect }: PaymentServiceCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-md border cursor-pointer bg-card"
      onClick={() => onSelect(service, category)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-10 w-10 rounded-md flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <div className="font-medium">{service.name}</div>
            <div className="text-xs text-muted-foreground">{service.code}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">S/. {service.price.toFixed(2)}</span>
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation(); // Evita que se propague al div padre
              onSelect(service, category);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
