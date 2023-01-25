import { configI18n, I18nMessages } from "./core";

const i18n: I18nMessages<"login"> = {
  "登录": "Sign In",
  "注册": "Sign Up",
  "记住我": "Remember Me",
  "用户名": "Username",
  "密码": "Password",
  "用户名不能为空": "Username can not be empty.",
  "密码不能为空": "Password can not be empty.",
} as any;

configI18n("en_US", "login", i18n);
