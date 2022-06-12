import { configI18n } from "./core";
import { I18nConfig } from "./core-type";

const i18n: I18nConfig = {
  "登录": "Sign In",
  "注册": "Sign Up",
  "记住我": "Remember Me",
  "用户名": "Username",
  "密码": "Password",

  "用户名不能为空": "Username can not be empty.",
  "密码不能为空": "Password can not be empty.",

  "解析JSON失败, 可能是网络不稳定, 尝试刷新。": "Failed to parse JSON, the network may be unstable, try to refresh.",
  "请求失败, 可能是网络原因。": "The request failed, possibly due to the network.",
  "服务器出了点小问题, 尝试联系支持人员。": "There is a problem on the server, try to contact support.",
  "服务器出了些问题, 尝试联系支持人员。": "Something went wrong on the server, try to contact support.",
};

configI18n("en_US", i18n);
