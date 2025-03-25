import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, RefreshCcw, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { User } from "@/app/(admin)/users/_types/user";
import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useProfile } from "../../_hooks/use-profile";
import { profileFormSchema, ProfileFormValues } from "../../_schemas/updateProfileSchema";

interface ProfileFormProps {
  user: User;
}
export function ProfileForm({ user }: ProfileFormProps) {
  const { onUpdate, isLoading, isSuccess, refetch } = useProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    const updateData = {
      id: user?.id ?? "",
      name: data.name ?? "",
      phone: data?.phone ?? "",
      userRol: user?.userRol ?? "",
    };
    onUpdate(updateData).then(() => {
      refetch();
    });
  }

  // When the user profile loads, prepopulate the form data.
  useEffect(() => {
    if (user !== undefined) {
      form.setValue("name", user?.name ?? "");
      form.setValue("phone", user?.phone ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={UserIcon} placeholder="Nombre" {...field} className="capitalize" />
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
                <FormLabel>Número de Teléfono</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Phone} placeholder="Teléfono" {...field} />
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
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <InputWithIcon Icon={Mail} placeholder="correo@ejemplo.com" disabled {...field} />
                </FormControl>
                <FormDescription>El correo electrónico no se puede modificar</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <div className="flex justify-end mt-6">
            <Button disabled={isLoading}>
              {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
              Guardar cambios
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
