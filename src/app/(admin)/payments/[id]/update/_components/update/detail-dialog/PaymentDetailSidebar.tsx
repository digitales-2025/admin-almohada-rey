import { UseFormReturn } from "react-hook-form";

import { PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { getMethodIcon, getPaymentMethodLabel } from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";
import { getPaymentDetailTypesConfigs, PaymentDetailTypesConfigs } from "../../../_utils/updatePaymentDetail.utils";

interface PaymentDetailSidebarProps {
  detailForm: UseFormReturn<PaymentDetailFormValues>;
  watchDetailType: string;
  isDesktop: boolean;
}

export default function PaymentDetailSidebar({ detailForm, watchDetailType, isDesktop }: PaymentDetailSidebarProps) {
  return (
    <div>
      <div className="text-sm font-medium mb-3 text-muted-foreground">Tipo de Detalle</div>

      <div className="mb-4">
        {PaymentDetailTypesConfigs.filter((type) => type.value === watchDetailType).map((type) => {
          const currentTypeConfig = getPaymentDetailTypesConfigs().find((config) => config.value === type.value);

          return (
            <div key={type.value} className="flex items-center">
              <div
                className={cn(
                  "flex w-full items-center gap-2 p-3 rounded-lg",
                  currentTypeConfig?.bgColor,
                  currentTypeConfig?.borderColor
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center bg-background/80 dark:bg-white",
                    currentTypeConfig?.textColor
                  )}
                >
                  {type.icon}
                </div>
                <span className={cn("text-sm", currentTypeConfig?.textColor)}>{type.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-6", !isDesktop && "mb-4")}>
        <div className="text-sm font-medium mb-3 text-muted-foreground">Método de Pago</div>
        <Select onValueChange={(value) => detailForm.setValue("method", value)} value={detailForm.watch("method")}>
          <SelectTrigger
            className={cn(
              "w-full transition-all",
              detailForm.watch("method") && "border-l-4",
              detailForm.watch("method") === "CASH" && "border-l-green-500",
              detailForm.watch("method") === "CREDIT_CARD" && "border-l-blue-500",
              detailForm.watch("method") === "TRANSFER" && "border-l-violet-500",
              detailForm.watch("method") === "YAPE" && "border-l-purple-500",
              detailForm.watch("method") === "PLIN" && "border-l-sky-500",
              detailForm.watch("method") === "PAYPAL" && "border-l-blue-700",
              detailForm.watch("method") === "DEBIT_CARD" && "border-l-cyan-500",
              detailForm.watch("method") === "IZI_PAY" && "border-l-red-600",
              detailForm.watch("method") === "PENDING_PAYMENT" && "border-l-amber-500"
            )}
          >
            <SelectValue placeholder="Seleccionar método">
              {detailForm.watch("method") && (
                <div className="flex items-center gap-2">
                  <div>{getMethodIcon(detailForm.watch("method") as PaymentDetailMethod, true)}</div>
                  {getPaymentMethodLabel(detailForm.watch("method"))}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.values(PaymentDetailMethod).map((method) => (
              <SelectItem key={method} value={method}>
                <div className="flex items-center gap-2">
                  <div>{getMethodIcon(method as PaymentDetailMethod, true)}</div>
                  {getPaymentMethodLabel(method)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn("mt-auto pt-4", !isDesktop && "mt-2 flex items-center justify-between")}>
        <div className="text-xs text-muted-foreground mb-2">
          {watchDetailType === "ROOM" ? "Subtotal Habitación" : "Subtotal"}
        </div>
        <div className="text-2xl font-bold text-primary">S/ {detailForm.watch("subtotal").toFixed(2)}</div>
      </div>
    </div>
  );
}
