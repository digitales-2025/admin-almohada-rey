"use client";

import { UserRolType } from "@/app/(admin)/users/_types/user";
import { Unauthorized } from "@/components/errors/unauthorized";
import { SmallLoading } from "@/components/loading/small-loading";
import { useRouteProtection } from "@/hooks/use-route-protection";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRolType[];
  fallback?: React.ReactNode;
  customMessage?: string;
}

/**
 * Componente de protección de rutas más específico que permite definir roles requeridos
 * @param children - Contenido a mostrar si el usuario está autorizado
 * @param requiredRoles - Roles específicos requeridos para esta página
 * @param fallback - Componente personalizado a mostrar si no está autorizado
 * @param customMessage - Mensaje personalizado para mostrar en caso de no autorización
 */
export function RouteGuard({ children, requiredRoles, fallback, customMessage }: RouteGuardProps) {
  const { isAuthorized, isLoading, userRole } = useRouteProtection();

  // Mostrar loading mientras se verifica la autorización
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <SmallLoading />
      </div>
    );
  }

  // Si se especifican roles requeridos, verificar si el usuario los tiene
  if (requiredRoles && requiredRoles.length > 0) {
    if (!userRole || !requiredRoles.includes(userRole)) {
      return (
        fallback || (
          <Unauthorized
            title="Permisos Insuficientes"
            description={customMessage || `Esta sección requiere permisos de: ${requiredRoles.join(", ")}`}
          />
        )
      );
    }
  } else if (!isAuthorized) {
    // Si no se especifican roles pero la ruta no está autorizada
    return fallback || <Unauthorized />;
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
}
