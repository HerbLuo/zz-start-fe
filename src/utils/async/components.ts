import { I18nString } from "../../i18n/core";
import { PromiseOr } from "../ts";
import { createAsync } from "./create-async";

/**
 * <span children={Promise.resolve("resolved text")}/>
 */
export const AsyncText = createAsync("span", ["children"]);

export const I18n = ({text}: {text: PromiseOr<I18nString>}) => 
  AsyncText({children: text})
