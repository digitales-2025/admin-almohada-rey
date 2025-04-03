import React from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { processError } from "@/utils/process-error";

interface ErrorMessageFormProps {
  error: unknown;
  title?: string;
  refetch?: () => void;
}

/**
 * Error message component for forms
 */
const ErrorMessageForm: React.FC<ErrorMessageFormProps> = ({ error, title = "Error", refetch }) => {
  // const localErrorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Error desconocido";
  const localErrorMessage = processError(error);
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{localErrorMessage}</span>
        {refetch && (
          <Button variant="outline" size="sm" onClick={refetch} className="mt-2 self-end">
            Intentar nuevamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessageForm;
