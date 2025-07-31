"use client";

import React, { useState } from "react";

import { PaymentStatus, type PaymentDetail } from "../../../_types/payment";
import { DeletePaymentDetailDialog } from "./delete/DeletePaymentDetailDialog";
import { PaymentStatusColumn } from "./PaymentStatusColumn";

interface PaymentDetailGroup {
  key: string;
  date: string;
  method: string;
  items: PaymentDetail[];
  total: number;
}

interface InformationPaymentDetailProps {
  group: PaymentDetailGroup;
  expandedCards: string[];
  toggleCardExpand: (id: string) => void;
  handleEditDetail: (detail: PaymentDetail) => void;
}

export default function InformationPaymentDetail({
  group,
  expandedCards,
  toggleCardExpand,
  handleEditDetail,
}: InformationPaymentDetailProps) {
  const [removeDialog, setRemoveDialog] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<PaymentDetail | null>(null);
  const handleRemoveDetail = (detail: PaymentDetail) => {
    setSelectedDetail(detail);
    setRemoveDialog(true);
  };

  return (
    <div className="border-t border-border bg-card dark:border-border">
      {/* Diseño tipo Kanban con columnas por estado */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        {/* Columna de pagos pendientes */}
        <PaymentStatusColumn
          status={PaymentStatus.PENDING}
          items={group.items}
          expandedCards={expandedCards}
          toggleCardExpand={toggleCardExpand}
          handleEditDetail={handleEditDetail}
          handleRemoveDetail={handleRemoveDetail}
        />

        {/* Columna de pagos completados */}
        <PaymentStatusColumn
          status={PaymentStatus.PAID}
          items={group.items}
          expandedCards={expandedCards}
          toggleCardExpand={toggleCardExpand}
          handleEditDetail={handleEditDetail}
          handleRemoveDetail={handleRemoveDetail}
        />
      </div>
      {removeDialog && (
        <DeletePaymentDetailDialog paymentDetail={selectedDetail} open={removeDialog} onOpenChange={setRemoveDialog} />
      )}
    </div>
  );
}
