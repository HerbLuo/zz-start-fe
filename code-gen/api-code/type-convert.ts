import { SwaggerFormat, SwaggerPropertyConfig, SwaggerType } from "./types";

/**
 * Java范型内联类型转Js
 */
export const javaPlainTypeMapJsPlainType: Record<string, string> = {
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

class JsType {
  constructor(public readonly type: string, public readonly refs: readonly string[] = []) {
  }

  public mapType(fn: (type: string) => string): JsType {
    return new JsType(fn(this.type), this.refs);
  }
}

const UnknownType = new JsType("unknown");

type ToJsTypeFun = (property: SwaggerPropertyConfig) => false | JsType;

export const PromiseReg = /^Promise«(.+)»$/;

/**
 * 
 */
const toJsTypeDefinitionArray: Array<[SwaggerType, string] |
  [SwaggerType, SwaggerFormat, string] |
  [SwaggerType, ToJsTypeFun] |
  [ToJsTypeFun]> = [
  ["integer", "number"],
  ["boolean", "boolean"],
  ["number", "number"],
  ["string", "date", "Date"],
  ["string", "date-time", "Date"],
  ["string", "string"],
  ["array", (property: SwaggerPropertyConfig) => property.items ? toJsType(property.items).mapType(type => `Array<${type}>`) : UnknownType],
  ["object", (property: SwaggerPropertyConfig) => property.additionalProperties ? toJsType(property.additionalProperties).mapType(type => `Record<string, ${type}>`) : false],
  ["object", "any"],
  [(property: SwaggerPropertyConfig) => {
    const ref = property.$ref;
    if (!ref) {
      return false;
    }
    const type = ref.split("/").pop();

    if (!type) {
      return UnknownType;
    }
    const simpleTypeMap: Record<string, string> = {
      Timestamp: "number",
      LocalTime: "string",
    };
    const jsType = simpleTypeMap[type];
    if (jsType) {
      return new JsType(jsType);
    }

    const promiseTypeMatched = type.match(PromiseReg);
    if (promiseTypeMatched) {
      let promiseInferType = promiseTypeMatched[1];
      promiseInferType = promiseInferType
        .replace(/([^,«»]+)/g, (s) => javaPlainTypeMapJsPlainType[s] || s)
        .replace(/«/g, "<")
        .replace(/»/g, ">")
        .replace(/,/g, ", ");
      return new JsType(`Promise<${promiseInferType}>`);
    }
    if (!type) {
      return UnknownType;
    }
    return new JsType(type, [type]);
  }],
];

export function toJsType(property: SwaggerPropertyConfig): JsType {
  let resJsType;
  for (const toJsTypeDefinition of toJsTypeDefinitionArray) {
    const len = toJsTypeDefinition.length;
    const first = toJsTypeDefinition[0];
    const second = toJsTypeDefinition[1];
    const third = toJsTypeDefinition[2];

    if (len === 1) {
      const simpleToJsFunc: ToJsTypeFun = first as any;
      resJsType = simpleToJsFunc(property);
      if (resJsType !== false) {
        break;
      }
    }
    if (len === 2) {
      const type: string = first as any;
      if (type === property.type) {
        if (typeof second === "string") {
          resJsType = second;
          break;
        } else {
          const simpleToJsFunc: ToJsTypeFun = second as any;
          resJsType = simpleToJsFunc(property);
          if (resJsType !== false) {
            break;
          }
        }
      }
    }
    if (len === 3) {
      const type: string = first as any;
      const format: string = second as any;
      const jsType: string = third as any;
      if (type === property.type && format === property.format) {
        resJsType = jsType;
        break;
      }
    }
  }
  if (!resJsType) {
    resJsType = "unknown";
  }
  if (resJsType === "unknown") {
    console.warn("[warn] unknown js type", property);
  }
  if (typeof resJsType === "string") {
    resJsType = new JsType(resJsType);
  }
  resJsType = resJsType.mapType(type => type.replace(/Array<([^<>]+)>/g, "$1[]"));
  return resJsType;
}
