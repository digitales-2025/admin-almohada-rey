import { ListCheck, Trash2 } from "lucide-react";
import { Controller, UseFieldArrayReturn, UseFormRegister, UseFormReturn, UseFormWatch } from "react-hook-form";

import { CustomFormDescription } from "@/components/form/CustomFormDescription";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CreateReservationInput, DetailedRoom, DocumentType } from "../../_schemas/reservation.schemas";
import { FORMSTATICS } from "../../_statics/forms";
import { documentTypeStatusConfig } from "../../_types/document-type.enum.config";

interface CreateReservationGuestTableProps {
  controlledFieldArray: UseFieldArrayReturn<CreateReservationInput>;
  register: UseFormRegister<CreateReservationInput>;
  form: UseFormReturn<CreateReservationInput>;
  watch: UseFormWatch<CreateReservationInput>;
  handleAddGuest: () => void;
  handleRemoveGuest: (index: number) => void;
  guestNumber: number;
  selectedRoom: DetailedRoom | undefined;
}

export default function CreateReservationGuestTable({
  controlledFieldArray,
  form,
  handleAddGuest,
  handleRemoveGuest,
  guestNumber,
  watch,
  register,
  selectedRoom,
}: CreateReservationGuestTableProps) {
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
    <div className="flex flex-col gap-4  sm:col-span-2 animate-ease-in">
      <FormLabel>{FORMSTATICS.guests.label}</FormLabel>
      <Table className="w-full overflow-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre y Apell.</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Tipo de Identidad</TableHead>
            <TableHead>Nro. de Identidad</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Adicional</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {controlledFields.map((field, index) => {
            const isDocumentTypeSelected = field.documentType !== undefined;
            return (
              <TableRow key={field.id} className="animate-fade-down duration-500">
                <TableCell>
                  <FormItem>
                    <Input {...register(`guests.${index}.name` as const)} className="min-w-[100px] w-full" />
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.name?.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.name &&
                        form.formState.errors.guests[index]?.name?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <FormItem className="min-w-[50px] w-full">
                    {/* <div>
                          <span>{safeData.name ?? "Desconocido"}</span>
                        </div> */}
                    <Input {...register(`guests.${index}.age` as const)} type="number" min={0} placeholder="0" />
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.age.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.age && form.formState.errors.guests[index]?.age?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <FormItem>
                    <Select
                      {...register(`guests.${index}.documentType` as const)}
                      defaultValue={field.documentType}
                      onValueChange={(val) => {
                        form.setValue(`guests.${index}.documentType`, val as DocumentType);
                        // calculateProductTotals();
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[100px] w-full">
                          <SelectValue
                            placeholder={FORMSTATICS.guests.subFields?.documentType.placeholder}
                            className="text-ellipsis"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(documentTypeStatusConfig).map((documentType, idx) => (
                          <SelectItem key={`${documentType.value}-${idx}`} value={documentType.value}>
                            {documentType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.documentType?.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.documentType &&
                        form.formState.errors.guests[index]?.documentType?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <FormItem>
                    <Input disabled={!isDocumentTypeSelected} {...register(`guests.${index}.documentId` as const)} />
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.documentId.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.documentId &&
                        form.formState.errors.guests[index]?.documentId?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`guests.${index}.phone`}
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormControl>
                          <PhoneInput
                            className="min-w-[170px] w-full"
                            defaultCountry="PE"
                            placeholder="999 888 777"
                            value={value}
                            onChange={onChange}
                          />
                        </FormControl>
                        <CustomFormDescription
                          required={FORMSTATICS.guests.subFields?.phone.required ?? false}
                          validateOptionalField={true}
                        ></CustomFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormItem>
                    <Input className="min-w-[100px] w-full" {...register(`guests.${index}.email` as const)} />
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.email.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.email &&
                        form.formState.errors.guests[index]?.email?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <FormItem>
                    <Textarea
                      className="min-w-[100px] w-full"
                      {...register(`guests.${index}.additionalInfo` as const, {
                        setValueAs: (v) => (v === "" ? undefined : String(v)),
                      })}
                    />
                    <CustomFormDescription
                      required={FORMSTATICS.guests.subFields?.additionalInfo.required ?? false}
                      validateOptionalField={true}
                    ></CustomFormDescription>
                    <FormMessage>
                      {form.formState.errors.guests?.[index]?.additionalInfo &&
                        form.formState.errors.guests[index]?.additionalInfo?.message}
                    </FormMessage>
                  </FormItem>
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    className="hover:bg-destructive hover:text-white"
                    size="sm"
                    onClick={() => handleRemoveGuest(index)}
                  >
                    <Trash2 />
                    {/* Eliminar */}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="col-span-2 w-full flex flex-col gap-2 justify-center items-center py-4">
        <Button
          variant={"outline"}
          disabled={
            selectedRoom?.RoomTypes?.guests && guestNumber >= selectedRoom?.RoomTypes?.guests - 1 ? true : false
          }
          type="button"
          onClick={handleAddGuest}
          className="flex items-center gap-2"
        >
          <ListCheck className="size-4" />
          Añadir Huésped
          {selectedRoom?.RoomTypes?.guests && (
            <div>
              {"("}
              <span className="text-primary text-base font-bold">
                {/* -1 beacause of the current guest who is making the reservation */}
                {selectedRoom?.RoomTypes?.guests - 1 - guestNumber}
              </span>{" "}
              lugar{selectedRoom?.RoomTypes?.guests > 1 ? "es" : ""} restante
              {selectedRoom?.RoomTypes?.guests > 1 ? "s" : ""}
              {")"}
            </div>
          )}
        </Button>
        <CustomFormDescription
          required={FORMSTATICS.guests.required}
          validateOptionalField={true}
        ></CustomFormDescription>
        {form.formState.errors.guests && (
          <FormMessage className="text-destructive">{form.formState.errors.guests.message}</FormMessage>
        )}
      </div>
    </div>
  );
}
