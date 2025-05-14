import { format, parse } from "date-fns";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UpdateRoomCleaningSchema } from "../../_schemas/updateCleaningRoomsSchema";

interface UpdateRoomCleaningFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<UpdateRoomCleaningSchema>;
  onSubmit: (data: UpdateRoomCleaningSchema) => void;
}

export default function UpdateRoomCleaningForm({ children, form, onSubmit }: UpdateRoomCleaningFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Limpieza</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? parse(field.value, "yyyy-MM-dd'T'HH:mm:ss", new Date()) : undefined}
                  withTime
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");
                      field.onChange(formattedDate);
                    } else {
                      field.onChange("");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="staffName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Limpiado por</FormLabel>
              <FormControl>
                <InputWithIcon Icon={User} placeholder="Nombre del personal de limpieza" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea placeholder="Observaciones adicionales" rows={3} className="mt-1 border-2" {...field} />
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
