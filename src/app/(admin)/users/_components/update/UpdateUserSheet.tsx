"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUsers } from "../../_hooks/use-users";
import { updateUsersSchema, UpdateUsersSchema } from "../../_schema/createUsersSchema";
import { User, UserRolType } from "../../_types/user";
import { UserRolTypeLabels } from "../../_utils/users.utils";
import { SendNewPasswordForm } from "./SendNewPasswordForm";

const infoSheet = {
  title: "Actualizar Usuario",
  description: "Actualiza la información del usuario y guarda los cambios",
};

interface UpdateUserSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  user: User;
}

export function UpdateUserSheet({ user, ...props }: UpdateUserSheetProps) {
  const { onUpdateUser, isSuccessUpdateUser, isLoadingUpdateUser } = useUsers();

  const form = useForm<UpdateUsersSchema>({
    resolver: zodResolver(updateUsersSchema),
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone,
      userRol: user.userRol,
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name ?? "",
      phone: user.phone,
      userRol: user.userRol,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function onSubmit(input: UpdateUsersSchema) {
    onUpdateUser({
      id: user.id,
      ...input,
    });
  }

  useEffect(() => {
    if (isSuccessUpdateUser) {
      form.reset();
      props.onOpenChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdateUser]);

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">
              {user.email}
            </Badge>
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="w-full gap-4 p-4 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="john smith" className="resize-none capitalize" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <PhoneInput
                        defaultCountry="PE"
                        placeholder="999 888 777"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userRol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="rol">Rol</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(UserRolType).map((rol) => {
                            const roleConfig = UserRolTypeLabels[rol];
                            const Icon = roleConfig.icon;

                            return (
                              <SelectItem key={rol} value={rol} className="flex items-center gap-2">
                                <Icon className={`size-4 ${roleConfig.className}`} />
                                <span>{roleConfig.label}</span>
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

              <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                <div className="flex flex-row-reverse flex-wrap gap-2">
                  <Button disabled={isLoadingUpdateUser}>
                    {isLoadingUpdateUser && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                    Actualizar
                  </Button>
                  <SheetClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </SheetClose>
                </div>
              </SheetFooter>
            </form>
          </Form>

          <Separator className="my-6" />
          <SendNewPasswordForm user={user} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
