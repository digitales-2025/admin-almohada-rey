"use client";

import React from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";

import { getPaymentMethodLabel } from "@/app/(admin)/reservation/_utils/reservationPayment.utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPaymentDetailTypesConfigs } from "../_utils/updatePaymentDetail.utils";
import { PaymentStatus, type PaymentDetail } from "../../../_types/payment";
import { PaymentStatusLabels } from "../../../_utils/payments.utils";

interface PaymentStatusColumnProps {
  status: PaymentStatus;
  items: PaymentDetail[];
  expandedCards: string[];
  toggleCardExpand: (id: string) => void;
  handleEditDetail: (detail: PaymentDetail) => void;
}

export function PaymentStatusColumn({
  status,
  items,
  expandedCards,
  toggleCardExpand,
  handleEditDetail,
}: PaymentStatusColumnProps) {
  const filteredItems = items.filter((item) => item.status === status);
  const statusLabel = PaymentStatusLabels[status];

  return (
    <div className={cn("rounded-lg border p-4", statusLabel.className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {React.createElement(statusLabel.icon, { className: "h-4 w-4" })}
          <h3 className={cn("font-medium", status === PaymentStatus.PENDING ? "text-amber-900" : "text-green-900")}>
            {statusLabel.label}s
          </h3>
        </div>
        <Badge
          className={cn(
            status === PaymentStatus.PENDING
              ? "bg-amber-100 text-amber-800 border-amber-200"
              : "bg-green-100 text-green-800 border-green-200"
          )}
        >
          {filteredItems.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {filteredItems.map((detail) => {
          const isExpanded = detail.id ? expandedCards.includes(detail.id) : false;
          const detailConfig =
            getPaymentDetailTypesConfigs("h-4 w-4").find(
              (config) =>
                (detail.type === "ROOM_RESERVATION" && config.value === "ROOM") ||
                (detail.service && config.value === "SERVICE") ||
                (detail.product && config.value === "PRODUCT")
            ) || getPaymentDetailTypesConfigs("h-4 w-4")[0];

          return (
            <div
              key={detail.id}
              className={cn("rounded-lg border shadow-sm", detailConfig.borderColor, "overflow-hidden")}
            >
              <div className="cursor-pointer p-3" onClick={() => detail.id && toggleCardExpand(detail.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        detailConfig.color,
                        "text-primary-foreground"
                      )}
                    >
                      {detailConfig.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{detail.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(detail.paymentDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{detailConfig.label}</div>
                  <div className="font-medium text-foreground">S/ {detail.subtotal.toFixed(2)}</div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t bg-card p-4">
                  <div className="flex flex-col space-y-4">
                    {/* Contenido específico según el tipo */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {/* Detalles de habitación */}
                      {detail.room && (
                        <div
                          className={cn(
                            "overflow-hidden rounded-lg border bg-background",
                            `border-${detailConfig.borderColor}`
                          )}
                        >
                          <div className={cn("px-3 py-2", detailConfig.bgColor)}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-md text-primary-foreground",
                                  detailConfig.color
                                )}
                              >
                                {
                                  getPaymentDetailTypesConfigs("h-3 w-3").find((config) => config.value === "ROOM")
                                    ?.icon
                                }
                              </div>
                              <div className={cn("text-sm font-medium", detailConfig.textColor)}>
                                Detalles de habitación
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div
                              className={cn(
                                "flex items-center justify-between border-b border-dashed py-1.5",
                                `border-${detailConfig.borderColor}`
                              )}
                            >
                              <span className="text-xs text-muted-foreground">Número</span>
                              <span className="text-xs font-semibold text-foreground">{detail.room.number}</span>
                            </div>
                            <div
                              className={cn(
                                "flex items-center justify-between border-b border-dashed py-1.5",
                                `border-${detailConfig.borderColor}`
                              )}
                            >
                              <span className="text-xs text-muted-foreground">Tipo</span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                                  detailConfig.bgColor,
                                  detailConfig.textColor
                                )}
                              >
                                {detail.room.RoomTypes.name}
                              </span>
                            </div>
                            {detail.days && (
                              <div className="flex items-center justify-between py-1.5">
                                <span className="text-xs text-muted-foreground">Estancia</span>
                                <span className="text-xs font-semibold text-foreground">{detail.days} noches</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Detalles de servicio */}
                      {detail.service && (
                        <div
                          className={cn(
                            "overflow-hidden rounded-lg border bg-background",
                            `border-${detailConfig.borderColor}`
                          )}
                        >
                          <div className={cn("px-3 py-2", detailConfig.bgColor)}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-md text-primary-foreground",
                                  detailConfig.color
                                )}
                              >
                                {
                                  getPaymentDetailTypesConfigs("h-3 w-3").find((config) => config.value === "SERVICE")
                                    ?.icon
                                }
                              </div>
                              <div className={cn("text-sm font-medium", detailConfig.textColor)}>
                                Detalles de servicio
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div
                              className={cn(
                                "flex items-center justify-between border-b border-dashed py-1.5",
                                `border-${detailConfig.borderColor}`
                              )}
                            >
                              <span className="text-xs text-muted-foreground">Servicio</span>
                              <span className="text-xs font-semibold text-foreground">{detail.service.name}</span>
                            </div>
                            {detail.quantity && (
                              <div className="flex items-center justify-between py-1.5">
                                <span className="text-xs text-muted-foreground">Cantidad</span>
                                <div
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                                    detailConfig.bgColor,
                                    detailConfig.textColor
                                  )}
                                >
                                  {detail.quantity}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Detalles de producto */}
                      {detail.product && (
                        <div
                          className={cn(
                            "overflow-hidden rounded-lg border bg-background",
                            `border-${detailConfig.borderColor}`
                          )}
                        >
                          <div className={cn("px-3 py-2", detailConfig.bgColor)}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-md text-primary-foreground",
                                  detailConfig.color
                                )}
                              >
                                {
                                  getPaymentDetailTypesConfigs("h-3 w-3").find((config) => config.value === "PRODUCT")
                                    ?.icon
                                }
                              </div>
                              <div className={cn("text-sm font-medium", detailConfig.textColor)}>
                                Detalles de producto
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div
                              className={cn(
                                "flex items-center justify-between border-b border-dashed py-1.5",
                                `border-${detailConfig.borderColor}`
                              )}
                            >
                              <span className="text-xs text-muted-foreground">Producto</span>
                              <span className="text-xs font-semibold capitalize text-foreground">
                                {detail.product.name}
                              </span>
                            </div>
                            {detail.quantity && (
                              <div className="flex items-center justify-between py-1.5">
                                <span className="text-xs text-muted-foreground">Cantidad</span>
                                <div
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                                    detailConfig.bgColor,
                                    detailConfig.textColor
                                  )}
                                >
                                  {detail.quantity}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Detalles de pago - Keeping the purple colors as requested */}
                      <div className="overflow-hidden rounded-lg border border-purple-100 bg-background">
                        <div className="bg-purple-50 px-3 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500 text-primary-foreground">
                              <span className="text-xs font-bold">S/</span>
                            </div>
                            <div className="text-sm font-medium text-purple-800">Detalles de pago</div>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between border-b border-dashed border-purple-100 py-1.5">
                            <span className="text-xs text-muted-foreground">Método</span>
                            <span className="text-xs font-semibold text-foreground">
                              {getPaymentMethodLabel(detail.method)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-dashed border-purple-100 py-1.5">
                            <span className="text-xs text-muted-foreground">Precio unitario</span>
                            <span className="text-xs font-semibold text-foreground">
                              S/ {detail.unitPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-1.5">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <span className="text-xs font-bold text-foreground">S/ {detail.subtotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Barra de acciones */}
                    <div className="mt-1 flex flex-col sm:flex-row gap-2 items-center justify-between rounded-lg bg-background p-2 shadow-sm">
                      <div className="flex items-center space-x-1">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            detail.status === "PENDING"
                              ? "bg-amber-500"
                              : detail.status === "PAID"
                                ? "bg-green-500"
                                : "bg-rose-500"
                          )}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          {detail.status === "PENDING"
                            ? "Pendiente de pago"
                            : detail.status === "PAID"
                              ? "Pago completado"
                              : "Pago cancelado"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 border-border text-xs text-foreground hover:bg-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDetail(detail);
                        }}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Editar detalle
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
