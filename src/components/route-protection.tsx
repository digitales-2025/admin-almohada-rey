"use client";

import { Unauthorized } from "@/components/errors/unauthorized";
import { SmallLoading } from "@/components/loading/small-loading";
import { useRouteProtection } from "@/hooks/use-route-protection";

interface RouteProtectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Componente que protege rutas basándose en los permisos del usuario
 * @param children - Contenido a mostrar si el usuario está autorizado
 * @param fallback - Componente personalizado a mostrar si no está autorizado
 */
export function RouteProtection({ children, fallback }: RouteProtectionProps) {
  const { isAuthorized, isLoading } = useRouteProtection();

  // Mostrar loading mientras se verifica la autorización
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <SmallLoading />
      </div>
    );
  }

  // Si no está autorizado, mostrar componente de error o fallback personalizado
  if (!isAuthorized) {
    return fallback || <Unauthorized />;
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
}
