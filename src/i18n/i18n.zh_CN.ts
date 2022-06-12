import { configI18n } from "./core";

const i18n_def = [
  "登录",
  "注册",
  "记住我",
  "用户名",
  "密码",
  "用户名不能为空",
  "密码不能为空",

  "解析JSON失败, 可能是网络不稳定, 尝试刷新。",
  "请求失败, 可能是网络原因。",
  "服务器出了点小问题, 尝试联系支持人员。",
  "服务器出了些问题, 尝试联系支持人员。",
] as const;

export type I18nMessages = (typeof i18n_def)[number];
const i18n: Record<I18nMessages, string> = {} as any;

configI18n("zh_CN", i18n);
