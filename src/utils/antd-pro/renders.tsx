import dayjs from "dayjs";
import { DevError } from "../errors";
import { logger } from "../logger";

export function renderText(text: string, className?: string): JSX.Element;
export function renderText(textConvertor: (text: string) => string): (text: string) => JSX.Element;
export function renderText(textConvertor: string | ((text: any) => string), className?: string)
  : JSX.Element | ((text: string) => JSX.Element) {
  return (typeof textConvertor === "string" || textConvertor === undefined || textConvertor === null)
    ? (<span className={className}>{textConvertor}</span>)
    : (txt: string) => (<span className={className}>{textConvertor(txt)}</span>);
}

export const renderDate = (
  datetimeFormat?: string, 
  type: "datetime" | "date" | "time" | "year" | "month" = "date"
) => (
  value: unknown
): JSX.Element => {
  if (!value) {
    return renderText("");
  }
  if (!datetimeFormat) {
    if (typeof value === "string") {
      if (type === "time") {
        if (value.length === 5) {
          datetimeFormat = "HH:mm";
        } else if (value.length === 8) {
          datetimeFormat = "HH:mm:ss";
        }  
      } else if (type === "year") {
        if (value.length === 4) {
          datetimeFormat = "YYYY";
        }
      }
    }
  }
  const d = dayjs(value as any, datetimeFormat);
  if (!d.isValid() && !datetimeFormat) {
    const error = new DevError("无法解析date(time)。可尝试添加sys_sp_ele.datetime_format(后端)，或者前端修改renderDate方法。");
    if (typeof value === "string") {
      logger.warn(error);
      return renderText(value);
    }
    throw error;
  }
  let text: string;
  switch(type) {
    case "datetime": text = d.format('YYYY-MM-DD HH:mm:ss'); break;
    case "date": text = d.format("YYYY-MM-DD"); break;
    case "time": text = d.format("HH:mm:ss"); break;
    case "year": text = d.format("YYYY");  break;
    case "month": text = d.format("YYYY-mm"); break;
    default: text = "unknown type.";
  }
  return renderText(text);
}
