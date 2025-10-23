"use client";

import { useEffect, useState } from "react";

import { UserRolType } from "@/app/(admin)/users/_types/user";
import { Unauthorized } from "@/components/errors/unauthorized";
import { Loading } from "@/components/loading/small-loading";
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
  const [showLoading, setShowLoading] = useState(true);

  // Controlar el estado de loading para evitar parpadeos
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      // Pequeño delay para evitar parpadeos
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Mostrar loading mientras se verifica la autorización
  if (isLoading || showLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading variant="spinner" text="Verificando permisos..." />
      </div>
    );
  }

  // Si se especifican roles requeridos, verificar si el usuario los tiene
  if (requiredRoles && requiredRoles.length > 0) {
    // Solo mostrar unauthorized si no está cargando y no tiene el rol requerido
    if (!isLoading && (!userRole || !requiredRoles.includes(userRole))) {
      return (
        fallback || (
          <Unauthorized
            title="Permisos Insuficientes"
            description={customMessage || `Esta sección requiere permisos de: ${requiredRoles.join(", ")}`}
          />
        )
      );
    }
  } else if (!isLoading && !isAuthorized) {
    // Si no se especifican roles pero la ruta no está autorizada (y no está cargando)
    return fallback || <Unauthorized />;
  }

  // Si está autorizado o aún está cargando, mostrar el contenido
  return <>{children}</>;
}
