import { configI18n, I18nMessages } from "./core";

export const i18n: I18nMessages<"query"> = {
  "确定重置该方案?": "Are you sure? current plan will be reset to be same as the server-saved plan.",
  "确定清空该方案?": "Are you sure? current plan's search value will be clear.",
  "确定删除方案：《{}》?": "Are you sure? item {} will be remove?",
  "我的方案：": "My Plans: ",
  "快捷筛选：": "Qk Filters: ",
  "编辑": "Edit",
  "确定": "Ensure",
  "查询": "Search",
  "重置": "Reset",
  "清空": "Clear",
  "保存方案": "Save",
  "另存为方案": "Save As",
};

configI18n("en_US", "query", i18n);