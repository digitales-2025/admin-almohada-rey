import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

import { Result } from "./utils/result";

interface JWTPayload {
  exp: number;
}

const PUBLIC_ROUTES = ["/log-in", "/update-password"];
// Rutas que no queremos guardar como última URL visitada
const EXCLUDED_REDIRECT_ROUTES = ["/", "/log-in"];

function devlog(message: string) {
  if (process.env.NODE_ENV === "development") {
    console.log("\tDEBUG: " + message);
  }
}

function logoutAndRedirectLogin(request: NextRequest) {
  devlog("nuking cookies and redirecting to login\n\n");

  const response = NextResponse.redirect(new URL("/log-in", request.url));
  const lastUrl = EXCLUDED_REDIRECT_ROUTES.includes(request.nextUrl.pathname) ? "/" : request.nextUrl.pathname;

  response.cookies.delete("logged_in");
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.set("lastUrl", lastUrl);
  return response;
}

/**
 * Devuelve en cuantos segundos expira el token jwt pasado como param.
 * Si el token es invalido, o ya ha expirado, devuelve 0
 */
function tokenExpiration(token: string): number {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
  } catch {
    return 0;
  }
}

async function refresh(refreshToken: string): Promise<Result<Array<string>, string>> {
  try {
    const response = await fetch(`${process.env.INTERNAL_BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newCookies = response.headers.getSetCookie();

    if (!newCookies || newCookies.length === 0) {
      return [
        // @ts-expect-error allowing null
        null,
        "El refresh fue exitoso, pero no contenia nuevas cookies",
      ];
    }

    return [newCookies, null];
  } catch (error) {
    console.error("Refresh token error:", error);

    return [
      // @ts-expect-error allowing null
      null,
      "Error refrescando token",
    ];
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

  // Get the first pair which has the cookie name and value
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
  const access_token = request.cookies.get("access_token");
  const refresh_token = request.cookies.get("refresh_token");
  const isAuthenticated = !!access_token && !!refresh_token;
  const { pathname } = request.nextUrl;

  devlog("middleware hit");

  if (PUBLIC_ROUTES.includes(pathname) && isAuthenticated) {
    devlog("public route, is auth, redirect...");

    const lastVisitedUrl = request.cookies.get("lastUrl")?.value ?? "/";
    const nextResponse = NextResponse.redirect(new URL(lastVisitedUrl, request.url));
    nextResponse.cookies.delete("lastUrl");
    return nextResponse;
  }
  if (PUBLIC_ROUTES.includes(pathname) && !isAuthenticated) {
    devlog("public route, is not auth, continue");

    return NextResponse.next();
  }

  if (!refresh_token) {
    devlog(`no refresh token found! access is ${access_token?.value}`);

    return logoutAndRedirectLogin(request);
  }

  // if the access_token expires in 10s or less,
  // attempt to refresh it
  if (tokenExpiration(access_token?.value ?? "") < 10) {
    devlog("access expire in less than 10, refresh");

    // check them refresh_token. if it expires in 5 seconds or
    // less, forget it, remove all tokens and redirect to /login
    if (tokenExpiration(refresh_token.value) < 5) {
      devlog("refresh expire in less than 5...");

      return logoutAndRedirectLogin(request);
    }

    // do session refresh here
    const [newCookies, err] = await refresh(refresh_token.value);
    if (err) {
      devlog("error refreshing!");
      console.log(err);
      return logoutAndRedirectLogin(request);
    }

    devlog("setting cookies");

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
  }

  devlog("no cookie refresh performed, just continue");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. /api (rutas API)
     * 2. /_next (archivos estáticos de Next.js)
     * 3. /_static (si tienes una carpeta static)
     * 4. /_vercel (archivos internos de Vercel)
     * 5. /favicon.ico, /sitemap.xml, etc.
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};
