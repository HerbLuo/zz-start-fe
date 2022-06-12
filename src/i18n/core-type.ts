import type { I18nMessages } from "./i18n.zh_CN";
export type SupportedLocale = "zh_CN" | "en_US";

export type { I18nMessages };

export type I18nConfig = Record<I18nMessages, string>;

const I18nStringSymbol = Symbol("i18n string");
export type I18nString = string & { readonly symbol: typeof I18nStringSymbol };
