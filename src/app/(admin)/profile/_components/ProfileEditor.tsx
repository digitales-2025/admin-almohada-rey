"use client";

import type React from "react";
import { Shield, UserIcon } from "lucide-react";

import { LogoAlmohadaRey } from "@/assets/icons/LogoAlmohadaRey";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "../../users/_types/user";
import { PasswordForm } from "./credentials/PasswordForm";
import { ProfileForm } from "./general-information/ProfileForm";

interface ProfileEditorProps {
  currentTab: "personal" | "security";
  setCurrentTab: (section: "personal" | "security") => void;
  user: User;
}

export default function ProfileEditor({ currentTab, setCurrentTab, user }: ProfileEditorProps) {
  return (
    <div className="space-y-8">
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
                      <UserIcon className="h-4 w-4" />
                      <span>Información Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Seguridad</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-6 p-3">
                    <ProfileForm user={user} />
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6 p-3">
                    <PasswordForm />
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
                    <LogoAlmohadaRey width={180} height={100} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {currentTab === "personal" ? "Administre su perfil" : "Seguridad garantizada"}
                  </h3>
                  <p className="text-sm text-foreground/80">
                    {currentTab === "personal"
                      ? "Mantenga su información actualizada para una mejor experiencia"
                      : "Proteja su cuenta con contraseñas seguras y actualizadas regularmente"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
