import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { createHash } from "crypto";
import { SwaggerDefinition, SwaggerDoc, SwaggerFormat, SwaggerProperty, SwaggerType } from "./types";
import { trim_margin } from "../utils/trim_margin";

const url = "http://127.0.0.1:8880/v2/api-docs";
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types");

// init
if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);

class JsType {
  constructor(public readonly type: string, public readonly refs: readonly string[] = []) {
  }

  public mapType(fn: (type: string) => string): JsType {
    return new JsType(fn(this.type), this.refs);
  }
}

const UnknownType = new JsType("unknown");

type ToJsTypeFun = (property: SwaggerProperty) => false | JsType;

const PromiseReg = /^Promise«(.+)»$/;
const AsyncReg = /^Async«(.+)»$/;
const HashReg = /(###HASH###<)([^<>]+)(>###HASH###)/;

const javaPlainTypeMapJsPlainType: Record<string, string> = {
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
  ["array", (property: SwaggerProperty) => property.items ? toJsType(property.items).mapType(type => `Array<${type}>`) : UnknownType],
  ["object", (property: SwaggerProperty) => property.additionalProperties ? toJsType(property.additionalProperties).mapType(type => `Record<string, ${type}>`) : false],
  ["object", "any"],
  [(property: SwaggerProperty) => {
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

function toJsType(property: SwaggerProperty): JsType {
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

// interfaces
interface JsBeanProperties {
  property: string;
  type: string;
}

interface ParsedDefinition {
  typeName: string;
  properties: JsBeanProperties[];
  refs: string[];
}

// util functions
function resolveType(definitions: Record<string, SwaggerDefinition>) {
  const parsedDefinitions: ParsedDefinition[] = [];
  const definitionEntries = Object.entries(definitions);
  for (const [typeName, definition] of definitionEntries) {
    const definitionPropertiesEntries = Object.entries(definition.properties);
    const refs: Set<string> = new Set<string>();
    const properties: JsBeanProperties[] = definitionPropertiesEntries.map(([key, value]) => {
      const jsType = toJsType(value);
      for (const ref of jsType.refs) {
        if (ref !== typeName) {
          refs.add(ref);
        }
      }
      if (!key.match(/^[0-9a-zA-Z_$]+$/)) {
        key = `"${key.replace(/"/g, "\\\"")}"`;
      }
      return {
        property: key,
        type: jsType.type,
      };
    });
    parsedDefinitions.push({
      typeName,
      properties,
      refs: [...refs]
    });
  }
  return parsedDefinitions;
}

// main
async function main() {
  const swagger: SwaggerDoc = await fetch(url).then(r => r.json());
  const definitions = swagger.definitions;
  const parsedDefinitions = resolveType(definitions);

  for (const {typeName, properties, refs} of parsedDefinitions) {
    if (typeName.match(PromiseReg) || typeName.match(AsyncReg)) {
      continue;
    }
    if (["LocalTime", "Timestamp"].includes(typeName)) {
      continue;
    }

    const typeFileContent = trim_margin(
      `
        // 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
        // 该文件的 HASH值为 ###HASH###< >###HASH###， 
        // 如果你修改了该文件，下次执行"code gen"操作时，不会更新该文件
        ${refs.map(ref => `import { ${ref} } from "./${ref}";`).join(`
        `)}${refs.length > 0 ? `
        ` : ""}
        export interface ${typeName} {
          ${properties.map((property) => `${property.property}: ${property.type};`).join(`
          `)}
        }
      `
    ) + "\n";

    const hasher = createHash("sha256");
    hasher.update(typeFileContent.replace(HashReg, "").trim().replace(/\r\n/g, "\n"));
    const sha256 = hasher.digest("hex");

    const typeFileContentWithHash = typeFileContent.replace(HashReg, `$1${sha256}$3`);
    fs.writeFileSync(path.resolve(srcDirType, typeName + ".ts"), typeFileContentWithHash);
  }
}

main().catch(console.error);
