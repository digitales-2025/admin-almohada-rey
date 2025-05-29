import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

import { Result } from "./utils/result";

interface JWTPayload {
  exp: number;
}

// Definiciones de rutas centralizadas
const ROUTES = {
  public: ["/log-in", "/update-password"],
  excluded: ["/", "/log-in"], // Rutas que no queremos guardar como última URL visitada
  api: ["/api"],
};

// Lista de extensiones que indican recursos estáticos
const STATIC_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".ico",
  ".css",
  ".js",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".gif",
  ".webp",
  ".map",
];

// Contador para reducir la frecuencia de logs
let logCounter = 0;
const LOG_FREQUENCY = 10; // Solo log cada X peticiones para reducir spam

// Caché simple para evitar decodificar repetidamente los mismos tokens
const tokenExpirationCache = new Map<string, { expiry: number; timestamp: number }>();

// Configuración centralizada para la comunicación con el backend
const backendConfig = {
  baseUrl: process.env.INTERNAL_BACKEND_URL,
  timeout: 5000,
};

function devlog(message: string, level: "info" | "warn" | "error" = "info", force = false) {
  if (process.env.NODE_ENV === "development") {
    // Mensajes comunes que generan spam
    const isFrequentMessage = message === "middleware hit" || message === "no cookie refresh performed, just continue";

    if (isFrequentMessage && !force) {
      logCounter++;
      if (logCounter % LOG_FREQUENCY !== 0) return;
    }

    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]; // HH:MM:SS
    const prefix = level === "error" ? "❌" : level === "warn" ? "⚠️" : "ℹ️";

    console[level](`\t${prefix} ${prefix === "ℹ️" ? "DEBUG" : level.toUpperCase()}: [${timestamp}] ${message}`);
  }
}

function logoutAndRedirectLogin(request: NextRequest) {
  devlog("Eliminando cookies y redirigiendo a login", "info", true);

  const response = NextResponse.redirect(new URL("/log-in", request.url));
  const lastUrl = ROUTES.excluded.includes(request.nextUrl.pathname) ? "/" : request.nextUrl.pathname;

  // Corregido: Usar el método delete correctamente
  response.cookies.delete("ar_status");
  response.cookies.delete("ar_token");
  response.cookies.delete("ar_refresh");

  response.cookies.set("lastUrl", lastUrl);
  return response;
}

/**
 * Devuelve en cuantos segundos expira el token JWT
 * Si el token es inválido o ya expiró, devuelve 0
 */
function tokenExpiration(token: string): number {
  if (!token) return 0;

  // Hash simplificado del token para usar como clave de caché
  const tokenKey = token.slice(-20);
  const now = Math.floor(Date.now() / 1000);
  const cachedResult = tokenExpirationCache.get(tokenKey);

  // Si tenemos un resultado en caché reciente (menos de 5 segundos), usarlo
  if (cachedResult && now - cachedResult.timestamp < 5) {
    return Math.max(0, cachedResult.expiry - now);
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const expiry = Math.max(0, decoded.exp - now);

    // Almacenar en caché
    tokenExpirationCache.set(tokenKey, { expiry: decoded.exp, timestamp: now });

    // Limpiar caché si crece demasiado
    if (tokenExpirationCache.size > 100) {
      const oldestKeys = [...tokenExpirationCache.keys()].slice(0, 50);
      oldestKeys.forEach((key) => tokenExpirationCache.delete(key));
    }

    return expiry;
  } catch {
    return 0;
  }
}

// Detecta si la ruta es para un recurso estático que podemos ignorar
function isStaticResource(pathname: string): boolean {
  return (
    STATIC_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext)) ||
    pathname.startsWith("/_next/") ||
    pathname.includes("favicon") ||
    /\.(json|xml|txt)$/i.test(pathname)
  );
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 300): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (retries <= 0) throw error;

    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

async function refresh(refreshToken: string): Promise<Result<Array<string>, string>> {
  try {
    // Añadir timeout para evitar bloqueos prolongados
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), backendConfig.timeout);

    const response = await fetch(`${backendConfig.baseUrl}/auth/refresh-token`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Cookie: `ar_refresh=${refreshToken}`,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newCookies = response.headers.getSetCookie();

    if (!newCookies || newCookies.length === 0) {
      return [[] as string[], "El refresh fue exitoso, pero no contenia nuevas cookies"];
    }

    return [newCookies, null];
  } catch (error: unknown) {
    // Corregido: Tipando error correctamente
    console.error("Refresh token error:", error);

    // Mensajes de error más específicos
    if (error instanceof Error && error.name === "AbortError") {
      return [[] as string[], "Timeout al intentar refrescar el token"];
    }

    return [[] as string[], "Error refrescando token"];
  }
}

function parseSetCookie(cookieString: string) {
  const pairs: Array<[string, string | boolean]> = cookieString
    .split(";")
    .map((pair) => pair.trim())
    .map((pair) => {
      const [key, ...values] = pair.split("=");
      return [key.toLowerCase(), values.join("=") || true];
    });

  // Obtener el nombre y valor de la cookie
  const [cookieName, cookieValue] = pairs[0];
  const cookieMap = new Map(pairs.slice(1));

  return {
    name: cookieName,
    value: cookieValue as string,
    options: {
      path: cookieMap.get("path") as string,
      maxAge: cookieMap.has("max-age") ? parseInt(cookieMap.get("max-age") as string) : undefined,
      expires: cookieMap.has("expires") ? new Date(cookieMap.get("expires") as string) : undefined,
      httpOnly: cookieMap.get("httponly") === true,
      sameSite: cookieMap.has("samesite")
        ? ((cookieMap.get("samesite") as string).toLowerCase() as "strict")
        : undefined,
    },
  };
}

export async function middleware(request: NextRequest) {
  const startTime = performance.now();
  const { pathname } = request.nextUrl;

  // Ignorar completamente los recursos estáticos para reducir ejecuciones innecesarias
  if (isStaticResource(pathname)) {
    return NextResponse.next();
  }

  const ar_token = request.cookies.get("ar_token");
  const ar_refresh = request.cookies.get("ar_refresh");
  const isAuthenticated = !!ar_token && !!ar_refresh;

  devlog("middleware hit");

  // Manejar rutas públicas
  if (ROUTES.public.includes(pathname)) {
    if (isAuthenticated) {
      devlog("Ruta pública, usuario autenticado - redirigiendo", "info", true);

      const lastVisitedUrl = request.cookies.get("lastUrl")?.value ?? "/";
      const nextResponse = NextResponse.redirect(new URL(lastVisitedUrl, request.url));
      nextResponse.cookies.delete("lastUrl");
      return nextResponse;
    } else {
      devlog("Ruta pública, sin autenticación - permitiendo acceso", "info");
      return NextResponse.next();
    }
  }

  // Verificar presencia de refresh_token
  if (!ar_refresh) {
    devlog(`No se encontró refresh token. Token de acceso: ${ar_token ? "presente" : "ausente"}`, "warn", true);
    return logoutAndRedirectLogin(request);
  }

  // Verificar expiración del token de acceso
  if (tokenExpiration(ar_token?.value ?? "") < 10) {
    devlog("Token de acceso expira en menos de 10s, intentando refresh", "info", true);

    // Verificar expiración del refresh_token
    if (tokenExpiration(ar_refresh.value) < 5) {
      devlog("Refresh token expira en menos de 5s", "warn", true);
      return logoutAndRedirectLogin(request);
    }

    // Intentar refresh de token con reintentos
    try {
      const [newCookies, err] = await withRetry(() => refresh(ar_refresh.value));

      if (err) {
        devlog(`Error en refresh: ${err}`, "error", true);
        return logoutAndRedirectLogin(request);
      }

      devlog("Refresh exitoso, actualizando cookies", "info", true);
      const response = NextResponse.next();

      newCookies.forEach((cookie) => {
        const { name, value, options } = parseSetCookie(cookie);
        response.cookies.set({
          name,
          value,
          ...options,
        });
      });

      return response;
    } catch (error: unknown) {
      // Corregido: Tipando error correctamente
      const errorMessage = error instanceof Error ? error.message : String(error);
      devlog(`Exception durante refresh: ${errorMessage}`, "error", true);
      return logoutAndRedirectLogin(request);
    }
  }

  // Al final, registrar el tiempo que tardó si fue excesivo
  const processingTime = performance.now() - startTime;
  if (processingTime > 50) {
    // Solo registrar si tardó más de 50ms
    devlog(`Procesó ${pathname} en ${processingTime.toFixed(2)}ms (lento)`, "warn", true);
  }

  devlog("no cookie refresh performed, just continue");
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Coincide con todas las rutas excepto recursos estáticos y API
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico).*)",
  ],
};
