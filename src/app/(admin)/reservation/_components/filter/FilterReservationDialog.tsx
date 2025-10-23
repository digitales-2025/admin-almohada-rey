"use client";

import React, { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, LoaderCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Customer } from "@/app/(admin)/customers/_types/customer";
import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PaginationParams } from "@/types/api/paginated-response";
import { createPeruBookingDateTime } from "@/utils/peru-datetime";
import { useAdvancedReservations } from "../../_hooks/useAdvancedReservations";
import { FilterByCustomerCheckInOutInput, FilterByCustomerCheckInOutSchema } from "../../_schemas/reservation.schemas";
import { PaginatedReservationParams } from "../../_services/reservationApi";
import { SearchCustomerCombobox } from "../search/SearchCustomerCombobox";

type CurrentFilterOptions = PaginatedReservationParams;

// Tipo basado en el retorno de useAdvancedReservations
type PaginatedReservationHookResponse = ReturnType<typeof useAdvancedReservations>;

interface FilterReservationDialogProps {
  paginatedHookResponse: PaginatedReservationHookResponse;
  onSaveFilter?: (params: CurrentFilterOptions) => void;
}

export function FilterReservationDialog({ paginatedHookResponse, onSaveFilter }: FilterReservationDialogProps) {
  const FILTER_DIALOG_MESSAGES = {
    button: "Filtrado avanzado",
    title: "Filtros avanzados de reservaciones",
    description: `Escoge una opción para filtrar las reservas.`,
    cancel: "Cerrar",
    submitButton: "Aplicar",
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFormatted = today.toISOString().split("T")[0];
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];

  const { checkIn, checkOut } = createPeruBookingDateTime(todayFormatted, tomorrowFormatted);

  const [open, setOpen] = useState(false);

  // Guardamos la referencia al cliente seleccionado y su información de visualización
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDisplayInfo, setCustomerDisplayInfo] = useState<string | undefined>(undefined);

  // Estado para manejar el rango de fechas
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: checkIn ? new Date(checkIn) : undefined,
    to: checkOut ? new Date(checkOut) : undefined,
  });

  const filterForm = useForm({
    resolver: zodResolver(FilterByCustomerCheckInOutSchema),
    defaultValues: {
      customerId: "",
      checkInDate: checkIn,
      checkOutDate: checkOut,
    },
  });

  const { data, isLoading, error, updateFilters } = paginatedHookResponse;
  const isError = !!error;
  const isSuccess = !isLoading && !error;
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Efecto para actualizar los valores del formulario cuando cambia el rango de fechas
  useEffect(() => {
    // No modificar la lógica del DateRangePicker que ya funciona para ti
    if (dateRange?.from) {
      filterForm.setValue("checkInDate", dateRange.from.toISOString());
    } else {
      filterForm.setValue("checkInDate", undefined);
    }

    if (dateRange?.to) {
      filterForm.setValue("checkOutDate", dateRange.to.toISOString());
    } else {
      filterForm.setValue("checkOutDate", undefined);
    }
  }, [dateRange, filterForm]);

  // Efecto para conservar el cliente seleccionado
  useEffect(() => {
    // Mantener el ID del cliente cuando se tiene seleccionado uno
    if (selectedCustomer && selectedCustomer.id) {
      filterForm.setValue("customerId", selectedCustomer.id);
    }
  }, [selectedCustomer, filterForm]);

  const onSubmit = useCallback(
    (input: FilterByCustomerCheckInOutInput) => {
      const defaultPaginationConfig: PaginationParams = {
        page: 1,
        pageSize: 10,
      };

      // Creamos un objeto vacío para los filtros
      const fieldFilters: Record<string, any> = {};

      // Solo incluimos campos que tienen un valor definido
      if (input.customerId) {
        fieldFilters.customerId = input.customerId;
      }

      if (input.checkInDate) {
        fieldFilters.checkInDate = input.checkInDate;
      }

      if (input.checkOutDate) {
        fieldFilters.checkOutDate = input.checkOutDate;
      }

      const localFilters: PaginatedReservationParams = {
        pagination: defaultPaginationConfig,
        fieldFilters,
      };

      if (onSaveFilter) {
        onSaveFilter(localFilters);
        if (isSuccess && data) handleClose();
      } else {
        updateFilters(localFilters);
        if (isError) {
          toast.error("Error al filtrar reservaciones");
        } else {
          toast.success("Reservas filtradas correctamente");
          handleClose();
        }
      }
    },
    [updateFilters, onSaveFilter, isSuccess, isError, data, handleClose]
  );

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-2 flex sm:flex-row-reverse flex-col w-full">
      <Button type="button" variant="outline" className="w-full" onClick={handleClose}>
        {FILTER_DIALOG_MESSAGES.cancel}
      </Button>
    </div>
  );

  const TriggerButton = () => (
    <Button
      onClick={() => setOpen(true)}
      variant="default"
      size="sm"
      aria-label="Open menu"
      className="flex p-2 data-[state=open]:bg-muted"
    >
      <Filter className="mr-1" />
      {FILTER_DIALOG_MESSAGES.button}
    </Button>
  );

  const SubmitButton = ({ type = "submit", onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Button {...rest} type={type} className="w-full" disabled={isLoading} onClick={onClick}>
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoaderCircle className="animate-spin" size={16} />
          <span>Filtrando...</span>
        </div>
      ) : (
        FILTER_DIALOG_MESSAGES.submitButton
      )}
    </Button>
  );

  const FilteringForm = () => (
    <div>
      <Form {...filterForm}>
        <form onSubmit={filterForm.handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-center">
          <FormField
            control={filterForm.control}
            name="customerId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Seleccionar cliente</FormLabel>
                <div className="w-full">
                  <SearchCustomerCombobox
                    onValueChange={(_val, c) => {
                      const customer = c as Customer;
                      field.onChange(customer.id);
                      // Guardar el cliente seleccionado y su información de visualización
                      setSelectedCustomer(customer);
                      // Construir el texto para mostrar
                      const displayText = `${customer.name} - ${customer.documentNumber || ""}`;
                      setCustomerDisplayInfo(displayText);
                    }}
                    // Usar el customerDisplayInfo si está disponible, sino usar el documentNumber
                    defaultValue={customerDisplayInfo || selectedCustomer?.documentNumber}
                    className="!w-full"
                  />
                </div>
                <FormMessage />
                <FormDescription>Solo visualizará clientes activos</FormDescription>
              </FormItem>
            )}
          />
          <FormItem className="w-full">
            <FormLabel>Fechas de check-in y check-out</FormLabel>
            <DateRangePicker
              dateRange={dateRange}
              setDateRange={(range) => {
                setDateRange(range);
                // No tocamos la lógica adicional ya que no afecta al cliente
              }}
              placeholder="Seleccionar fechas de check-in y check-out"
              className="w-full"
            />
            <CustomFormDescription required={false} validateOptionalField={false} />
            <FormMessage />
          </FormItem>
          <SubmitButton />
        </form>
      </Form>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
        <DialogContent className="min-w-[calc(384px-2rem)] max-h-[calc(100vh-4rem)] w-s">
          <DialogHeader>
            <DialogTitle>{FILTER_DIALOG_MESSAGES.title}</DialogTitle>
            <DialogDescription>{FILTER_DIALOG_MESSAGES.description}</DialogDescription>
          </DialogHeader>
          <FilteringForm />
          <DialogFooter>
            <DialogFooterContent />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <TriggerButton />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{FILTER_DIALOG_MESSAGES.title}</DrawerTitle>
          <DrawerDescription>{FILTER_DIALOG_MESSAGES.description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-2">
          <FilteringForm />
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
