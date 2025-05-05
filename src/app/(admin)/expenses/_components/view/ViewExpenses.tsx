"use client";

import { format, parseISO } from "date-fns";
import { Calendar, CreditCard, DollarSign, FileText, Hash, Layers, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { HotelExpense } from "../../_types/expenses";
import {
  ExpenseCategoryLabels,
  ExpenseDocumentTypeLabels,
  ExpensePaymentMethodLabels,
} from "../../_utils/expenses.utils";

interface ViewExpensesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: HotelExpense;
}

export function ViewExpenses({ open, onOpenChange, expense }: ViewExpensesProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Función de ayuda para verificar si una clave existe en un objeto
  const isValidKey = <T extends object>(obj: T, key: any): key is keyof T => {
    return key != null && Object.prototype.hasOwnProperty.call(obj, key);
  };

  const content = (
    <div className="space-y-4 py-2">
      {/* Descripción */}
      <div>
        <span className="font-semibold flex items-center gap-2">
          <Tag className="size-4" />
          Descripción:
        </span>
        <div>{expense.description || "Sin dato"}</div>
      </div>
      {/* Datos alineados y responsivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-4">
          {/* Categoría */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <Layers className="size-4" />
              Categoría:
            </span>
            <div>
              {expense.category && isValidKey(ExpenseCategoryLabels, expense.category) ? (
                <Badge
                  variant="outline"
                  className={ExpenseCategoryLabels[expense.category as keyof typeof ExpenseCategoryLabels]?.className}
                >
                  {(() => {
                    const Icon = ExpenseCategoryLabels[expense.category as keyof typeof ExpenseCategoryLabels]?.icon;
                    return Icon ? <Icon className="size-4 mr-1" /> : null;
                  })()}
                  {ExpenseCategoryLabels[expense.category as keyof typeof ExpenseCategoryLabels]?.label ||
                    String(expense.category)}
                </Badge>
              ) : (
                <span>{expense.category ? String(expense.category) : "Sin dato"}</span>
              )}
            </div>
          </div>
          {/* Monto */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <DollarSign className="size-4" />
              Monto:
            </span>
            <div>{expense.amount != null ? `S/ ${expense.amount}` : "Sin dato"}</div>
          </div>
          {/* Tipo de documento */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <FileText className="size-4" />
              Tipo de documento:
            </span>
            <div>
              {expense.documentType && isValidKey(ExpenseDocumentTypeLabels, String(expense.documentType)) ? (
                <Badge
                  variant="outline"
                  className={
                    ExpenseDocumentTypeLabels[String(expense.documentType) as keyof typeof ExpenseDocumentTypeLabels]
                      ?.className
                  }
                >
                  {(() => {
                    const Icon =
                      ExpenseDocumentTypeLabels[String(expense.documentType) as keyof typeof ExpenseDocumentTypeLabels]
                        ?.icon;
                    return Icon ? <Icon className="size-4 mr-1" /> : null;
                  })()}
                  {ExpenseDocumentTypeLabels[String(expense.documentType) as keyof typeof ExpenseDocumentTypeLabels]
                    ?.label || String(expense.documentType)}
                </Badge>
              ) : (
                <span>{expense.documentType ? String(expense.documentType) : "Sin dato"}</span>
              )}
            </div>
          </div>
        </div>
        {/* Columna 2 */}
        <div className="space-y-4">
          {/* Método de pago */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <CreditCard className="size-4" />
              Método de pago:
            </span>
            <div>
              {expense.paymentMethod && isValidKey(ExpensePaymentMethodLabels, expense.paymentMethod) ? (
                <Badge
                  variant="outline"
                  className={
                    ExpensePaymentMethodLabels[expense.paymentMethod as keyof typeof ExpensePaymentMethodLabels]
                      ?.className
                  }
                >
                  {(() => {
                    const Icon =
                      ExpensePaymentMethodLabels[expense.paymentMethod as keyof typeof ExpensePaymentMethodLabels]
                        ?.icon;
                    return Icon ? <Icon className="size-4 mr-1" /> : null;
                  })()}
                  {ExpensePaymentMethodLabels[expense.paymentMethod as keyof typeof ExpensePaymentMethodLabels]
                    ?.label || String(expense.paymentMethod)}
                </Badge>
              ) : (
                <span>{expense.paymentMethod ? String(expense.paymentMethod) : "Sin dato"}</span>
              )}
            </div>
          </div>
          {/* Fecha */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <Calendar className="size-4" />
              Fecha:
            </span>
            <div>
              {expense.date
                ? (() => {
                    try {
                      return format(parseISO(expense.date), "yyyy-MM-dd");
                    } catch {
                      return expense.date;
                    }
                  })()
                : "Sin dato"}
            </div>
          </div>
          {/* N° Documento */}
          <div>
            <span className="font-semibold flex items-center gap-2">
              <Hash className="size-4" />
              N° Documento:
            </span>
            <div>{expense.documentNumber || "Sin dato"}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Detalle del Gasto</DialogTitle>
            <DialogDescription>Visualiza la información completa del gasto seleccionado.</DialogDescription>
          </DialogHeader>
          {content}
          <div className="flex justify-end pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Móvil: Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detalle del Gasto</DrawerTitle>
          <DrawerDescription>Visualiza la información completa del gasto seleccionado.</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[40vh] px-0">
          <div className="px-4">{content}</div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
