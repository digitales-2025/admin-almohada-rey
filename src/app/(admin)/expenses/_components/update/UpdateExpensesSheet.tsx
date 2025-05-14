"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useExpenses } from "../../_hooks/use-expenses";
import { updateExpenseSchema, UpdateExpenseSchema } from "../../_schema/createExpensesSchema";
import {
  ExpenseCategoryEnum,
  ExpenseDocumentTypeEnum,
  ExpensePaymentMethodEnum,
  HotelExpenseWithDataDocument,
} from "../../_types/expenses";
import UpdateExpensesForm from "./UpdateExpensesForm";

const infoSheet = {
  title: "Actualizar Gasto",
  description: "Actualiza la información del gasto y guarda los cambios",
};

interface UpdateExpensesSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  expense: HotelExpenseWithDataDocument;
}

export function UpdateExpensesSheet({ expense, ...props }: UpdateExpensesSheetProps) {
  const { onUpdateExpense, isSuccessUpdateExpense, isLoadingUpdateExpense } = useExpenses();

  const form = useForm<UpdateExpenseSchema>({
    resolver: zodResolver(updateExpenseSchema),
    defaultValues: {
      description: expense.description ?? "",
      category: expense.category as unknown as ExpenseCategoryEnum,
      paymentMethod: expense.paymentMethod as unknown as ExpensePaymentMethodEnum,
      amount: expense.amount,
      date: expense.date,
      documentType: expense.documentType as unknown as ExpenseDocumentTypeEnum,
      documentNumber: expense.documentNumber ?? "",
      dataDocument: expense.documentNumber ? false : (expense.dataDocument ?? false),
    },
  });

  useEffect(() => {
    if (props.open) {
      form.reset({
        description: expense.description ?? "",
        category: expense.category as unknown as ExpenseCategoryEnum,
        paymentMethod: expense.paymentMethod as unknown as ExpensePaymentMethodEnum,
        amount: expense.amount,
        date: expense.date,
        documentType: expense.documentType as unknown as ExpenseDocumentTypeEnum,
        documentNumber: expense.documentNumber ?? "",
        dataDocument: expense.documentNumber ? true : (expense.dataDocument ?? true),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, expense]);

  // Limpiar y bloquear campos de documento si dataDocument está inactivo
  useEffect(() => {
    if (!form.watch("dataDocument")) {
      form.setValue("documentType", undefined);
      form.setValue("documentNumber", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("dataDocument")]);

  function onSubmit(input: UpdateExpenseSchema) {
    onUpdateExpense(expense.id, input);
  }

  useEffect(() => {
    if (isSuccessUpdateExpense) {
      form.reset();
      props.onOpenChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateExpense]);

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge variant="secondary">{expense.description}</Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="w-full gap-4 p-4 pt-0">
          <UpdateExpensesForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse flex-wrap gap-2">
                <Button disabled={isLoadingUpdateExpense}>
                  {isLoadingUpdateExpense && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateExpensesForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
