import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { SwaggerDefinition, SwaggerDoc, SwaggerFormat, SwaggerProperty, SwaggerType } from "../types";
import { trim_margin } from "../utils/trim_margin";

const url = "http://127.0.0.1:8880/v2/api-docs";
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types")

// init
if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);

type ToJsTypeFun = (property: SwaggerProperty) => string | false;
const toJsTypeDefinitionArray: Array<
  [SwaggerType, string] | 
  [SwaggerType, SwaggerFormat, string] | 
  [SwaggerType, ToJsTypeFun] |
  [ToJsTypeFun]
> = [
  ["boolean", "boolean"],
  ["integer", "number"],
  ["number", "number"],
  ["string", "date-time", "Date"],
  ["string", "string"],
  ["array", (property: SwaggerProperty) => property.items ? `Array<${toJsType(property.items)}>` : "unknown"],
  ["object", (property: SwaggerProperty) => property.additionalProperties ? `Record<string, ${toJsType(property.additionalProperties)}>` : false],
  ["object", "any"],
  [(property: SwaggerProperty) => {
    const ref = property.$ref;
    if (!ref) {
      return false;
    }
    const type = ref.split("/").pop();
    switch (type) {
      case "Timestamp":
        return "number";
      case "LocalTime":
        return "string";
      default:
        return type?.replace(/«/g, "<").replace(/»/g, ">") || "unknown";
    }
  }]
];

function toJsType(property: SwaggerProperty): string {
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
}

// util functions
function resolveType(definitions: Record<string, SwaggerDefinition>) {
  const parsedDefinitions: ParsedDefinition[] = [];
  const definitionEntries = Object.entries(definitions);
  for (const [typeName, definition] of definitionEntries) {
    const definitionPropertiesEntries = Object.entries(definition.properties);
    const properties: JsBeanProperties[] = definitionPropertiesEntries.map(([key, value]) => {
      return {
        property: key,
        type: toJsType(value),
      };
    });
    parsedDefinitions.push({
      typeName,
      properties,
    });
  }
  return parsedDefinitions;
}

// main
async function main() {
  const swagger: SwaggerDoc = await fetch(url).then(r => r.json());
  const definitions = swagger.definitions;
  const parsedDefinitions = resolveType(definitions);

  for (const { typeName, properties } of parsedDefinitions) {
    const typeFileContent = trim_margin(
      `
        // 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
        // 该文件的 HASH值为 ##， 
        // 如果你修改了该文件，会使它断开与 ZZ-CODE-GEN 的关联，即下次生成文件的时候，不会更新该文件
        export interface ${typeName} {
          ${properties.map((property) => `${property.property}: ${property.type};`).join(`
          `)}
        }
      `
    ) + "\n";
    fs.writeFileSync(path.resolve(srcDirType, typeName + ".ts"), typeFileContent);
  }
}

main().catch(console.error);
