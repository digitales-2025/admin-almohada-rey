import { Controller, UseFormRegister, UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { CreateReservationInput } from "../../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../../_statics/forms";

interface ContactStepProps {
  form: UseFormReturn<CreateReservationInput>;
  activeGuest: number;
  register: UseFormRegister<CreateReservationInput>;
}

export default function ContactStep({ form, activeGuest, register }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormItem>
          <FormLabel>Teléfono</FormLabel>
          <Controller
            control={form.control}
            name={`guests.${activeGuest}.phone`}
            render={({ field: { onChange, value } }) => (
              <FormControl>
                <PhoneInput
                  defaultCountry="PE"
                  placeholder="Ingrese el número de teléfono"
                  value={value}
                  onChange={onChange}
                />
              </FormControl>
            )}
          />
          <CustomFormDescription
            required={FORMSTATICS.guests.subFields?.phone.required ?? false}
            validateOptionalField={true}
          />
          <FormMessage>
            {form.formState.errors.guests?.[activeGuest]?.phone &&
              form.formState.errors.guests[activeGuest]?.phone?.message}
          </FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...register(`guests.${activeGuest}.email` as const)} />
          </FormControl>
          <CustomFormDescription
            required={FORMSTATICS.guests.subFields?.email.required ?? false}
            validateOptionalField={true}
          />
          <FormMessage>
            {form.formState.errors.guests?.[activeGuest]?.email &&
              form.formState.errors.guests[activeGuest]?.email?.message}
          </FormMessage>
        </FormItem>
      </div>
    </div>
  );
}
