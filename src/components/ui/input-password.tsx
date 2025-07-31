import React, { ChangeEvent, forwardRef, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputPasswordProps extends React.ComponentPropsWithoutRef<"input"> {
  icon?: React.ReactNode;
  onChangeWithCheck?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ icon, className, onChange, onChangeWithCheck, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Llama al onChange original si existe
      if (onChange) {
        onChange(e);
      }
      // Llama a la función adicional si existe
      if (onChangeWithCheck) {
        onChangeWithCheck(e);
      }
    };

    return (
      <div className="relative">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
        <Input
          type={showPassword ? "text" : "password"}
          className={`hide-password-toggle pr-10 ${icon ? "pl-10" : ""} ${className || ""}`}
          onChange={handleChange}
          {...props}
          ref={ref}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);

InputPassword.displayName = "InputPassword";
