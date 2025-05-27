import { Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { UpdateAmenitiesSchema } from "../../_schema/updateStatusRoomsSchema";
import { CleaningChecklist } from "../../_types/room";
import { getChecklistIcon, getChecklistLabel } from "../../_utils/rooms.utils";

interface UpdateAmenitiesRoomsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  amenitiesForm: UseFormReturn<UpdateAmenitiesSchema>;
  onUpdateAmenitiesSubmit: (data: UpdateAmenitiesSchema) => void;
  checklist: CleaningChecklist;
  allTasksCompleted: boolean;
  completedTasksCount: number;
  totalTasks: number;
}

export default function UpdateAmenitiesRoomsForm({
  children,
  amenitiesForm,
  onUpdateAmenitiesSubmit,
  checklist,
  allTasksCompleted,
  completedTasksCount,
  totalTasks,
}: UpdateAmenitiesRoomsFormProps) {
  const completionPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  return (
    <div>
      <Form {...amenitiesForm}>
        <form onSubmit={amenitiesForm.handleSubmit(onUpdateAmenitiesSubmit)} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className={cn("h-5 w-5", allTasksCompleted ? "text-green-500" : "text-amber-500")} />
                Amenidades de la habitación
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
                    control={amenitiesForm.control}
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
          </div>
          {children}
        </form>
      </Form>
    </div>
  );
}
