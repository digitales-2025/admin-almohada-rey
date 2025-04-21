"use client";

import { format, parse } from "date-fns";
import { UseFormReturn } from "react-hook-form";

import { PaymentDetail, PaymentDetailMethod } from "@/app/(admin)/payments/_types/payment";
import { getMethodIcon, getPaymentMethodLabel } from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { GroupPaymentDetailFormValues } from "../../../_schemas/updatePaymentDetailSchema";

interface UpdateGroupPaymentDetailFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  groupForm: UseFormReturn<GroupPaymentDetailFormValues>;
  onSubmitGroup: (data: GroupPaymentDetailFormValues) => void;
  selectedDetails: Array<PaymentDetail>;
}

export default function UpdateGroupPaymentDetailForm({
  children,
  groupForm,
  selectedDetails,
  onSubmitGroup,
}: UpdateGroupPaymentDetailFormProps) {
  // Calculate total amount
  const totalAmount = selectedDetails.reduce((sum, detail) => sum + detail.subtotal, 0);

  return (
    <Form {...groupForm}>
      <form onSubmit={groupForm.handleSubmit(onSubmitGroup)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label htmlFor="paymentDate" className="text-sm font-medium text-primary">
              Fecha de Pago
            </Label>
            {/* Reemplazar el DatePicker actual con el componente de FormField */}
            <FormField
              control={groupForm.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <DatePicker
                    value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, "yyyy-MM-dd");
                        field.onChange(formattedDate);
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="method" className="text-sm font-medium text-primary">
                Método de Pago
              </Label>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                Total: S/ {totalAmount.toFixed(2)}
              </Badge>
            </div>

            <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/20">
              <RadioGroup
                onValueChange={(value) => groupForm.setValue("method", value)}
                defaultValue={groupForm.getValues("method")}
                className="grid gap-2 grid-cols-4"
              >
                {Object.values(PaymentDetailMethod).map((method) => (
                  <div key={method}>
                    <RadioGroupItem
                      value={method}
                      id={`group-method-${method.toLowerCase()}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`group-method-${method.toLowerCase()}`}
                      className={cn(
                        "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-muted p-3 hover:bg-accent hover:text-accent-foreground transition-all",
                        "peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary/30",
                        "[&:has([data-state=checked])]:bg-primary/10 [&:has([data-state=checked])]:border-primary/30"
                      )}
                    >
                      {getMethodIcon(method as PaymentDetailMethod, true)}
                      <span className="text-xs font-medium text-center">{getPaymentMethodLabel(method)}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-primary">Detalles incluidos en este grupo</h3>
            <Badge variant="outline" className="bg-white border-primary/30 text-primary">
              {selectedDetails.length} {selectedDetails.length === 1 ? "detalle" : "detalles"}
            </Badge>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 space-y-2 rounded-md">
            {selectedDetails.map((detail, index) => {
              // Alternate background colors for items
              const bgColorClass = index % 2 === 0 ? "bg-primary/10" : "bg-secondary/10";

              return (
                <div
                  key={detail.id}
                  className={cn(
                    "flex items-center justify-between rounded-md p-3 text-sm transition-all hover:shadow-sm",
                    bgColorClass
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-primary/90">{detail.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {detail.type === "ROOM_RESERVATION"
                        ? "Habitación"
                        : detail.service
                          ? detail.service.name
                          : detail.product
                            ? detail.product.name
                            : "Otro"}
                    </span>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">S/ {detail.subtotal.toFixed(2)}</Badge>
                </div>
              );
            })}
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}
