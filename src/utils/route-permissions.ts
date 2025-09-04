import { UserRolType } from "@/app/(admin)/users/_types/user";

// Mapeo de rutas a roles requeridos
export const ROUTE_PERMISSIONS: Record<string, UserRolType[]> = {
  // Rutas de administración - solo ADMIN
  "/users": [UserRolType.ADMIN],
  "/reports": [UserRolType.ADMIN],

  // Rutas de gastos - solo ADMIN
  "/expenses": [UserRolType.ADMIN],

  // Rutas que todos pueden ver (sin restricciones)
  "/dashboard": [],
  "/inventory": [],
  "/inventory/input": [],
  "/inventory/output": [],
  "/inventory/warehouse": [],
  "/inventory/products": [],
  "/inventory/products/commercial": [],
  "/inventory/products/internal_use": [],
  "/rooms": [],
  "/rooms/list": [],
  "/rooms/room-types": [],
  "/reservation": [],
  "/customers": [],
  "/payments": [],
  "/profile": [],
};

/**
 * Verifica si un usuario tiene permisos para acceder a una ruta específica
 * @param pathname - La ruta a verificar
 * @param userRole - El rol del usuario
 * @returns true si el usuario tiene permisos, false en caso contrario
 */
export function hasRoutePermission(pathname: string, userRole: UserRolType): boolean {
  // Buscar la ruta exacta primero
  if (ROUTE_PERMISSIONS[pathname]) {
    const requiredRoles = ROUTE_PERMISSIONS[pathname];
    // Si no hay roles requeridos, todos pueden acceder
    if (requiredRoles.length === 0) {
      return true;
    }
    return requiredRoles.includes(userRole);
  }

  // Si no se encuentra la ruta exacta, buscar rutas padre
  const pathSegments = pathname.split("/").filter(Boolean);

  for (let i = pathSegments.length; i > 0; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    if (ROUTE_PERMISSIONS[parentPath]) {
      const requiredRoles = ROUTE_PERMISSIONS[parentPath];
      if (requiredRoles.length === 0) {
        return true;
      }
      return requiredRoles.includes(userRole);
    }
  }

  // Si no se encuentra ninguna regla específica, permitir acceso por defecto
  return true;
}

/**
 * Obtiene los roles requeridos para una ruta específica
 * @param pathname - La ruta a verificar
 * @returns Array de roles requeridos, o array vacío si no hay restricciones
 */
export function getRequiredRoles(pathname: string): UserRolType[] {
  // Buscar la ruta exacta primero
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Si no se encuentra la ruta exacta, buscar rutas padre
  const pathSegments = pathname.split("/").filter(Boolean);

  for (let i = pathSegments.length; i > 0; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    if (ROUTE_PERMISSIONS[parentPath]) {
      return ROUTE_PERMISSIONS[parentPath];
    }
  }

  // Si no se encuentra ninguna regla específica, no hay restricciones
  return [];
}
