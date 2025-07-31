import { UseFormRegister, UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateReservationInput } from "../../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../../_statics/forms";

interface PersonalDataStepProps {
  form: UseFormReturn<CreateReservationInput>;
  activeGuest: number;
  register: UseFormRegister<CreateReservationInput>;
}

export default function PersonalDataStep({ form, activeGuest, register }: PersonalDataStepProps) {
  return (
    <div className="gap-6">
      <div className="space-y-6">
        <FormItem>
          <FormLabel>Nombre y Apellido</FormLabel>
          <FormControl>
            <Input {...register(`guests.${activeGuest}.name` as const)} />
          </FormControl>
          <CustomFormDescription
            required={FORMSTATICS.guests.subFields?.name?.required ?? false}
            validateOptionalField={true}
          />
          <FormMessage>
            {form.formState.errors.guests?.[activeGuest]?.name &&
              form.formState.errors.guests[activeGuest]?.name?.message}
          </FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Edad</FormLabel>
          <FormControl>
            <Input {...register(`guests.${activeGuest}.age` as const)} type="number" min={0} placeholder="0" />
          </FormControl>
          <CustomFormDescription
            required={FORMSTATICS.guests.subFields?.age.required ?? false}
            validateOptionalField={true}
          />
          <FormMessage>
            {form.formState.errors.guests?.[activeGuest]?.age &&
              form.formState.errors.guests[activeGuest]?.age?.message}
          </FormMessage>
        </FormItem>
      </div>
    </div>
  );
}
