import { UseFormRegister, UseFormReturn } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { CreateReservationInput } from "../../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../../_statics/forms";

interface AdditionalInformationProps {
  form: UseFormReturn<CreateReservationInput>;
  activeGuest: number;
  register: UseFormRegister<CreateReservationInput>;
}

export default function AdditionalInformation({ form, activeGuest, register }: AdditionalInformationProps) {
  return (
    <div className="space-y-6">
      <FormItem>
        <FormLabel>Información Adicional</FormLabel>
        <FormControl>
          <Textarea
            {...register(`guests.${activeGuest}.additionalInfo` as const, {
              setValueAs: (v) => (v === "" ? undefined : String(v)),
            })}
            placeholder="Preferencias, necesidades especiales, alergias, etc."
            className="min-h-[150px]"
          />
        </FormControl>
        <CustomFormDescription
          required={FORMSTATICS.guests.subFields?.additionalInfo.required ?? false}
          validateOptionalField={true}
        />
        <FormMessage>
          {form.formState.errors.guests?.[activeGuest]?.additionalInfo &&
            form.formState.errors.guests[activeGuest]?.additionalInfo?.message}
        </FormMessage>
      </FormItem>
    </div>
  );
}
