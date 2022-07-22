import { javaBeanReviver } from "./json-parse-reviver";

export function cloneBean<T extends {}>(bean: T): T {
  return JSON.parse(JSON.stringify(bean), javaBeanReviver);
}
