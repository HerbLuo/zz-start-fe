export type SupportedLocale = "zh_CN" | "en_US";

export type I18nMessages =
  | "Failed to parse JSON, the network may be unstable, try to refresh."
  | "The request failed, possibly due to the network."
  | "There is a problem with the server, try to contact support."
  | "Something went wrong with the server, try to contact support."
  ;

export type I18nConfig = Record<I18nMessages, string>;

const I18nStringSymbol = Symbol("i18n string");
export type I18nString = string & { readonly symbol: typeof I18nStringSymbol };
