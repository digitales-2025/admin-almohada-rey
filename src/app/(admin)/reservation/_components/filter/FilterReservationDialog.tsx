"use client";

import React, { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CalendarPlus, Filter, LoaderCircle, User, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Customer } from "@/app/(admin)/customers/_types/customer";
import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
// import { CardDescription } from "@/components/ui/card";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { PaginationParams } from "@/types/api/paginated-response";
import { createPeruBookingDateTime, formatPeruBookingDate } from "@/utils/peru-datetime";
import { PaginatedReservationHookResponse } from "../../_hooks/use-reservation";
import {
  FilterByCheckInOutInput,
  FilterByCheckInOutSchema,
  FilterByCustomerCheckInOutInput,
  FilterByCustomerCheckInOutSchema,
  FilterByCustomerInput,
  FilterByCustomerSchema,
} from "../../_schemas/reservation.schemas";
import { PaginatedReservationParams } from "../../_services/reservationApi";
import { FORMSTATICS } from "../../_statics/forms";
import { SearchCustomerCombobox } from "../search/SearchCustomerCombobox";
import { FilterReservationTabCardContent } from "./FilterReservationTabCardContent";

type CurrentFilterOptions = PaginatedReservationParams;
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

  const TAB_OPTIONS = useMemo(
    () => ({
      BY_CUSTOMER: {
        label: "Por cliente",
        value: "BY_CUSTOMER",
        description: "Selecciona el cliente para filtrar las reservas",
      },
      BY_CHECK_INOUT: {
        label: "Por fechas",
        value: "BY_CHECK_INOUT",
        description: "Selecciona las fechas de check-in y check-out para filtrar las reservas",
      },
      BY_CUSTOMER_N_CHECK_INOUT: {
        label: "Por cliente y fechas",
        value: "BY_STORAGE_N_PRODUCT",
        description: "Selecciona un almacén y un producto para filtrar el stock",
      },
      ALL_BOOKINGS: {
        label: "Todos las reservas",
        value: "ALL_BOOKINGS",
        description: "Muestra todas las reservas",
      },
    }),
    []
  );

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  const todayFormatted = today.toISOString().split("T")[0];
  const tomorrowFormatted = tomorrow.toISOString().split("T")[0];
  //   const dayAfterTomorrowFormatted = dayAfterTomorrow.toISOString().split("T")[0];

  const { checkIn, checkOut } = createPeruBookingDateTime(todayFormatted, tomorrowFormatted);

  const [open, setOpen] = useState(false);
  //CONTROLA LAS RERENDIRACIONES DE LOS TABS Y SUS CONTENTS
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS.ALL_BOOKINGS.value);

  const { queryResponse, updateFilters } = paginatedHookResponse;

  const { data, isLoading, isError, isSuccess } = queryResponse;

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const filterByCustomerForm = useForm({
    resolver: zodResolver(FilterByCustomerSchema),
    defaultValues: {
      customerId: "",
    },
  });

  const filterByCheckInCheckOutForm = useForm({
    resolver: zodResolver(FilterByCheckInOutSchema),
    defaultValues: {
      checkInDate: checkIn,
      checkOutDate: checkOut,
    },
  });

  const filterByCustomerAndDatesForm = useForm({
    resolver: zodResolver(FilterByCustomerCheckInOutSchema),
    defaultValues: {
      customerId: "",
      checkInDate: checkIn,
      checkOutDate: checkOut,
    },
  });

  const defaultPaginationConfig: PaginationParams = {
    page: 1,
    pageSize: 10,
  };

  // const onSubmitAllReservations = useCallback(
  //   ({ pagination = defaultPaginationConfig }: PaginatedReservationParams) => {
  //     const localFilters: PaginatedReservationParams = {
  //       pagination,
  //     };
  //     if (onSaveFilter) {
  //       onSaveFilter(localFilters);
  //       if (isSuccess && data) handleClose();
  //     } else {
  //       updateFilters(localFilters);
  //       if (isError) {
  //         toast.error("Error al filtrar reservaciones");
  //       }
  //       if (data) {
  //         toast.success("Reservas filtrado correctamente");
  //         handleClose();
  //       }
  //     }
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [updateFilters]
  // );

  const onSubmitCustomer = useCallback(
    (input: FilterByCustomerInput) => {
      const localFilters: PaginatedReservationParams = {
        pagination: defaultPaginationConfig,
        fieldFilters: {
          customerId: input.customerId,
        },
      };
      if (onSaveFilter) {
        onSaveFilter(localFilters);
        if (isSuccess && data) handleClose();
      } else {
        updateFilters(localFilters);
        if (isError) {
          toast.error("Error al filtrar reservaciones");
        }
        if (data) {
          toast.success("Reservas filtrado correctamente");
          handleClose();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFilters]
  );

  const onSubmitCheckInOut = useCallback(
    (values: FilterByCheckInOutInput) => {
      const localFilters: PaginatedReservationParams = {
        pagination: defaultPaginationConfig,
        fieldFilters: {
          checkInDate: values.checkInDate,
          checkOutDate: values.checkOutDate,
        },
      };
      if (onSaveFilter) {
        onSaveFilter(localFilters);
        if (isSuccess && data) handleClose();
      } else {
        updateFilters(localFilters);
        if (isError) {
          toast.error("Error al filtrar reservaciones");
        }
        if (data) {
          toast.success("Reservas filtrado correctamente");
          handleClose();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFilters]
  );

  const onSubmitStorageAndProduct = useCallback(
    (input: FilterByCustomerCheckInOutInput) => {
      const localFilters: PaginatedReservationParams = {
        pagination: defaultPaginationConfig,
        fieldFilters: {
          customerId: input.customerId,
          checkInDate: input.checkInDate,
          checkOutDate: input.checkOutDate,
        },
      };
      if (onSaveFilter) {
        onSaveFilter(localFilters);
        if (isSuccess && data) handleClose();
      } else {
        updateFilters(localFilters);
        if (isError) {
          toast.error("Error al filtrar reservaciones");
        }
        if (data) {
          toast.success("Reservas filtrado correctamente");
          handleClose();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFilters]
  );

  if (isError) {
    toast.error("Error al filtrar stock");
  }
  if (isLoading) {
    toast.success("Filtrando...");
  }

  const DialogFooterContent = () => (
    <div className="gap-2 sm:space-x-0 flex sm:flex-row-reverse flex-row-reverse w-full">
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
      <Filter />
      {FILTER_DIALOG_MESSAGES.button}
    </Button>
  );

  const SubmitButton = ({ type = "submit", onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Button {...rest} type={type} className="w-full" disabled={isLoading} onClick={onClick}>
      {isLoading ? (
        <div>
          <span className="animate-spin">
            <LoaderCircle></LoaderCircle>
          </span>
          <span>Filtrando...</span>
        </div>
      ) : (
        FILTER_DIALOG_MESSAGES.submitButton
      )}
    </Button>
  );

  const FilteringTabs = () => (
    <div>
      <Tabs
        defaultValue={TAB_OPTIONS.BY_CUSTOMER.value}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 h-fit">
          {/* <TabsTrigger value={TAB_OPTIONS.ALL_BOOKINGS.value}>{TAB_OPTIONS.ALL_BOOKINGS.label}</TabsTrigger> */}
          <TabsTrigger value={TAB_OPTIONS.BY_CUSTOMER.value}>
            <User className="size-4"></User>
            {TAB_OPTIONS.BY_CUSTOMER.label}
          </TabsTrigger>
          <TabsTrigger value={TAB_OPTIONS.BY_CHECK_INOUT.value}>
            <CalendarPlus className="size-4"></CalendarPlus>
            {TAB_OPTIONS.BY_CHECK_INOUT.label}
          </TabsTrigger>
          <TabsTrigger value={TAB_OPTIONS.BY_CUSTOMER_N_CHECK_INOUT.value} className="truncate sm:text-ellipsis">
            <Users className="size-4"></Users>
            {TAB_OPTIONS.BY_CUSTOMER_N_CHECK_INOUT.label}
          </TabsTrigger>
        </TabsList>

        {/* <FilterReservationTabCardContent
          value={TAB_OPTIONS.ALL_BOOKINGS.value}
          title={TAB_OPTIONS.ALL_BOOKINGS.label}
          description={TAB_OPTIONS.ALL_BOOKINGS.description}
        >
          <section className="space-y-4">
            <header className="flex flex-col space-y-2 justify-center items-center">
              <Info className="size-8"></Info>
              <CardDescription className="text-center">Este es el filtro por defecto</CardDescription>
            </header>
            <SubmitButton
              type="button"
              onClick={() =>
                onSubmitAllReservations({
                  pagination: {
                    page: 1,
                    pageSize: 10,
                  },
                })
              }
              className="w-full"
            >
              {FILTER_DIALOG_MESSAGES.submitButton}
            </SubmitButton>
          </section>
        </FilterReservationTabCardContent> */}

        <FilterReservationTabCardContent
          value={TAB_OPTIONS.BY_CUSTOMER.value}
          title={TAB_OPTIONS.BY_CUSTOMER.label}
          description={TAB_OPTIONS.BY_CUSTOMER.description}
        >
          <Form {...filterByCustomerForm}>
            <form
              onSubmit={filterByCustomerForm.handleSubmit(onSubmitCustomer)}
              className="space-y-4 flex flex-col items-center"
            >
              <FormField
                control={filterByCustomerForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Seleccionar cliente</FormLabel>
                    <SearchCustomerCombobox
                      onValueChange={(_val, c) => {
                        const customer = c as Customer;
                        field.onChange(customer.id);
                      }}
                      className="w-full truncate sm:text-ellipsis"
                    />
                    <FormMessage />
                    <FormDescription>Solo visualizará clientes activos</FormDescription>
                  </FormItem>
                )}
              ></FormField>
              <SubmitButton></SubmitButton>
            </form>
          </Form>
        </FilterReservationTabCardContent>

        <FilterReservationTabCardContent
          value={TAB_OPTIONS.BY_CHECK_INOUT.value}
          title={TAB_OPTIONS.BY_CHECK_INOUT.label}
          description={TAB_OPTIONS.BY_CHECK_INOUT.description}
        >
          <Form {...filterByCheckInCheckOutForm}>
            <form
              onSubmit={filterByCheckInCheckOutForm.handleSubmit(onSubmitCheckInOut)}
              className="space-y-4 flex flex-col items-center"
            >
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                <FormField
                  control={filterByCheckInCheckOutForm.control}
                  name={"checkInDate"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between h-full">
                      <FormLabel>{FORMSTATICS.checkInDate.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal overflow-ellipsis truncate sm:text-ellipsis",
                                !field.value && "text-muted-foreground "
                              )}
                            >
                              {field.value ? (
                                // Verifica si es string
                                typeof field.value === "string" ? (
                                  formatPeruBookingDate(new Date(field.value).toISOString()).customPeruDateTime
                                    .displayDateTime
                                ) : (
                                  <span>Escoja una fecha</span>
                                )
                              ) : (
                                <span>Escoja una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                            onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                            disabled={(date) => date < new Date("2000-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <CustomFormDescription required={true} validateOptionalField={true} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={filterByCheckInCheckOutForm.control}
                  name={"checkOutDate"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between h-full">
                      <FormLabel>{FORMSTATICS.checkOutDate.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal overflow-ellipsis truncate sm:text-ellipsis",
                                !field.value && "text-muted-foreground "
                              )}
                            >
                              {field.value ? (
                                // Verifica si es string
                                typeof field.value === "string" ? (
                                  formatPeruBookingDate(new Date(field.value).toISOString()).customPeruDateTime
                                    .displayDateTime
                                ) : (
                                  <span>Escoja una fecha</span>
                                )
                              ) : (
                                <span>Escoja una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                            onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                            disabled={(date) =>
                              date < new Date("2000-01-01") ||
                              new Date(filterByCheckInCheckOutForm.watch("checkInDate")) > date
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <CustomFormDescription required={true} validateOptionalField={true} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SubmitButton></SubmitButton>
            </form>
          </Form>
        </FilterReservationTabCardContent>

        <FilterReservationTabCardContent
          value={TAB_OPTIONS.BY_CUSTOMER_N_CHECK_INOUT.value}
          title={TAB_OPTIONS.BY_CUSTOMER_N_CHECK_INOUT.label}
          description={TAB_OPTIONS.BY_CUSTOMER_N_CHECK_INOUT.description}
        >
          <Form {...filterByCustomerAndDatesForm}>
            <form
              onSubmit={filterByCustomerAndDatesForm.handleSubmit(onSubmitStorageAndProduct)}
              className="space-y-4 flex flex-col items-center"
            >
              <FormField
                control={filterByCustomerAndDatesForm.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Seleccionar cliente</FormLabel>
                    <SearchCustomerCombobox
                      onValueChange={(_val, c) => {
                        const customer = c as Customer;
                        field.onChange(customer.id);
                      }}
                      className="w-full truncate sm:text-ellipsis"
                    />
                    <FormMessage />
                    <FormDescription>Solo visualizará clientes activos</FormDescription>
                  </FormItem>
                )}
              ></FormField>
              <div className="grid sm:grid-cols-2 gap-4 w-full">
                <FormField
                  control={filterByCustomerAndDatesForm.control}
                  name={"checkInDate"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between h-full">
                      <FormLabel>{FORMSTATICS.checkInDate.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal overflow-ellipsis truncate sm:text-ellipsis",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                // Verifica si es string
                                typeof field.value === "string" ? (
                                  formatPeruBookingDate(new Date(field.value).toISOString()).customPeruDateTime
                                    .displayDateTime
                                ) : (
                                  <span>Escoja una fecha</span>
                                )
                              ) : (
                                <span>Escoja una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                            onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                            disabled={(date) => date < new Date("2000-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <CustomFormDescription required={true} validateOptionalField={true} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={filterByCustomerAndDatesForm.control}
                  name={"checkOutDate"}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between h-full">
                      <FormLabel>{FORMSTATICS.checkOutDate.label}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal overflow-ellipsis truncate sm:text-ellipsis",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                // Verifica si es string
                                typeof field.value === "string" ? (
                                  formatPeruBookingDate(new Date(field.value).toISOString()).customPeruDateTime
                                    .displayDateTime
                                ) : (
                                  <span>Escoja una fecha</span>
                                )
                              ) : (
                                <span>Escoja una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={typeof field.value === "string" ? new Date(field.value) : undefined}
                            onSelect={(val) => field.onChange(val?.toISOString() ?? "")}
                            disabled={(date) =>
                              date < new Date("2000-01-01") ||
                              new Date(filterByCheckInCheckOutForm.watch("checkInDate")) > date
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <CustomFormDescription required={true} validateOptionalField={true} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SubmitButton></SubmitButton>
            </form>
          </Form>
        </FilterReservationTabCardContent>
      </Tabs>
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
          <FilteringTabs></FilteringTabs>
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
          <FilteringTabs></FilteringTabs>
        </div>
        <DrawerFooter>
          <DialogFooterContent />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
