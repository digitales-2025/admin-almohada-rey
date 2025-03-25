"use client";

import { useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import ProfileEditor from "./_components/ProfileEditor";
import { ProfileSkeleton } from "./_components/skeleton/ProfileSkeleton";
import { useProfile } from "./_hooks/use-profile";

export default function ProfilePage() {
  const { user, isLoadingProfile } = useProfile();
  const [currentTab, setCurrentTab] = useState<"personal" | "security">("personal");
  if (isLoadingProfile) {
    return (
      <div>
        <div>
          <HeaderPage title="Perfil" description="Actualice sus datos en el sistema administrativo" />
          <ProfileSkeleton currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <HeaderPage title="Perfil" description="Actualice sus datos en el sistema administrativo" />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Perfil" description="Actualice sus datos en el sistema administrativo" />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ProfileEditor currentTab={currentTab} setCurrentTab={setCurrentTab} user={user} />
      </div>
    </div>
  );
}
