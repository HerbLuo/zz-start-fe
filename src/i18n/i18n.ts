import { useLocale } from "./i18n.core";
import { I18nMessages } from "./i18n.core.type";

export const i18n = useLocale("zh_CN");

export const i18nError = (message: I18nMessages, ...args: any[]) => new Error(i18n(message));
