export const getFirstLetter = (
  str: string | undefined,
  options?: { useFirstTwo?: boolean; includeLastName?: boolean }
) => {
  if (!str) return "";

  // Opción 1: Extraer las dos primeras letras
  if (options?.useFirstTwo) {
    return str.substring(0, 2).toUpperCase();
  }

  // Opción 2: Extraer iniciales de nombre y apellido
  if (options?.includeLastName) {
    const parts = str.split(" ").filter((part) => part.length > 0);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
  }

  // Por defecto, devuelve la primera letra en mayúscula
  return str.charAt(0).toUpperCase();
};
