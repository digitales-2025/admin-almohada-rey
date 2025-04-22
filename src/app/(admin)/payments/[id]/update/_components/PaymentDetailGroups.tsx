"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";
import { useForm } from "react-hook-form";

import { getPaymentMethodLabel } from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  GroupPaymentDetailFormValues,
  groupPaymentDetailSchema,
  paymentDetailSchema,
  type PaymentDetailFormValues,
} from "../_schemas/updatePaymentDetailSchema";
import { calculateSubtotal, groupPaymentDetails, PaymentDetailTypesConfigs } from "../_utils/updatePaymentDetail.utils";
import { usePayments } from "../../../_hooks/use-payments";
import type { PaymentDetail, PaymentDetailMethod } from "../../../_types/payment";
import InformationPaymentDetail from "./InformationPaymentDetail";
import { UpdateGroupPaymentDetailDialog } from "./update/detail-batch-dialog/UpdateGroupPaymentDetailDialog";
import UpdatePaymentDetailDialog from "./update/detail-dialog/UpdatePaymentDetailDialog";

interface PaymentDetailGroupsProps {
  paymentDetails: PaymentDetail[];
  missingDays: number;
  paymentDays: number;
}

export default function PaymentDetailGroups({ paymentDetails, missingDays, paymentDays }: PaymentDetailGroupsProps) {
  const groups = groupPaymentDetails(paymentDetails);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<PaymentDetail[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(groups.length > 0 ? [groups[0].key] : []);
  const [selectedDetailDays, setSelectedDetailDays] = useState<number>(1);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  const {
    onUpdatePaymentDetail,
    isSuccessUpdatePaymentDetail,
    isLoadingUpdatePaymentDetail,
    onUpdatePaymentDetailsBatch,
    isSuccessUpdatePaymentDetailsBatch,
    isLoadingUpdatePaymentDetailsBatch,
  } = usePayments();

  const detailForm = useForm<PaymentDetailFormValues>({
    resolver: zodResolver(paymentDetailSchema),
    defaultValues: {
      paymentDate: "",
      description: "",
      method: "CREDIT_CARD",
      unitPrice: 0,
      quantity: 1,
      days: 1,
      subtotal: 0,
      detailType: "ROOM",
      productId: undefined,
      serviceId: undefined,
      roomId: undefined,
    },
  });

  const groupForm = useForm<GroupPaymentDetailFormValues>({
    resolver: zodResolver(groupPaymentDetailSchema),
    defaultValues: {
      paymentDate: "",
      method: "CREDIT_CARD",
    },
  });

  const watchDetailType = detailForm.watch("detailType");
  const watchUnitPrice = detailForm.watch("unitPrice");
  const watchQuantity = detailForm.watch("quantity");
  const watchDays = detailForm.watch("days");

  const handleEditGroup = (items: PaymentDetail[]) => {
    setSelectedDetails(items);

    // Set form values based on the first item in the group
    if (items.length > 0) {
      const firstItem = items[0];
      groupForm.setValue("paymentDate", firstItem.paymentDate);
      groupForm.setValue("method", firstItem.method);
    }

    setIsGroupDialogOpen(true);
  };

  const handleEditDetail = (detail: PaymentDetail) => {
    // Determine detail type
    let type: "ROOM" | "SERVICE" | "PRODUCT" = "ROOM";
    if (detail.type === "ROOM_RESERVATION") {
      type = "ROOM";
    } else if (detail.service) {
      type = "SERVICE";
    } else if (detail.product) {
      type = "PRODUCT";
    }

    setSelectedDetailDays(detail.days || 1);
    setSelectedDetailId(detail.id ?? null);

    // Set form values based on the detail
    detailForm.setValue("paymentDate", detail.paymentDate);
    detailForm.setValue("description", detail.description);
    detailForm.setValue("method", detail.method);
    detailForm.setValue("unitPrice", detail.unitPrice);
    detailForm.setValue("quantity", detail.quantity || 1);
    detailForm.setValue("days", detail.days || 1);
    detailForm.setValue("subtotal", detail.subtotal);
    detailForm.setValue("detailType", type);

    if (detail.product) {
      detailForm.setValue("productId", detail.product.id);
    }

    if (detail.service) {
      detailForm.setValue("serviceId", detail.service.id);
    }

    if (detail.room) {
      detailForm.setValue("roomId", detail.room.id);
    }

    setIsDetailDialogOpen(true);
  };

  const onSubmitGroup = (data: GroupPaymentDetailFormValues) => {
    const selectedIds = selectedDetails.map((detail) => detail.id).filter((id): id is string => id !== undefined);
    const updatePayload: {
      paymentDetailIds: string[];
      paymentDate?: string;
      method?: PaymentDetailMethod;
    } = {
      paymentDetailIds: selectedIds,
      paymentDate: data.paymentDate,
      method: data.method as PaymentDetailMethod,
    };

    onUpdatePaymentDetailsBatch(updatePayload);
  };

  useEffect(() => {
    if (isSuccessUpdatePaymentDetailsBatch) {
      groupForm.reset();
      setIsGroupDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdatePaymentDetailsBatch]);

  const onSubmitDetail = (data: PaymentDetailFormValues) => {
    // Necesitamos el ID del detalle que se está editando
    if (!selectedDetailId) {
      console.error("ID del detalle no encontrado");
      return;
    }

    // Verificamos si el método de pago es PENDING_PAYMENT
    const isPendingPayment = data.method === "PENDING_PAYMENT";

    // Determinar si es un servicio o producto (no habitación)
    const isServiceOrProduct = data.detailType === "SERVICE" || data.detailType === "PRODUCT";

    // Preparamos el payload según el DTO esperado
    const updatePayload: any = {
      id: selectedDetailId,
      paymentDate: data.paymentDate,
      description: data.description,
      method: data.method,
      unitPrice: data.unitPrice,
      // Si es PENDING_PAYMENT y es servicio o producto, subtotal es 0
      subtotal: isPendingPayment && isServiceOrProduct ? 0 : data.subtotal,
    };

    // Añadimos campos condicionales según el tipo de detalle
    if (data.detailType === "ROOM" && data.roomId) {
      updatePayload.roomId = data.roomId;
      updatePayload.days = data.days;
    } else if (data.detailType === "PRODUCT" && data.productId) {
      updatePayload.productId = data.productId;
      updatePayload.quantity = data.quantity;
    } else if (data.detailType === "SERVICE" && data.serviceId) {
      updatePayload.serviceId = data.serviceId;
      updatePayload.quantity = data.quantity;
    }

    // Llamamos a la función onUpdatePaymentDetail con un solo argumento que incluye el ID
    onUpdatePaymentDetail(updatePayload);
  };

  useEffect(() => {
    if (isSuccessUpdatePaymentDetail) {
      detailForm.reset();
      setIsDetailDialogOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdatePaymentDetail]);

  const toggleCardExpand = (id: string) => {
    setExpandedCards((prev) => (prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]));
  };

  const toggleGroupExpand = (key: string) => {
    setExpandedGroups((prev) => (prev.includes(key) ? prev.filter((groupKey) => groupKey !== key) : [...prev, key]));
  };

  // Update subtotal when relevant fields change
  useEffect(() => {
    calculateSubtotal(detailForm, watchDetailType);
  }, [watchUnitPrice, watchQuantity, watchDays, watchDetailType]);

  const getCurrentDetailTypeConfig = () => {
    return PaymentDetailTypesConfigs.find((type) => type.value === watchDetailType) || PaymentDetailTypesConfigs[0];
  };

  return (
    <div className="space-y-8">
      {/* Innovative payment visualization */}
      <div className="relative">
        {/* Innovative calendar-inspired layout */}
        <div className="relative grid gap-8">
          {groups.map((group) => {
            const isExpanded = expandedGroups.includes(group.key);
            const date = parseISO(group.date);
            const dayOfMonth = format(date, "d", { locale: es });
            const dayOfWeek = format(date, "EEE", { locale: es });
            const month = format(date, "MMM", { locale: es });
            const year = format(date, "yyyy", { locale: es });

            return (
              <div
                key={group.key}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                  isExpanded ? "border-border/80 bg-card" : "border-border bg-card hover:border-border/80"
                )}
              >
                {/* Innovative calendar-inspired header */}
                <div
                  className="relative cursor-pointer overflow-hidden transition-all duration-300"
                  onClick={() => toggleGroupExpand(group.key)}
                >
                  <div className="flex">
                    {/* Calendar date column */}
                    <div
                      className="relative flex w-24 flex-col items-center justify-center border-r p-4
                                 border-border bg-muted"
                    >
                      {/* Decorative calendar page effect */}
                      <div className="absolute -top-1 left-0 right-0 flex justify-center space-x-6">
                        <div className="h-3 w-1 rounded-b-full bg-muted-foreground/30"></div>
                        <div className="h-3 w-1 rounded-b-full bg-muted-foreground/30"></div>
                      </div>

                      <div className="text-center">
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {dayOfWeek}
                        </div>
                        <div className="mt-1 text-3xl font-bold text-foreground">{dayOfMonth}</div>
                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {month}
                        </div>
                        <div className="text-xs text-muted-foreground/70">{year}</div>
                      </div>
                    </div>

                    {/* Payment method section */}
                    <div className="relative flex flex-col gap-2 sm:flex-row flex-1 items-center justify-between p-4">
                      <div className="relative flex items-center gap-4">
                        <div>
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {getPaymentMethodLabel(group.method)}
                            </h3>
                            <Badge variant={"secondary"}>
                              {group.items.length} {group.items.length === 1 ? "transacción" : "transacciones"}
                            </Badge>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">Total: S/ {group.total.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border bg-background text-foreground hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group.items);
                          }}
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground 
                                       transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded content - Innovative receipt-inspired design */}
                {isExpanded && (
                  <InformationPaymentDetail
                    group={group}
                    expandedCards={expandedCards}
                    handleEditDetail={handleEditDetail}
                    toggleCardExpand={toggleCardExpand}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <UpdateGroupPaymentDetailDialog
        isGroupDialogOpen={isGroupDialogOpen}
        setIsGroupDialogOpen={setIsGroupDialogOpen}
        groupForm={groupForm}
        selectedDetails={selectedDetails}
        onSubmitGroup={onSubmitGroup}
        isLoadingUpdatePaymentDetailsBatch={isLoadingUpdatePaymentDetailsBatch}
      />

      {isDetailDialogOpen && (
        <UpdatePaymentDetailDialog
          detailForm={detailForm}
          isDetailDialogOpen={isDetailDialogOpen}
          setIsDetailDialogOpen={setIsDetailDialogOpen}
          onSubmitDetail={onSubmitDetail}
          getCurrentDetailTypeConfig={getCurrentDetailTypeConfig}
          missingDays={missingDays}
          paymentDays={paymentDays}
          selectedDetailDays={selectedDetailDays}
          isLoadingUpdatePaymentDetail={isLoadingUpdatePaymentDetail}
        />
      )}
    </div>
  );
}
