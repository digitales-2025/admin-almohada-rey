import { BriefcaseBusiness, Home, IdCard, Mail, MapPin, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import flags from "react-phone-number-input/flags";

import { CountryAutocomplete, type CountryOption } from "@/components/country-autocomplete";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { City } from "@/types/city";
import { type CreateCustomersSchema } from "../../_schema/createCustomersSchema";
import { CustomerDocumentType, CustomerMaritalStatus } from "../../_types/customer";
import { CustomerDocumentTypeLabels, CustomerMaritalStatusLabels } from "../../_utils/customers.utils";

interface UpdateCustomerSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateCustomersSchema>;
  onSubmit: (data: CreateCustomersSchema) => void;
  countryOptions: CountryOption[];
  departmentOptions: Option[];
  handleDepartmentChange: (departmentName: string) => void;
  cities: City[];
  isDepartmentSelected: boolean;
}

export default function UpdateCustomersForm({
  children,
  form,
  onSubmit,
  countryOptions,
  departmentOptions,
  handleDepartmentChange,
  cities,
  isDepartmentSelected,
}: UpdateCustomerSheetProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <InputWithIcon Icon={User} placeholder="Ejm: Juan Perez" {...field} className="capitalize" />
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
                  defaultCountry="PE"
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
