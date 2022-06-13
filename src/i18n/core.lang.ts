export type SupportedLocale = "zh_CN" | "en_US";

export const mainLang: SupportedLocale = "zh_CN";

export const currentLang: SupportedLocale = 
  (new URL(window.location.href).searchParams.get("lang") || mainLang) as SupportedLocale;
