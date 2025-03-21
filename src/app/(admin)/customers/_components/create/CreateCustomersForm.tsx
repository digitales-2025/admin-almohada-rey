import React, { useState } from "react";
import { BriefcaseBusiness, Home, IdCard, Mail, MapPin, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Country, getCountries } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import es from "react-phone-number-input/locale/es.json";

import { CountryAutocomplete, CountryOption } from "@/components/country-autocomplete";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departments } from "@/data/department";
import { City } from "@/types/city";
import { CreateCustomersSchema } from "../../_schema/createCustomersSchema";
import { CustomerDocumentType, CustomerMaritalStatus } from "../../_types/customer";
import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "../../_utils/customers.utils";

interface CreateCustomersFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateCustomersSchema>;
  onSubmit: (data: CreateCustomersSchema) => void;
}

export default function CreateCustomersForm({ children, form, onSubmit }: CreateCustomersFormProps) {
  // Estado para almacenar las ciudades del departamento seleccionado
  const [cities, setCities] = useState<City[]>([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<Country>("PE");

  const countryOptions: CountryOption[] = getCountries().map((country) => ({
    value: es[country],
    label: es[country] || country,
    original: country,
  }));

  // Prepara las opciones para el AutoComplete
  const departmentOptions: Option[] = departments.map((department) => ({
    value: department.name,
    label: department.name,
  }));

  // Manejar el cambio de departamento
  const handleDepartmentChange = (departmentName: string) => {
    const selectedDepartment = departments.find((dept) => dept.name === departmentName);
    const selectedCities = selectedDepartment?.cities || [];
    setCities(selectedCities);
    setIsDepartmentSelected(true);
    // Resetear el campo de ciudad cuando se cambia el departamento
    form.setValue("province", "");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <InputWithIcon Icon={User} placeholder="Ejm: Juan Perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <InputWithIcon Icon={Home} placeholder="Ejm: Jr. Los Pinos 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País</FormLabel>
              <FormControl>
                <CountryAutocomplete
                  options={countryOptions}
                  flags={flags}
                  emptyMessage="No se encontró el país."
                  placeholder="Seleccione un país"
                  onValueChange={(selectedOption) => {
                    field.onChange(selectedOption?.value || "");
                    // Actualizar el código de país para el PhoneInput
                    if (selectedOption) {
                      setSelectedCountryCode(selectedOption.original as Country);
                    }
                  }}
                  value={countryOptions.find((option) => option.value === field.value) || undefined}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("country") === "Perú" && (
          <>
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={departmentOptions}
                      emptyMessage="No se encontró el departamento."
                      placeholder="Seleccione un departamento"
                      onValueChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || "");
                        handleDepartmentChange(selectedOption?.value || "");
                      }}
                      value={departmentOptions.find((option) => option.value === field.value) || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="city">Provincia</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isDepartmentSelected}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una provincia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {cities.map((city) => (
                          <SelectItem key={city.id.toString()} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lugar de nacimiento</FormLabel>
              <FormControl>
                <InputWithIcon Icon={MapPin} placeholder="Ejm: Lima" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocupación</FormLabel>
              <FormControl>
                <InputWithIcon Icon={BriefcaseBusiness} placeholder="Ejm: Ingeniero" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry={selectedCountryCode}
                  placeholder="999 888 777"
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="documentType">Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(CustomerDocumentType).map((documentType) => {
                      const documentTypeConfig = CustomerDocumentTypeLabels[documentType];
                      const Icon = documentTypeConfig.icon;

                      return (
                        <SelectItem key={documentType} value={documentType} className="flex items-center gap-2">
                          <Icon className={`size-4 ${documentTypeConfig.className}`} />
                          <span>{documentTypeConfig.label}</span>
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

        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <InputWithIcon Icon={IdCard} placeholder="Ejm: 12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <InputWithIcon Icon={Mail} placeholder="usuario@almohadarey.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maritalStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="documentType">Estado Civil</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un estado civil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(CustomerMaritalStatus).map((maritalStatus) => {
                      const maritalStatusConfig = CustomerMaritalStatusLabels[maritalStatus];
                      const Icon = maritalStatusConfig.icon;

                      return (
                        <SelectItem key={maritalStatus} value={maritalStatus} className="flex items-center gap-2">
                          <Icon className={`size-4 ${maritalStatusConfig.className}`} />
                          <span>{maritalStatusConfig.label}</span>
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

        {children}
      </form>
    </Form>
  );
}
