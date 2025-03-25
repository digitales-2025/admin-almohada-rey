"use client";

import { Shield, User } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileSkeleton({
  currentTab,
  setCurrentTab,
}: {
  currentTab: "personal" | "security";
  setCurrentTab: (section: "personal" | "security") => void;
}) {
  return (
    <div className="space-y-8 my-auto">
      <div className="bg-gradient-to-br from-background to-primary/5 rounded-xl overflow-hidden border border-primary/20 relative dark:bg-gradient-to-br dark:from-background dark:to-primary/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-tr-full opacity-30"></div>

        <div className="flex flex-col md:flex-row">
          {/* Content side with Tabs */}
          <div className="flex-1 relative z-10">
            <div className="p-8">
              <div>
                <Tabs
                  value={currentTab}
                  onValueChange={(value) => setCurrentTab(value as "personal" | "security")}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-2 w-full mb-6">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Información Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Seguridad</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6 p-3">
                    {/* Personal Information Form Skeleton - Siguiendo la estructura exacta de ProfileForm */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre - FormField */}
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-24" /> {/* FormLabel */}
                          <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                          <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                        </div>

                        {/* Número de Teléfono - FormField */}
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-36" /> {/* FormLabel */}
                          <div className="relative">
                            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                            <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full" />
                            {/* Phone icon */}
                          </div>
                          <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                        </div>

                        {/* Correo Electrónico - FormField */}
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-36" /> {/* FormLabel */}
                          <div className="relative">
                            <Skeleton className="h-10 w-full rounded-md bg-slate-100" /> {/* Input disabled */}
                            <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full" />
                            {/* Mail icon */}
                          </div>
                          <Skeleton className="h-4 w-60" /> {/* FormDescription */}
                        </div>

                        {/* Cargo en el Hotel - FormField */}
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-36" /> {/* FormLabel */}
                          <div className="relative">
                            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                            <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full" />
                            {/* Building icon */}
                          </div>
                          <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Skeleton className="h-10 w-36 rounded-md" /> {/* Button */}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6 p-3">
                    {/* Security Form Skeleton - Siguiendo la misma estructura que el formulario de contraseña */}
                    <div className="space-y-6">
                      {/* Contraseña actual - FormField */}
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-36" /> {/* FormLabel */}
                        <div className="relative">
                          <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                          <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full" />
                          {/* Icon */}
                        </div>
                        <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                      </div>
                      <div className="border-t my-6"></div>
                      {/* Nueva contraseña - FormField */}
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-36" /> {/* FormLabel */}
                        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                        <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                      </div>
                      {/* Confirmar contraseña - FormField */}
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" /> {/* FormLabel */}
                        <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
                        <Skeleton className="h-4 w-40" /> {/* FormMessage (espacio para error) */}
                      </div>
                      {/* Requisitos de seguridad */}
                      <Skeleton className="h-32 w-full rounded-md" /> {/* Requisitos box */}
                      <div className="flex justify-center mt-6">
                        <Skeleton className="h-10 w-48 rounded-md" /> {/* Button */}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Logo side - Hidden on mobile */}
          <div className="hidden md:flex md:w-72 lg:w-96 relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/20 dark:from-primary/10 dark:to-primary/30">
            <div className="absolute inset-0 flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Contenido sobre el logo */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                  <div className="mb-6 opacity-80">
                    <Skeleton className="h-24 w-44" /> {/* Corregido el tamaño del logo */}
                  </div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
