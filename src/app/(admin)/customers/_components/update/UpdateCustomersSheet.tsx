"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { getCountries } from "react-phone-number-input";
import es from "react-phone-number-input/locale/es.json";

import { type CountryOption } from "@/components/country-autocomplete";
import { type Option } from "@/components/ui/autocomplete";
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
import { departments } from "@/data/department";
import type { City } from "@/types/city";
import { useCustomers } from "../../_hooks/use-customers";
import { customersSchema, type CreateCustomersSchema } from "../../_schema/createCustomersSchema";
import { type Customer } from "../../_types/customer";
import UpdateCustomersForm from "./UpdateCustomersForm";

const infoSheet = {
  title: "Actualizar Cliente",
  description: "Actualiza la información del cliente y guarda los cambios",
};

interface UpdateCustomerSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateCustomerSheet({ customer, open, onOpenChange }: UpdateCustomerSheetProps) {
  const { onUpdateCustomer, isSuccessUpdateCustomer, isLoadingUpdateCustomer } = useCustomers();

  const form = useForm<CreateCustomersSchema>({
    resolver: zodResolver(customersSchema),
    defaultValues: {
      name: customer.name ?? "",
      address: customer.address ?? "",
      birthPlace: customer.birthPlace ?? "",
      occupation: customer.occupation ?? "",
      phone: customer.phone ?? "",
      documentType: customer.documentType ?? "",
      documentNumber: customer.documentNumber ?? "",
      email: customer.email ?? "",
      maritalStatus: customer.maritalStatus ?? "",
      country: customer.country ?? "",
      ...(customer.department && {
        department: customer.department ?? "",
        province: customer.province ?? "",
      }),
    },
  });

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

  useEffect(() => {
    if (open) {
      form.reset({
        name: customer.name ?? "",
        address: customer.address ?? "",
        birthPlace: customer.birthPlace ?? "",
        occupation: customer.occupation ?? "",
        phone: customer.phone ?? "",
        documentType: customer.documentType ?? "",
        documentNumber: customer.documentNumber ?? "",
        email: customer.email ?? "",
        maritalStatus: customer.maritalStatus ?? "",
        country: customer.country ?? "",
        ...(customer.department && {
          department: customer.department ?? "",
          province: customer.province ?? "",
        }),
      });

      const selectedDepartment = departments.find(
        (dept) => dept.name.toLowerCase() === customer?.department?.toLowerCase()
      );
      if (selectedDepartment) {
        setCities(selectedDepartment.cities);
        setIsDepartmentSelected(true);

        const selectedCity = selectedDepartment.cities.find(
          (city) => city.name.toLowerCase() === customer?.province?.toLowerCase()
        );
        form.setValue("department", selectedDepartment.name);
        form.setValue("province", selectedCity ? selectedCity.name : "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, customer]);

  const onSubmit = async (input: CreateCustomersSchema) => {
    onUpdateCustomer({
      ...input,
      id: customer.id,
    });
  };

  useEffect(() => {
    if (isSuccessUpdateCustomer) {
      form.reset();
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateCustomer, onOpenChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
              {customer.documentNumber}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateCustomersForm
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
                <Button type="submit" disabled={isLoadingUpdateCustomer}>
                  {isLoadingUpdateCustomer && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Actualizar
                </Button>
                <SheetClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </UpdateCustomersForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
