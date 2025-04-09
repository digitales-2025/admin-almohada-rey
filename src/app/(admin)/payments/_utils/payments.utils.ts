import { CheckCircle2, ClockIcon } from "lucide-react";

import { PaymentStatus } from "../_types/payment";

export const PaymentStatusLabels: Record<
  PaymentStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
  [PaymentStatus.PAID]: {
    label: "Pagado",
    icon: CheckCircle2,
    className: "text-green-700 border-green-200",
  },
  [PaymentStatus.PENDING]: {
    label: "Pendiente",
    icon: ClockIcon,
    className: "text-amber-700 border-amber-200",
  },
};
