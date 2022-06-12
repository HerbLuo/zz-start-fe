import { OpenApi3Reference } from "../type/open-api";
import { TsType } from "../type/TsType";
import { ZzTypeSchemas } from "./open-api-to-type-schema";
import { isGenericsType, genericsTypeToTsType } from "./generics-type-to-ts-type";

export function openApi3ReferenceToTsType(reference: OpenApi3Reference, typeSchemas?: ZzTypeSchemas): TsType {
  const ref = reference.$ref;
  const type = ref.split("/").pop();
  if (!type) {
    throw new Error("未知的引用类型");
  } 

  // 将timestamp等类型转为相应的js类型
  const simpleTypeMap: Record<string, string> = {
    Timestamp: "number",
    TimestampReq: "number",
    TimestampRes: "number",
    LocalTime: "string",
    LocalTimeReq: "string",
    LocalTimeRes: "string",
  };
  const jsType = simpleTypeMap[type];
  if (jsType) {
    return new TsType(jsType);
  }

  if (isGenericsType(type)) {
    return genericsTypeToTsType(type, typeSchemas);
  }

  const tsType = typeSchemas?.getByReferenceType(type).tsType || type;
  return new TsType(tsType, [tsType]);
}
