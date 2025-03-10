import { toast } from "sonner";

import { Result } from "./result";
import { ServerFetchError } from "./serverFetch";

type ToastMessages = {
  loading: string;
  success: string;
  error: (e: ServerFetchError) => string;
};

/**
 * Permite utilizar una promesa de tipo Result<A,B>
 * en un toast de sonner.
 */
export function nextToast<Success>(promise: Promise<Result<Success, ServerFetchError>>, messages: ToastMessages) {
  toast.promise(
    new Promise((resolve, reject) => {
      promise.then(([data, error]) => {
        if (error) reject(error);
        else resolve(data);
      });
    }),
    messages
  );
}

/*
 * Permite utilizar una promesa de tipo Result<A,B>
 * en un toast de sonner. Adicionalmente
 * devuelve de inmediato la promesa original
 */
export function toastWrapper<Success>(
  promise: Promise<Result<Success, ServerFetchError>>,
  messages: ToastMessages
): Promise<Result<Success, ServerFetchError>> {
  toast.promise(
    new Promise((resolve, reject) => {
      promise.then(([data, error]) => {
        if (error) reject(error);
        else resolve(data);
      });
    }),
    messages
  );
  return promise;
}
