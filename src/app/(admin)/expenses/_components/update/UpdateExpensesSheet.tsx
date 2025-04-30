"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useExpenses } from "../../_hooks/use-expenses";
import { updateExpenseSchema, UpdateExpenseSchema } from "../../_schema/createExpensesSchema";
import {
  ExpenseCategoryEnum,
  ExpenseDocumentTypeEnum,
  ExpensePaymentMethodEnum,
  HotelExpense,
} from "../../_types/expenses";
import {
  ExpenseCategoryLabels,
  ExpenseDocumentTypeLabels,
  ExpensePaymentMethodLabels,
} from "../../_utils/expenses.utils";

const infoSheet = {
  title: "Actualizar Gasto",
  description: "Actualiza la información del gasto y guarda los cambios",
};

interface UpdateExpensesSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  expense: HotelExpense;
}

export function UpdateExpensesSheet({ expense, ...props }: UpdateExpensesSheetProps) {
  const { onUpdateExpense, isSuccessUpdateExpense, isLoadingUpdateExpense } = useExpenses();

  // Determina si ambos campos son nulos o vacíos
  const shouldHideDocumentFields =
    (expense.documentType == null || expense.documentType === "") &&
    (expense.documentNumber == null || expense.documentNumber === "");

  // Inicializa el switch activado si ambos campos son nulos
  const initialDataDocument = shouldHideDocumentFields ? true : (expense.dataDocument ?? false);

  const form = useForm<UpdateExpenseSchema>({
    resolver: zodResolver(updateExpenseSchema),
    defaultValues: {
      description: expense.description ?? "",
      category: expense.category as ExpenseCategoryEnum,
      paymentMethod: expense.paymentMethod as ExpensePaymentMethodEnum,
      amount: expense.amount,
      date: expense.date,
      documentType: expense.documentType as ExpenseDocumentTypeEnum,
      documentNumber: expense.documentNumber ?? "",
      dataDocument: initialDataDocument,
    },
  });

  // Limpiar y bloquear campos de documento si dataDocument está activo
  useEffect(() => {
    if (form.watch("dataDocument")) {
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-2">
              {/* Descripción */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción de Gasto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Compra de insumos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoría */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as ExpenseCategoryEnum)}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(ExpenseCategoryEnum).map((cat) => {
                            const config = ExpenseCategoryLabels[cat];
                            const Icon = config.icon;
                            return (
                              <SelectItem key={cat} value={cat}>
                                <Icon className={`size-4 mr-2 ${config.className}`} />
                                {config.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Método de pago */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de pago</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as ExpensePaymentMethodEnum)}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un método de pago" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(ExpensePaymentMethodEnum).map((method) => {
                            const config = ExpensePaymentMethodLabels[method];
                            const Icon = config.icon;
                            return (
                              <SelectItem key={method} value={method}>
                                <Icon className={`size-4 mr-2 ${config.className}`} />
                                {config.label}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Monto */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 100.00"
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Switch para dataDocument */}
              <FormField
                control={form.control}
                name="dataDocument"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormLabel className="mb-0">Sin documentos fisicos</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("dataDocument") && (
                <>
                  {/* Tipo de documento */}
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de documento</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(value as ExpenseDocumentTypeEnum)}
                          value={field.value ?? ""}
                          disabled={form.watch("dataDocument")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tipo de documento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {Object.values(ExpenseDocumentTypeEnum).map((doc) => {
                                const config = ExpenseDocumentTypeLabels[doc];
                                const Icon = config.icon;
                                return (
                                  <SelectItem key={doc} value={doc}>
                                    <Icon className={`size-4 mr-2 ${config.className}`} />
                                    {config.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Número de documento */}
                  <FormField
                    control={form.control}
                    name="documentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Documento</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: F001-001234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

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
            </form>
          </Form>
        </ScrollArea>
        <Separator className="my-6" />
      </SheetContent>
    </Sheet>
  );
}
