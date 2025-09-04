import { UserRolType } from "@/app/(admin)/users/_types/user";
import { type NavGroup, type NavItem, type SidebarData } from "../types";

// Usar los tipos de roles del sistema
export type UserRole = UserRolType;

// Función para verificar si un usuario tiene acceso a un item
function hasAccess(userRole: UserRole, allowedRoles?: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true; // Si no se especifican roles, todos pueden acceder
  }
  return allowedRoles.includes(userRole);
}

// Función para filtrar items de navegación
function filterNavItems(items: NavItem[], userRole: UserRole): NavItem[] {
  return items
    .filter((item) => hasAccess(userRole, item.roles))
    .map((item) => {
      if ("items" in item && item.items) {
        // Si es un item colapsible, filtrar también sus subitems
        const filteredSubItems = item.items.filter((subItem) => hasAccess(userRole, subItem.roles));
        return {
          ...item,
          items: filteredSubItems,
        };
      }
      return item;
    })
    .filter((item) => {
      // Si es un item colapsible sin subitems después del filtro, no mostrarlo
      if ("items" in item && item.items) {
        return item.items.length > 0;
      }
      return true;
    });
}

// Función para filtrar grupos de navegación
function filterNavGroups(navGroups: NavGroup[], userRole: UserRole): NavGroup[] {
  return navGroups
    .filter((group) => hasAccess(userRole, group.roles))
    .map((group) => ({
      ...group,
      items: filterNavItems(group.items, userRole),
    }))
    .filter((group) => group.items.length > 0); // Solo mostrar grupos que tengan items
}

// Función principal para filtrar sidebar data
export function filterSidebarData(sidebarData: SidebarData, userRole: UserRole): SidebarData {
  return {
    ...sidebarData,
    navGroups: filterNavGroups(sidebarData.navGroups, userRole),
  };
}
