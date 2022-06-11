import { TsType } from "../type/TsType";
import { ZzTypeSchemas } from "./open-api-to-type-schema";

export function isGenericsType(type: string) {
  return type.includes("«") || type.includes("<");
}

/**
 * Java范型内联类型转TS
 * 
 * 因为生成的文档中，
 * Java的范型不会转换为JsonSchema类型，是以Java原值的形式存在，所以需要将这部分值映射到TS类型
 */
export const javaPlainTypeMapTsPlainType: Record<string, string> = {
  int: "number",
  Integer: "number",
  boolean: "boolean",
  Boolean: "boolean",
  char: "string",
  Character: "string",
  byte: "string",
  Byte: "string",
  short: "number",
  Short: "number",
  float: "number",
  Float: "number",
  long: "number",
  Long: "number",
  double: "number",
  Double: "number",
  void: "void",
  Void: "void",
  Map: "Record",
};

export function genericsTypeToTsType(type: string, typeSchemas?: ZzTypeSchemas): TsType {
  const deps: string[] = [];
  const typeStr = type.replace(/([^,«»<> ]+)/g, (s) => {
    const plainType = javaPlainTypeMapTsPlainType[s];
    if (plainType) {
      return plainType;
    }
    if (typeSchemas) {
      const tsType = typeSchemas.getByReferenceType(s)?.tsType;
      if (tsType) {
        deps.push(tsType);
        return tsType;
      }
    }
    return s;
  }).replace(/«/g, "<").replace(/»/g, ">").replace(/,[^ ]/g, ", ");
  return new TsType(typeStr, deps);
}
