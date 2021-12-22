import {I18nConfig, I18nMessages, I18nString, SupportedLocale} from "./core-type";

const i18nConfigs: Record<string, I18nConfig> = {};

export const createI18n = (locale: SupportedLocale) => (key: I18nMessages, ...args: any[]): Promise<I18nString> => 
  import(/* webpackChunkName: "[request]" */`./i18n.${locale}.ts`).then(() => {
    const config = i18nConfigs[locale];
    const localedMessage = config[key] || key;
    return localedMessage as I18nString;
  }); 

export function configI18n(locale: string, config: I18nConfig) {
  i18nConfigs[locale] = config;
}
