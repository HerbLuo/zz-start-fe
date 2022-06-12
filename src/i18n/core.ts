import { logger } from "../utils/logger";
import { I18nConfig, I18nMessages, I18nString, SupportedLocale } from "./core-type";
import { mainLang } from "./i18n";

const i18nConfigs: Record<string, I18nConfig> = JSON.parse(localStorage.getItem("i18n_configs") || "{}");

export function createI18n(locale: SupportedLocale) {
  const isMainLang = locale === mainLang;
  return (key: I18nMessages, ...args: any[]): I18nString | Promise<I18nString> => {
    if (isMainLang) {
      return key as I18nString;
    }
    const config = i18nConfigs[locale];
    if (config) {
      return (config[key] || key) as I18nString;
    }
    return import(/* webpackChunkName: "[request]" */`./i18n.${locale}.ts`).catch(e => {
      logger.warn(`找不到${locale}对应的本地化配置文件`, e);
    }).then(() => {
      localStorage.setItem("i18n_configs", JSON.stringify(i18nConfigs));
      return (i18nConfigs[locale][key] || key) as I18nString;
    });
  }
} 

export function configI18n(locale: string, config: I18nConfig) {
  i18nConfigs[locale] = config;
}
