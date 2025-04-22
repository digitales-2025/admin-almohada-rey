"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart3, CreditCard, FileText } from "lucide-react";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePayments } from "../../../_hooks/use-payments";
import { updatePaymentSchema, UpdatePaymentSchema } from "../../../_schema/createPaymentsSchema";
import { Payment } from "../../../_types/payment";
import PaymentDetailGroups from "./PaymentDetailGroups";
import PaymentSummary from "./PaymentSummary";
import GeneralUpdatePayment from "./tabs/GeneralUpdatePayment";

interface PaymentManagementProps {
  paymentById: Payment;
}

export default function PaymentManagement({ paymentById }: PaymentManagementProps) {
  const [activeTab, setActiveTab] = useState("general");

  const missingDays = paymentById.missingDays ?? 0;
  const paymentDays = paymentById.paymentDays ?? 0;
  const router = useRouter();
  const { onUpdatePayment, isLoadingUpdatePayment, isSuccessUpdatePayment } = usePayments();

  // Initialize form with default values
  const form = useForm<UpdatePaymentSchema>({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      observations: paymentById.observations || "",
    },
  });

  const onSubmit = (data: UpdatePaymentSchema) => {
    onUpdatePayment({
      ...data,
      id: paymentById.id,
    });
  };

  useEffect(() => {
    if (isSuccessUpdatePayment) {
      router.push("/payments");
    }
  }, [isSuccessUpdatePayment]);

  return (
    <div>
      <Card className="overflow-hidden border-primary/20 bg-card dark:border-primary/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-3 w-full justify-start gap-2 rounded-none bg-transparent p-0">
              <TabsTrigger
                value="general"
                className={cn(
                  "flex h-12 items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  activeTab === "general" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <span className="truncate text-ellipsis">General</span>
              </TabsTrigger>

              <TabsTrigger
                value="details"
                className={cn(
                  "flex h-12 items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  activeTab === "details" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <CreditCard className="h-4 w-4 shrink-0" />
                <span className="truncate text-ellipsis">Detalles de Pago</span>
              </TabsTrigger>

              <TabsTrigger
                value="summary"
                className={cn(
                  "flex h-12 items-center gap-2 rounded-none border-b-2 border-transparent bg-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  activeTab === "summary" ? "text-primary" : "text-muted-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span className="truncate text-ellipsis">Resumen</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="general" className="m-0 border-none p-0">
              <GeneralUpdatePayment
                form={form}
                payment={paymentById}
                onSubmit={onSubmit}
                isLoadingUpdatePayment={isLoadingUpdatePayment}
              />
            </TabsContent>

            <TabsContent value="details" className="m-0 border-none p-6">
              <PaymentDetailGroups
                paymentDetails={paymentById.paymentDetail}
                missingDays={missingDays}
                paymentDays={paymentDays}
              />
            </TabsContent>

            <TabsContent value="summary" className="m-0 border-none p-6">
              <PaymentSummary payment={paymentById} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
