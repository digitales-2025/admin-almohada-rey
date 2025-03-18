import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useUsers } from "../../_hooks/use-users";
import { CreateUsersSchema, usersSchema } from "../../_schema/createUsersSchema";
import { UserRolType } from "../../_types/user";
import { UserRolTypeLabels } from "../../_utils/users.utils";

export function CreateUsersDialog() {
  const [open, setOpen] = useState(false);
  const [isCreatePending, startCreateTransition] = useTransition();
  const { onCreateUser, isSuccessCreateUser } = useUsers();

  const form = useForm<CreateUsersSchema>({
    resolver: zodResolver(usersSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      userRol: undefined,
    },
  });

  const { handleGeneratePassword, password } = useUsers();
  const { setValue, clearErrors } = form;

  useEffect(() => {
    if (password) {
      setValue("password", password?.password);
      clearErrors("password");
    }
  }, [password, setValue, clearErrors]);

  const onSubmit = async (input: CreateUsersSchema) => {
    startCreateTransition(() => {
      onCreateUser(input);
    });
  };

  const handleClose = () => {
    form.reset();
  };

  useEffect(() => {
    if (isSuccessCreateUser) {
      form.reset();
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateUser]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Crear usuario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear un usuario nuevo</DialogTitle>
          <DialogDescription>Complete la información y presione el boton Crear.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ejm: Juan Perez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario@almohadarey.com" {...field} />
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Generar contraseña</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input id="password" placeholder="********" {...field} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button type="button" variant="outline" onClick={handleGeneratePassword}>
                              <Bot className="size-4" aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Generar constraseña</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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

            <DialogFooter className="w-full">
              <div className="grid grid-cols-2 gap-2 w-full">
                <DialogClose asChild>
                  <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button disabled={isCreatePending} className="w-full">
                  {isCreatePending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                  Registrar
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
