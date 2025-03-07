declare module "js-cookie" {
  interface CookiesStatic<T = object> {
    get(name: string): string | undefined;
    getJSON(name: string): T | undefined;
    set(name: string, value: string | object, options?: Cookies.CookieAttributes): void;
    remove(name: string, options?: Cookies.CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
