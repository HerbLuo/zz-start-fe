import { configI18n } from "./core";
import { I18nConfig } from "./core-type";

const i18n: I18nConfig = {
  "Failed to parse JSON, the network may be unstable, try to refresh.": "解析JSON失败，可能是网络不稳定，尝试刷新。",
  "The request failed, possibly due to the network.": "请求失败，可能是网络原因。",
  "There is a problem with the server, try to contact support.": "服务器出了点小问题，尝试联系支持人员。",
  "Something went wrong with the server, try to contact support.": "服务器出了些问题，尝试联系支持人员。",
};

configI18n("zh_CN", i18n);
