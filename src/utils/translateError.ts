import errorTranslations from "./errorTranslations";

type ErrorTranslations = {
  [key: string]: string;
};

export function translateError(errorInput: string | string[]): string {
  const translations: ErrorTranslations = errorTranslations;

  // Normaliza el input a un arreglo de strings
  const errorMessages = Array.isArray(errorInput) ? errorInput : [errorInput];

  // Selecciona el primer mensaje del arreglo
  const errorMessage = errorMessages[0] || "";

  // Busca la traducción para el mensaje seleccionado
  for (const pattern in translations) {
    const regex = new RegExp(pattern);
    const match = errorMessage.match(regex);

    if (match) {
      // Reemplaza los placeholders {0}, {1}, etc., con los valores capturados
      return translations[pattern].replace(/{(\d+)}/g, (_, index) => match[parseInt(index) + 1] || "");
    }
  }

  // Si no hay traducción, retorna el mensaje original
  return errorMessage;
}
