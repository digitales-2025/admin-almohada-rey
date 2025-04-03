import { DoorClosed, Monitor, Ruler } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { CreateRoomsSchema } from "../../_schema/createRoomsSchema";
import { FloorType } from "../../_types/room";
import { RoomTypeOption } from "../../_utils/rooms.filter.utils";
import { FloorTypeLabels } from "../../_utils/rooms.utils";
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
                  min={0}
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
        <FormField
          control={form.control}
          name="tv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Televisor</FormLabel>
              <FormControl>
                <InputWithIcon Icon={Monitor} placeholder="Ingrese el televisor de la habitación" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="floorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="documentType">Tipo de Piso</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de piso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(FloorType).map((floorType) => {
                      const floorTypeConfig = FloorTypeLabels[floorType];
                      const Icon = floorTypeConfig.icon;

                      return (
                        <SelectItem key={floorType} value={floorType} className="flex items-center gap-2">
                          <Icon className={`size-4 ${floorTypeConfig.className}`} />
                          <span>{floorTypeConfig.label}</span>
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
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área</FormLabel>
              <FormControl>
                <InputWithIcon
                  Icon={Ruler}
                  placeholder="Ingrese el área de la habitación"
                  type="number"
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value?.toString() || ""}
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
