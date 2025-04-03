export type ReduxError = {
  status: number;
  data: {
    message: string;
    error: string;
    statusCode: number;
  };
};

export const processError = (error: unknown, addAltMessage?: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "data" in error) {
    const reduxError = error as ReduxError;
    const errorMessage =
      reduxError.data.message ?? reduxError.data.error ?? reduxError.data.statusCode.toString() ?? "";
    if (reduxError.status && reduxError.data) {
      return errorMessage;
    }
  }

  return "Error desconocido" + (addAltMessage ? `: ${addAltMessage}` : "");
};
