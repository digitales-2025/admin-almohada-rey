import { format, parse } from "date-fns";
import { Calendar, FileText, Sparkles, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CleaningStatusRoomsSchema } from "../../_schema/updateStatusRoomsSchema";
import { CleaningChecklist } from "../../_types/room";
import { getChecklistIcon, getChecklistLabel } from "../../_utils/rooms.utils";

interface CleaningChecklistFormProps {
  cleaningForm: UseFormReturn<CleaningStatusRoomsSchema>;
  checklist: CleaningChecklist;
  allTasksCompleted: boolean;
  completedTasksCount: number;
  totalTasks: number;
  completionPercentage: number;
}

export default function CleaningChecklistForm({
  cleaningForm,
  checklist,
  allTasksCompleted,
  completedTasksCount,
  totalTasks,
  completionPercentage,
}: CleaningChecklistFormProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Sparkles className={cn("h-5 w-5", allTasksCompleted ? "text-green-500" : "text-amber-500")} />
          Progreso de limpieza
        </h3>
        <Badge variant={"outline"} className="px-2.5 py-1">
          {completedTasksCount}/{totalTasks} ({completionPercentage}%)
        </Badge>
      </div>

      <div className="w-full bg-muted rounded-full h-2.5 mb-6">
        <div
          className={cn("h-2.5 rounded-full", allTasksCompleted ? "bg-green-500" : "bg-amber-500")}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(checklist).map(([key]) => {
          const ItemIcon = getChecklistIcon(key as keyof CleaningChecklist);
          return (
            <FormField
              key={key}
              control={cleaningForm.control}
              name={`checklist.${key}` as any}
              render={({ field }) => (
                <FormItem>
                  <Card
                    className={cn(
                      "border-2 transition-colors",
                      field.value ? "bg-green-50 dark:bg-green-950 border-green-400" : "bg-muted/40"
                    )}
                  >
                    <CardContent className="py-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            field.value ? "bg-green-100 text-green-500" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <ItemIcon className="h-4 w-4" />
                        </div>
                        <FormLabel className="font-medium">
                          {getChecklistLabel(key as keyof CleaningChecklist)}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-300"
                        />
                      </FormControl>
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          );
        })}
      </div>

      {allTasksCompleted && (
        <div className="mt-8 space-y-4 border-t pt-6">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={cleaningForm.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <Card className="border-2">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <FormLabel htmlFor="dateProject">Fecha de Limpieza</FormLabel>
                      </div>
                      <FormControl>
                        <DatePicker
                          value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                          onChange={(date) => {
                            if (date) {
                              const formattedDate = format(date, "yyyy-MM-dd");
                              field.onChange(formattedDate);
                            } else {
                              field.onChange("");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription className="text-xs mt-1 ml-1">
                        Fecha en la que se realizó la limpieza
                      </FormDescription>
                      <FormMessage />
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
            <FormField
              control={cleaningForm.control}
              name="cleanedBy"
              render={({ field }) => (
                <FormItem>
                  <Card className="border-2">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                          <User className="h-5 w-5" />
                        </div>
                        <FormLabel className="font-medium">Limpiado por</FormLabel>
                      </div>
                      <FormControl>
                        <Input placeholder="Nombre del personal de limpieza" className="mt-1 border-2" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs mt-1 ml-1">
                        Nombre de la persona que realizó la limpieza
                      </FormDescription>
                      <FormMessage />
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />

            <FormField
              control={cleaningForm.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <Card className="border-2">
                    <CardContent>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <FormLabel className="font-medium">Observaciones</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Observaciones adicionales"
                          rows={3}
                          className="mt-1 border-2"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs mt-1 ml-1">
                        Detalles adicionales o problemas encontrados
                      </FormDescription>
                      <FormMessage />
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
