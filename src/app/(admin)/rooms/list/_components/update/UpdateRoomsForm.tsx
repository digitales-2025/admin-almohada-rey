import { DoorClosed } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet } from "@/components/ui/sheet";
import { CreateRoomsSchema } from "../../_schema/createRoomsSchema";
import { RoomTypeOption } from "../../_utils/rooms.filter.utils";
import { useRoomTypes } from "../../../room-types/_hooks/use-room-types";

interface UpdateRoomsFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateRoomsSchema>;
  onSubmit: (data: CreateRoomsSchema) => void;
}

export default function UpdateRoomsForm({ children, form, onSubmit }: UpdateRoomsFormProps) {
  const { dataCreatableTypeRooms } = useRoomTypes();

  // Prepara las opciones para el AutoComplete
  const typeRoomsOptions: Option[] =
    dataCreatableTypeRooms?.map((typeRoom) => ({
      value: typeRoom.id,
      label: String(typeRoom.name),
    })) ?? [];
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nº de Habitación</FormLabel>
              <FormControl>
                <InputWithIcon
                  Icon={DoorClosed}
                  placeholder="Ingrese el número de habitación"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value?.toString() || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomTypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de habitación</FormLabel>
              <FormControl>
                <AutoComplete
                  options={typeRoomsOptions}
                  emptyMessage="No se encontró el tipo de habitación."
                  placeholder="Seleccione un tipo de habitación"
                  onValueChange={(selectedOption) => {
                    field.onChange(selectedOption?.value || "");
                  }}
                  value={typeRoomsOptions.find((option) => option.value === field.value) || undefined}
                  renderOption={(option) => <RoomTypeOption label={option.label} />}
                  renderSelectedValue={(option) => <RoomTypeOption label={option.label} />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
