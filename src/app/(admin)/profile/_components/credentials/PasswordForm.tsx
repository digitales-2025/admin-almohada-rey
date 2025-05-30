"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, KeyRound, Lock, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputPassword } from "@/components/ui/input-password";
import { useProfile } from "../../_hooks/use-profile";
import { passwordFormSchema, PasswordFormValues } from "../../_schemas/updateCredentialSchema";

export function PasswordForm() {
  const { onUpdatePassword, isLoadingUpdatePassword: isLoading, refetch } = useProfile();
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Verificar requisitos de contraseña mientras el usuario escribe
  const checkPasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    });
  };

  function onSubmit(data: PasswordFormValues) {
    const updateData = {
      password: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };
    onUpdatePassword(updateData).then(() => refetch());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña Actual</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="********"
                  autoComplete="current-password"
                  className="border-neutral-200 transition-colors focus:border-neutral-900"
                  icon={<Lock className="h-4 w-4 text-neutral-500" />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t my-6"></div>

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña Nueva</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="********"
                  autoComplete="new-password"
                  className="border-neutral-200 transition-colors focus:border-neutral-900"
                  icon={<KeyRound className="h-4 w-4 text-neutral-500" />}
                  onChangeWithCheck={(e) => {
                    checkPasswordRequirements(e.target.value);
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña Nueva</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="********"
                  autoComplete="confirm-password"
                  className="border-neutral-200 transition-colors focus:border-neutral-900"
                  icon={<KeyRound className="h-4 w-4 text-neutral-500" />}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className=" p-3 rounded-lg border text-xs text-slate-700 dark:text-slate-200">
          <p
            className="font-medium m  --chart-1: oklch(0.82 0.13 84.49);
  --chart-2: oklch(0.8 0.11 203.6);
  --chart-3: oklch(0.42 0.17 266.78);
  --chart-4: oklch(0.92 0.08 125.58);
  --chart-5: oklch(0.92 0.1 116.19);-1"
          >
            Requisitos de seguridad:
          </p>
          <ul className="space-y-1 pl-5">
            <li className="flex items-center gap-2">
              {passwordRequirements.minLength ? (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
              )}
              <span className={passwordRequirements.minLength ? "text-green-700" : ""}>Al menos 8 caracteres</span>
            </li>
            <li className="flex items-center gap-2">
              {passwordRequirements.hasUppercase ? (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
              )}
              <span className={passwordRequirements.hasUppercase ? "text-green-700" : ""}>Una letra mayúscula</span>
            </li>
            <li className="flex items-center gap-2">
              {passwordRequirements.hasNumber ? (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
              )}
              <span className={passwordRequirements.hasNumber ? "text-green-700" : ""}>Un número</span>
            </li>
            <li className="flex items-center gap-2">
              {passwordRequirements.hasSpecial ? (
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0" />
              )}
              <span className={passwordRequirements.hasSpecial ? "text-green-700" : ""}>Un carácter especial</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <Button disabled={isLoading}>
            {isLoading && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
            Actualizar contraseña
          </Button>
        </div>
      </form>
    </Form>
  );
}
