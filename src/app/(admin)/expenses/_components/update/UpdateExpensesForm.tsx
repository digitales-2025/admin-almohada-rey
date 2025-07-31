import { format, parse } from "date-fns";
import { Landmark } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { UpdateExpenseSchema } from "../../_schema/createExpensesSchema";
import { ExpenseCategoryEnum, ExpenseDocumentTypeEnum, ExpensePaymentMethodEnum } from "../../_types/expenses";
import {
  ExpenseCategoryLabels,
  ExpenseDocumentTypeLabels,
  ExpensePaymentMethodLabels,
} from "../../_utils/expenses.utils";

interface UpdateExpensesFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<UpdateExpenseSchema>;
  onSubmit: (data: UpdateExpenseSchema) => void;
}

export default function UpdateExpensesForm({ children, form, onSubmit }: UpdateExpensesFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
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
              <Select onValueChange={(value) => field.onChange(value as ExpenseCategoryEnum)} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
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
                  <SelectTrigger className="w-full">
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dataDocument"
          render={({ field }) => (
            <FormItem className="relative sm:col-span-2">
              <div
                className={`
                        p-5 rounded-xl border dark:border-slate-700 border-slate-200
                        transition-all duration-300 ease-in-out
                        ${field.value ? "shadow-md dark:bg-slate-800/40 bg-slate-50/50" : "dark:bg-slate-900/60 bg-white"}
                      `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                              relative overflow-hidden rounded-lg w-10 h-10 flex items-center justify-center
                              ${field.value ? "dark:bg-slate-700 bg-slate-100" : "dark:bg-slate-800 bg-slate-50"}
                            `}
                    >
                      <Landmark
                        className={`size-5 ${field.value ? "dark:text-slate-200 text-slate-700" : "dark:text-slate-400 text-slate-500"}`}
                      />
                      {field.value && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-slate-600 dark:bg-slate-400"></div>
                      )}
                    </div>
                    <div>
                      <FormLabel htmlFor="hasCompany" className="text-base font-medium tracking-tight block">
                        Documentación Fiscal
                      </FormLabel>
                      <FormDescription className="text-xs dark:text-slate-400">
                        {field.value ? "Incluye comprobante fiscal" : "Sin documentación de respaldo"}
                      </FormDescription>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="dataDocument"
                        aria-label="Alternar si cuenta con documentación fiscal"
                        className="data-[state=checked]:dark:bg-slate-500 data-[state=checked]:bg-slate-700"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />
        {form.watch("dataDocument") && (
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
                    disabled={!form.watch("dataDocument")}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
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

        {children}
      </form>
    </Form>
  );
}
