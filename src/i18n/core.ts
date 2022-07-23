import { logger } from "../utils/logger";
import type { I18nMessageKeys } from "./i18n.zh_CN";
import { mainLang, SupportedLocale, currentLang } from "./core.lang";
import { stringTemplate } from "../utils/string-template";
export type { I18nMessageKeys };

/* types */
export type Modules = keyof I18nMessageKeys;
const I18nStringSymbol = Symbol("i18n string");
export type I18nString = string & { readonly symbol: typeof I18nStringSymbol };
export type I18nMessages<M extends Modules> = Record<I18nMessageKeys[M], string>;
export type I18nMessagesModule = {
  [M in Modules]: I18nMessages<M>;
}

/* models */
const i18nMessagesJsonString = localStorage.getItem("i18n_messages") || "{}";
const i18nMessagesModuleLocale: Record<SupportedLocale, I18nMessagesModule> = JSON.parse(i18nMessagesJsonString);

/* functions */
export function configI18n<M extends Modules>(locale: SupportedLocale, module: M, config: I18nMessagesModule[M]) {
  (i18nMessagesModuleLocale[locale] ||= ({} as I18nMessagesModule))[module] = config;
  localStorage.setItem("i18n_messages", JSON.stringify(i18nMessagesModuleLocale));
}

interface I18nFunction<M extends Modules> {
  (key: I18nMessageKeys[M], ...args: any[]): Promise<I18nString>;
  (guess: true, key: I18nMessageKeys[M], ...args: any[]): { guess: I18nString | null, exact: Promise<I18nString> };
}

export interface I18n extends I18nFunction<"global"> {
  module<M extends Modules>(module: M): I18nFunction<M>;
}

export function createI18n(locale: SupportedLocale): I18n {
  const isMainLang = locale === mainLang;

  // /* webpackChunkName: "[request]" */
  const toI18nMsg = <M extends Modules>(module: M): I18nFunction<M> => {
    const dynamicModule = module === "global"
      ? import(`./i18n.${locale}.ts`)
      : import(`./i18n.${locale}.${module}.ts`);

    return ((guessOrKey, ...others) => {
      const guessMode = guessOrKey === true;
      let key: I18nMessageKeys[M];
      let args: any[];
      if (guessMode) {
        [key, ...args] = others;
      } else {
        key = guessOrKey;
        args = others;
      }

      const exact: Promise<I18nString> = dynamicModule.catch(e => {
        logger.warn(`找不到${locale}对应的本地化配置文件`, e);
      }).then(() => {
        return stringTemplate(i18nMessagesModuleLocale[locale]?.[module]?.[key] || key, ...args) as I18nString;
      });

      if (!guessMode) {
        return exact;
      }

      let guess: string | null = null;
      if (isMainLang) {
        guess = stringTemplate(key, ...args) as I18nString;
      } else {
        const i18nMessagesModule = i18nMessagesModuleLocale[locale];
        if (i18nMessagesModule) {
          const i18nMessages = i18nMessagesModule[module];
          const msg = i18nMessages[key];
          if (msg) {
            guess = stringTemplate(msg, ...args);
          }
        }
      }

      return {
        guess,
        exact,
      }
    }) as I18nFunction<M>
  };

  const i18n: I18n = toI18nMsg("global") as I18n;
  i18n.module = (m: Modules) => toI18nMsg(m);
  return i18n;
} 

export const i18n = createI18n(currentLang);
export const i18nGlobal = i18n;
