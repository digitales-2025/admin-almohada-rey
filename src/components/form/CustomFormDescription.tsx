import React from "react";

import { REQUIRED_MESSAGE } from "@/types/statics/forms";
import { FormDescription } from "../ui/form";

interface CustomFormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  required?: boolean;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  validateOptionalField?: boolean;
  showMessage?: boolean;
}
export function CustomFormDescription({
  className,
  required,
  description,
  children,
  validateOptionalField = false,
  showMessage = true,
  ...props
}: CustomFormDescriptionProps) {
  const OPTIONAL_MESSAGE = "Opcional";

  // Definimos qué mensaje mostrar y si mostrarlo
  let messageToShow = null;

  if (validateOptionalField && !required) {
    // Si estamos validando campo opcional, siempre mostramos "Opcional"
    messageToShow = OPTIONAL_MESSAGE;
  } else if (required && !validateOptionalField) {
    // Si no estamos validando campo opcional y es requerido, mostramos "Requerido"
    messageToShow = REQUIRED_MESSAGE;
  }
  return (
    <>
      {showMessage && (
        <FormDescription className={className} {...props}>
          {/* Esta es la línea clave: mostrar el mensaje si es requerido o si es opcional */}
          {messageToShow && <span className="block">{messageToShow}</span>}
          {description && <span className="block">{description}</span>}
          {children && children}
        </FormDescription>
      )}
      {/* {children&&children} */}
    </>
  );
}
