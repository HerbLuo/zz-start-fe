import { logger } from "../utils/logger";
import { I18nConfig, I18nMessages, I18nString, SupportedLocale } from "./core-type";

const i18nConfigs: Record<string, I18nConfig> = {};

export const createI18n = (locale: SupportedLocale) => (key: I18nMessages, ...args: any[]): Promise<I18nString> => 
  import(/* webpackChunkName: "[request]" */`./i18n.${locale}.ts`).catch(e => {
    logger.warn(`找不到${locale}对应的本地化配置文件`, e);
  }).then(() => {
    const config = i18nConfigs[locale];
    const localizedMessage = config[key] || key;

    return localizedMessage as I18nString;
  }); 

export function configI18n(locale: string, config: I18nConfig) {
  i18nConfigs[locale] = config;
}
