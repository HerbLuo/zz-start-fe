import { I18nConfig, I18nMessages } from "./i18n.core.type";

type Locale = string;

const i18nConfigs: Record<Locale, I18nConfig> = {};

export function useLocale(locale: string) {
  return function i18n(key: I18nMessages, ...args: any[]): string {
    // const config = i18nConfigs[locale];
    return key;
  }
}

export function configI18n(locale: string, config: I18nConfig) {
  i18nConfigs[locale] = config;
}
