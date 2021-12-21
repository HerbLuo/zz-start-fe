import { I18nConfig } from "./i18n.core.type";

type Locale = string;

const i18nConfigs: Record<Locale, I18nConfig> = {};

export function useLocale(locale: string) {
  return function i18n(key: TemplateStringsArray, ...args: any[]): string {
    const config = i18nConfigs[locale];


    return "";
  }
}

export function configI18n(locale: string, config: I18nConfig) {
  i18nConfigs[locale] = config;
}
