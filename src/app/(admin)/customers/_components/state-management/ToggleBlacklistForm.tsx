"use client";

import type React from "react";
import { format, parse } from "date-fns";
import { useEffect } from "react";
import { AlertTriangle, Ban, CheckCircle } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ToggleBlacklistSchema } from "../../_schema/toggleBlacklistSchema";
import { Customer } from "../../_types/customer";

interface ToggleBlacklistFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<ToggleBlacklistSchema>;
  onSubmit: (data: ToggleBlacklistSchema) => void;
  isCurrentlyBlacklisted: boolean;
  customer: Customer;
}

export default function ToggleBlacklistForm({
  children,
  form,
  onSubmit,
  isCurrentlyBlacklisted,
  customer,
}: ToggleBlacklistFormProps) {
  const isBlacklist = form.watch("isBlacklist");
  
  // Datos del blacklist actual si existe
  const hasBlacklistData = isCurrentlyBlacklisted && customer.blacklistReason && customer.blacklistDate;

  // Cuando cambia isBlacklist, pre-llenar o limpiar los campos según corresponda
  useEffect(() => {
    if (isBlacklist && isCurrentlyBlacklisted) {
      // Si está agregando a blacklist y el cliente ya tiene datos de blacklist, pre-llenar
      if (customer.blacklistReason) {
        form.setValue("blacklistReason", customer.blacklistReason);
      }
      if (customer.blacklistDate) {
        // Convertir la fecha al formato yyyy-MM-dd
        const dateStr = format(new Date(customer.blacklistDate), "yyyy-MM-dd");
        form.setValue("blacklistDate", dateStr);
      }
    } else if (!isBlacklist) {
      // Si está removiendo de blacklist, limpiar los campos
      form.setValue("blacklistReason", "");
      form.setValue("blacklistDate", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlacklist, isCurrentlyBlacklisted]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="isBlacklist"
          render={({ field }) => (
            <FormItem className="relative">
              <div
                className={`
                  p-5 rounded-xl border dark:border-slate-700 border-slate-200
                  transition-all duration-300 ease-in-out
                  ${field.value ? "shadow-md dark:bg-red-900/20 bg-red-50/50" : "dark:bg-slate-900/60 bg-white"}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        relative overflow-hidden rounded-lg w-10 h-10 flex items-center justify-center
                        ${field.value ? "dark:bg-red-700 bg-red-100" : "dark:bg-slate-800 bg-slate-50"}
                      `}
                    >
                      {field.value ? (
                        <Ban
                          className={`size-5 ${field.value ? "dark:text-red-200 text-red-700" : "dark:text-slate-400 text-slate-500"}`}
                        />
                      ) : (
                        <AlertTriangle
                          className={`size-5 ${field.value ? "dark:text-red-200 text-red-700" : "dark:text-slate-400 text-slate-500"}`}
                        />
                      )}
                      {field.value && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-red-600 dark:bg-red-400"></div>
                      )}
                    </div>
                    <div>
                      <FormLabel htmlFor="isBlacklist" className="text-base font-medium tracking-tight block">
                        Estado de Lista Negra
                      </FormLabel>
                      <FormDescription className="text-xs dark:text-slate-400">
                        {field.value
                          ? "El cliente será agregado a la lista negra"
                          : "El cliente será removido de la lista negra"}
                      </FormDescription>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <span
                      className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        field.value
                          ? "dark:bg-red-700 bg-red-100 dark:text-red-200 text-red-700"
                          : "dark:bg-slate-800 bg-slate-100 dark:text-slate-400 text-slate-500"
                      }`}
                    >
                      {field.value ? "Lista Negra" : "Normal"}
                    </span>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="isBlacklist"
                        aria-label="Alternar estado de lista negra"
                        className="data-[state=checked]:dark:bg-red-500 data-[state=checked]:bg-red-700"
                      />
                    </FormControl>
                  </div>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Solo mostrar estos campos si isBlacklist es true */}
        {isBlacklist && (
          <>
            <FormField
              control={form.control}
              name="blacklistReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razón del Blacklist</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      Icon={AlertTriangle}
                      placeholder="Ingrese la razón por la cual se agrega a la lista negra"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Explique el motivo por el cual se agrega a la lista negra</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blacklistDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="blacklistDate">Fecha del Blacklist</FormLabel>
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
                  <FormDescription>Seleccione la fecha en que se agrega a la lista negra</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Si está removiendo de blacklist, mostrar detalles del blacklist actual */}
        {!isBlacklist && isCurrentlyBlacklisted && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <CheckCircle className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Remover de Lista Negra
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Al remover el cliente de la lista negra, se eliminarán automáticamente la razón y la fecha
                    asociadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Mostrar detalles del blacklist actual si existen */}
            {hasBlacklistData && (
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <AlertTriangle className="size-4 text-slate-600 dark:text-slate-400" />
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Detalles del Blacklist Actual
                    </p>
                  </div>

                  {customer.blacklistReason && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Razón del Blacklist:
                      </p>
                      <p className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                        {customer.blacklistReason}
                      </p>
                    </div>
                  )}

                  {customer.blacklistDate && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Fecha del Blacklist:
                      </p>
                      <p className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                        {format(new Date(customer.blacklistDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  )}

                  {(customer.blacklistedById || customer.blacklistedBy) && (
                    <div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Agregado por:
                      </p>
                      <p className="text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                        {customer.blacklistedBy
                          ? `${customer.blacklistedBy.name} (${customer.blacklistedBy.email})`
                          : `Usuario ID: ${customer.blacklistedById}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {children}
      </form>
    </Form>
  );
}

