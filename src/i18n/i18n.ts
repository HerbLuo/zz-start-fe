import { createI18n } from "./core";
import { SupportedLocale } from "./core-type";

export const mainLang: SupportedLocale = "zh_CN";

const lang = new URL(window.location.href).searchParams.get("lang") || mainLang;

export const i18n = createI18n(lang as SupportedLocale);
