import { format, parse } from "date-fns";
import {
  Calendar,
  Check,
  ConciergeBell,
  Droplets,
  FileText,
  HandMetal,
  Lamp,
  ShowerHeadIcon as Shower,
  Sparkles,
  Toilet,
  Trash2,
  User,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CleaningStatusRoomsSchema, UpdateStatusRoomsSchema } from "../../_schema/updateStatusRoomsSchema";
import { CleaningChecklist, Room, RoomStatus } from "../../_types/room";

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

  const getChecklistIcon = (item: keyof CleaningChecklist) => {
    switch (item) {
      case "trashBin":
        return Trash2;
      case "towel":
        return Droplets;
      case "toiletPaper":
        return Toilet;
      case "showerSoap":
        return Shower;
      case "handSoap":
        return HandMetal;
      case "lamp":
        return Lamp;
      default:
        return Check;
    }
  };

  const getChecklistLabel = (item: keyof CleaningChecklist) => {
    switch (item) {
      case "trashBin":
        return "Papelera";
      case "towel":
        return "Toallas";
      case "toiletPaper":
        return "Papel higiénico";
      case "showerSoap":
        return "Jabón de ducha";
      case "handSoap":
        return "Jabón de manos";
      case "lamp":
        return "Lámpara";
      default:
        return item;
    }
  };
  return (
    <div>
      {room.status === RoomStatus.CLEANING ? (
        <Form {...cleaningForm}>
          <form onSubmit={cleaningForm.handleSubmit(onCleaningSubmit)} className="space-y-6">
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
                              <Input
                                placeholder="Nombre del personal de limpieza"
                                className="mt-1 border-2"
                                {...field}
                              />
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
