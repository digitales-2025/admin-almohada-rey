import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { translateError } from "./translateError";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  credentials: "include", // Envía cookies HttpOnly en cada solicitud
});

export type QueryError = {
  name: string;
  message: string;
  stack: string;
};

type ServerError = {
  error: string;
  message?: string;
  statusCode: number;
};
type ReduxError = {
  data?: ServerError;
  status: number | string;
  error?: string;
};

/**
 * Enhanced base query function with automatic token refresh and authentication handling.
 *
 * @param args - The query arguments (url, method, etc.)
 * @param api - The Redux toolkit API object
 * @param extraOptions - Additional options for the query
 * @returns A promise that resolves with the query result
 *
 * @description
 * This query function wraps the base fetchBaseQuery with additional authentication logic:
 *
 * 1. Attempts the original request
 * 2. If a 401 unauthorized error is received:
 *    - For login requests: Returns the error as-is
 *    - For other requests:
 *      a. Attempts to refresh the auth token
 *      b. If refresh succeeds, retries the original request
 *      c. If refresh fails, logs out the user and redirects to login
 * 3. Returns the final result
 *
 * @example
 * ```ts
 * // Used as the baseQuery in RTK Query API definitions
 * export const api = createApi({
 *   baseQuery: baseQueryWithReauth,
 *   endpoints: (builder) => ({...})
 * });
 * ```
 */
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  // Realiza la solicitud inicial
  let result = await baseQuery(args, api, extraOptions);

  // Verifica si el error es 401 (no autorizado)
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    const originalRequest = args as { url: string };
    const isLoginRequest = originalRequest.url.includes("/auth/login");

    if (isLoginRequest) {
      return result;
    }

    // Intento de refresco de token con el endpoint /auth/refresh-token
    const refreshResult = await baseQuery({ url: "/auth/refresh-token", method: "POST" }, api, extraOptions);

    if (refreshResult.data) {
      // Si el refresco del token fue exitoso, se reintenta la solicitud original
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Si el refresco del token falló, cierra sesión y redirige al login
      await baseQuery({ url: "/auth/logout", method: "POST" }, api, extraOptions);

      // Opcional: despacha una acción para actualizar el estado de autenticación en Redux
      // api.dispatch(logoutAction());

      // Redirecciona al usuario a la página de inicio de sesión
      window.location.href = "/log-in";
    }
  }

  return result;
};

/**
 * Executes a function and handles backend errors in a standardized way.
 *
 * @template Output - The type of the successful result
 * @param {() => Promise<Output>} fn - The async function to execute
 * @returns {Promise<Output>} A promise that resolves with the function result or rejects with a formatted error
 *
 * @description
 * This utility function wraps an async operation and provides consistent error handling:
 *
 * - If the operation succeeds, returns the result directly
 * - If it fails, attempts to extract an error message from the response
 * - Translates the error message to user-friendly text
 * - Returns a rejected promise with the formatted error
 *
 * The error object follows the format: `{message: string}`
 *
 * @example
 * ```typescript
 * // Basic usage with toast
 * const promise = runAndHandleError(() => api.someEndpoint())
 * toast.promise(promise, {
 *   loading: "Processing...",
 *   success: "Operation successful",
 *   error: (err) => err.message
 * })
 *
 * // Usage with await
 * try {
 *   const result = await runAndHandleError(() => api.someEndpoint())
 *   // Handle success
 * } catch (err) {
 *   // err.message contains translated error
 * }
 * ```
 */
export function runAndHandleError<Output>(fn: () => Promise<Output>): Promise<Output> {
  return new Promise((resolve, reject) => {
    fn()
      .then((res) => resolve(res))
      .catch((err: ReduxError) => {
        // Obtener el msg de error, o utilizar uno por defecto
        let error_msg = "";
        if (err.data && err.data.message) {
          error_msg = err.data.message;
        } else if (err.error) {
          error_msg = err.error;
        }

        // Despues de intentar obtener el msg de error, si esta vacio,
        // usar un msg de error por defecto.
        if (error_msg === "") {
          error_msg = "Ocurrió un error inesperado, por favor intenta de nuevo";
        }

        // traducir y relanzar
        reject({
          message: translateError(error_msg),
        });
      });
  });
}

export default baseQueryWithReauth;
