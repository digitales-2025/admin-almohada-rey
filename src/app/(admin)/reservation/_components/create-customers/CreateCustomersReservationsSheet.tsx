"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { getCountries } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es.json";

import { useCustomers } from "@/app/(admin)/customers/_hooks/use-customers";
import { customersSchema, type CreateCustomersSchema } from "@/app/(admin)/customers/_schema/createCustomersSchema";
import { CountryOption } from "@/components/country-autocomplete";
import { Option } from "@/components/ui/autocomplete";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { departments } from "@/data/department";
import { cn } from "@/lib/utils";
import { City } from "@/types/city";
import CreateCustomersReservationsForm from "./CreateCustomersReservationsForm";

const dataForm = {
  button: "Crear cliente",
  title: "Crear Cliente",
  description: "Complete los detalles a continuación para crear nuevos clientes.",
};

interface CreateCustomersReservationsSheetProps {
  refetch: () => void;
}

export function CreateCustomersReservationsSheet({ refetch }: CreateCustomersReservationsSheetProps) {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateCustomer, isSuccessCreateCustomer } = useCustomers();
  const [isHovered, setIsHovered] = useState(false);

  const form = useForm<CreateCustomersSchema>({
    resolver: zodResolver(customersSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      birthPlace: "",
      country: "",
      documentType: undefined,
      documentNumber: "",
      maritalStatus: undefined,
      occupation: "",
    },
  });

  const onSubmit = async (input: CreateCustomersSchema) => {
    const { hasCompany, email, birthDate, ...rest } = input;
    startCreateTransition(() => {
      onCreateCustomer({
        ...rest,
        ...(birthDate && { birthDate: birthDate }),
        ...(email && { email: email }),
        ...(hasCompany && {
          companyName: rest.companyName,
          ruc: rest.ruc,
          companyAddress: rest.companyAddress,
        }),
      });
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessCreateCustomer) {
      form.reset();
      refetch();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateCustomer]);

  const [cities, setCities] = useState<City[]>([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

  const departmentOptions: Option[] = departments.map((department) => ({
    value: department.name,
    label: department.name,
  }));

  const countryOptions: CountryOption[] = getCountries().map((country) => ({
    value: es[country],
    label: es[country] || country,
    original: country,
  }));

  const handleDepartmentChange = (departmentName: string) => {
    const selectedDepartment = departments.find((dept) => dept.name === departmentName);
    const selectedCities = selectedDepartment?.cities || [];
    setCities(selectedCities);
    setIsDepartmentSelected(true);
    form.setValue("province", "");
  };

  const ActionCardTrigger = () => (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setOpen(true)}
    >
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-background to-background/80 p-1 transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex flex-col items-center justify-center gap-4 rounded-lg bg-background/80 px-6 py-8 text-center transition-all duration-300">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Registro de nuevo cliente</h3>
            <p className="text-sm text-muted-foreground">Complete la información para registrar un nuevo cliente</p>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 text-primary font-medium transition-all duration-300",
              isHovered ? "translate-x-1" : ""
            )}
          >
            <span className="text-sm">Crear nuevo cliente</span>
            <ArrowRight className={cn("h-4 w-4 transition-transform duration-300", isHovered ? "translate-x-1" : "")} />
          </div>

          <div className="absolute -right-1 -top-1"></div>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <ActionCardTrigger />
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">{dataForm.title}</SheetTitle>
          <SheetDescription>{dataForm.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <CreateCustomersReservationsForm
            form={form}
            onSubmit={onSubmit}
            cities={cities}
            countryOptions={countryOptions}
            departmentOptions={departmentOptions}
            isDepartmentSelected={isDepartmentSelected}
            handleDepartmentChange={handleDepartmentChange}
          >
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="button" disabled={isCreatePending} onClick={() => form.handleSubmit(onSubmit)()}>
                  {isCreatePending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Crear
                </Button>
                <SheetClose asChild>
                  <Button variant="outline" type="button" onClick={handleClose}>
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </CreateCustomersReservationsForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
