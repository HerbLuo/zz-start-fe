import { configI18n, I18nMessages } from "./core";

export const i18n: I18nMessages<"global"> = {
  "解析JSON失败, 可能是网络不稳定, 尝试刷新。": "Failed to parse JSON, the network may be unstable, try to refresh.",
  "请求失败, 可能是网络原因。": "The request failed, possibly due to the network.",
  "服务器出了点小问题, 尝试联系支持人员。": "There is a problem on the server, try to contact support.",
  "服务器出了些问题, 尝试联系支持人员。": "Something went wrong on the server, try to contact support.",
  "登陆失败，{}秒后自动跳转": "",
};

configI18n("en_US", "global", i18n);
