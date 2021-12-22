export type SupportedLocale = "zh_CN" | "en_US";

export type I18nMessages =
    | "解析JSON失败，可能是网络不稳定，尝试刷新。"
    | "请求失败，可能是网络原因，错误信息：{}"
    | "服务器出了点小问题，尝试联系支持人员"
    | "服务器出了点问题，尝试联系支持人员"
    ;

export type I18nConfig = Record<I18nMessages, string>;

const I18nStringSymbol = Symbol("i18n string");
export type I18nString = string & { readonly symbol: typeof I18nStringSymbol };
