import { configI18n, I18nMessages } from "./core";

const i18n: I18nMessages<"table"> = {
  "共 {} 条": "{} Results",
};

configI18n("en_US", "table", i18n);

