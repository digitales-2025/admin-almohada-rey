import { ConciergeBell, Lamp } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CleaningStatusRoomsSchema, UpdateStatusRoomsSchema } from "../../_schema/updateStatusRoomsSchema";
import { CleaningChecklist, Room, RoomStatus } from "../../_types/room";
import CleaningChecklistForm from "./CleaningChecklistForm";

interface UpdateAvailabilityRoomsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  room: Room;
  statusForm: UseFormReturn<UpdateStatusRoomsSchema>;
  cleaningForm: UseFormReturn<CleaningStatusRoomsSchema>;
  onStatusSubmit: (data: UpdateStatusRoomsSchema) => void;
  onCleaningSubmit: (data: CleaningStatusRoomsSchema) => void;
  checklist: CleaningChecklist;
  allTasksCompleted: boolean;
  completedTasksCount: number;
  totalTasks: number;
}

export default function UpdateAvailabilityRoomsForm({
  children,
  room,
  statusForm,
  cleaningForm,
  onStatusSubmit,
  onCleaningSubmit,
  checklist,
  allTasksCompleted,
  completedTasksCount,
  totalTasks,
}: UpdateAvailabilityRoomsFormProps) {
  const completionPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  return (
    <div>
      {room.status === RoomStatus.CLEANING ? (
        <Form {...cleaningForm}>
          <form onSubmit={cleaningForm.handleSubmit(onCleaningSubmit)} className="space-y-6">
            <CleaningChecklistForm
              cleaningForm={cleaningForm}
              checklist={checklist}
              allTasksCompleted={allTasksCompleted}
              completedTasksCount={completedTasksCount}
              totalTasks={totalTasks}
              completionPercentage={completionPercentage}
            />
            {children}
          </form>
        </Form>
      ) : (
        <Form {...statusForm}>
          <form onSubmit={statusForm.handleSubmit(onStatusSubmit)} className="space-y-6">
            <FormField
              control={statusForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    <Card
                      className={cn(
                        "border-2 cursor-pointer transition-colors",
                        field.value === RoomStatus.AVAILABLE
                          ? "bg-green-50 border-green-200"
                          : "bg-muted/40 hover:bg-muted/60"
                      )}
                      onClick={() => {
                        field.onChange(RoomStatus.AVAILABLE);
                      }}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                        <div
                          className={cn(
                            "p-3 rounded-full",
                            field.value === RoomStatus.AVAILABLE
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <ConciergeBell className="h-6 w-6" />
                        </div>
                        <span
                          className={cn(
                            "font-medium",
                            field.value === RoomStatus.AVAILABLE ? "dark:text-black" : "dark:text-white"
                          )}
                        >
                          Disponible
                        </span>
                        <p className="text-xs text-muted-foreground">Habitación lista para ocupar</p>
                      </CardContent>
                    </Card>

                    <Card
                      className={cn(
                        "border-2 cursor-pointer transition-colors",
                        field.value === RoomStatus.OCCUPIED
                          ? "bg-red-50 border-red-500"
                          : "bg-muted/40 hover:bg-muted/60"
                      )}
                      onClick={() => {
                        field.onChange(RoomStatus.OCCUPIED);
                      }}
                    >
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                        <div
                          className={cn(
                            "p-3 rounded-full",
                            field.value === RoomStatus.OCCUPIED
                              ? "bg-red-100 text-red-700"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Lamp className="h-6 w-6" />
                        </div>
                        <span
                          className={cn(
                            "font-medium",
                            field.value === RoomStatus.OCCUPIED ? "dark:text-black" : "dark:text-white"
                          )}
                        >
                          Ocupada
                        </span>
                        <p className="text-xs text-muted-foreground">Habitación actualmente en uso</p>
                      </CardContent>
                    </Card>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {children}
          </form>
        </Form>
      )}
    </div>
  );
}
