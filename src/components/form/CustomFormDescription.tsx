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
  const LOCAL_MESSAGE = validateOptionalField ? OPTIONAL_MESSAGE : REQUIRED_MESSAGE;
  return (
    <>
      {showMessage && (
        <FormDescription className={className} {...props}>
          {required && !validateOptionalField && <span className="block">{LOCAL_MESSAGE}</span>}
          {description && <span className="block">{description}</span>}
          {children && children}
        </FormDescription>
      )}
      {/* {children&&children} */}
    </>
  );
}
