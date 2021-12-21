export type I18nMessages = 
  | "解析JSON失败，原始值：{}，错误信息：{}"
  | "请求失败，可能是网络原因，错误信息：{}"
  ;

export type I18nConfig = Record<I18nMessages, string>;
