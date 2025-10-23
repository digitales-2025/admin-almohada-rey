"use client";

import { usePathname } from "next/navigation";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { UserRolType } from "@/app/(admin)/users/_types/user";
import { hasRoutePermission } from "@/utils/route-permissions";

interface UseRouteProtectionReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  userRole: UserRolType | null;
  currentPath: string;
}

/**
 * Hook para verificar si el usuario actual tiene permisos para acceder a la ruta actual
 * @returns Objeto con información sobre la autorización del usuario
 */
export function useRouteProtection(): UseRouteProtectionReturn {
  const pathname = usePathname();
  const { user, isLoadingProfile } = useProfile();

  // Si está cargando, retornar estado de carga
  if (isLoadingProfile) {
    return {
      isAuthorized: false, // Cambiar a false para que RouteGuard muestre loading
      isLoading: true,
      userRole: null,
      currentPath: pathname,
    };
  }

  // Si no hay usuario, no autorizar
  if (!user || !user.userRol) {
    return {
      isAuthorized: false,
      isLoading: false,
      userRole: null,
      currentPath: pathname,
    };
  }

  // Verificar permisos para la ruta actual
  const isAuthorized = hasRoutePermission(pathname, user.userRol);

  return {
    isAuthorized,
    isLoading: false,
    userRole: user.userRol,
    currentPath: pathname,
  };
}
