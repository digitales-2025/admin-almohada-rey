import { IdCard } from "lucide-react";
import { UseFieldArrayReturn, UseFormRegister, UseFormReturn, UseFormWatch } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateReservationInput, DocumentType } from "../../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../../_statics/forms";
import { documentTypeStatusConfig } from "../../../_types/document-type.enum.config";

interface DocumentStepProps {
  form: UseFormReturn<CreateReservationInput>;
  activeGuest: number;
  register: UseFormRegister<CreateReservationInput>;
  watch: UseFormWatch<CreateReservationInput>;
  controlledFieldArray: UseFieldArrayReturn<CreateReservationInput>;
}

export default function DocumentStep({ form, activeGuest, register, watch, controlledFieldArray }: DocumentStepProps) {
  const { fields } = controlledFieldArray;
  const watchFieldArray = watch("guests");
  const controlledFields = fields.map((field, index) => {
    const watchItem = watchFieldArray?.[index];
    return {
      ...field,
      ...(watchItem ?? {}),
    };
  });
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="bg-muted p-2 rounded-full">
            <IdCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Documento de Identidad</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Necesitamos el documento oficial de identidad para registrar al huésped según las normativas hoteleras.
            </p>
          </div>
        </div>
      </div>

      <FormItem>
        <FormLabel>Tipo de Documento</FormLabel>
        <Select
          {...register(`guests.${activeGuest}.documentType` as const)}
          defaultValue={controlledFields[activeGuest].documentType}
          onValueChange={(val) => {
            form.setValue(`guests.${activeGuest}.documentType`, val as DocumentType);
          }}
        >
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={FORMSTATICS.guests.subFields?.documentType.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              {Object.values(documentTypeStatusConfig).map((documentType, idx) => {
                const Icon = documentType.icon || IdCard;
                return (
                  <SelectItem
                    key={`${documentType.value}-${idx}`}
                    value={documentType.value}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${documentType.textColor || "text-primary"}`} />
                      <span>{documentType.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <CustomFormDescription
          required={FORMSTATICS.guests.subFields?.documentType?.required ?? false}
          validateOptionalField={true}
        />
        <FormMessage>
          {form.formState.errors.guests?.[activeGuest]?.documentType &&
            form.formState.errors.guests[activeGuest]?.documentType?.message}
        </FormMessage>
      </FormItem>

      <FormItem>
        <FormLabel>Número de Documento</FormLabel>
        <FormControl>
          <Input
            disabled={!controlledFields[activeGuest].documentType}
            {...register(`guests.${activeGuest}.documentId` as const)}
          />
        </FormControl>
        <CustomFormDescription
          required={FORMSTATICS.guests.subFields?.documentId.required ?? false}
          validateOptionalField={true}
        />
        <FormMessage>
          {form.formState.errors.guests?.[activeGuest]?.documentId &&
            form.formState.errors.guests[activeGuest]?.documentId?.message}
        </FormMessage>
      </FormItem>
    </div>
  );
}
