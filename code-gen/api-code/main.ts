import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { createHash } from "crypto";
import { ZzApiPath, SwaggerDefinition, SwaggerDoc, SwaggerFormat, SwaggerPathConfig, SwaggerPropertyConfig, SwaggerType } from "./types";
import { trim_margin } from "../utils/trim_margin";
import { apiTemplate } from "./api.template";
import { PromiseReg, toJsType } from "./type-convert";

const url = "http://127.0.0.1:8880/v2/api-docs";
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types");
const srcDirApi = path.resolve(srcDir, "api");

// init
if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);


const AsyncReg = /^Async«(.+)»$/;
const HashReg = /(###HASH###<)([^<>]+)(>###HASH###)/;

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

  // 生成类型定义
  const swaggerDefinitions = swagger.definitions;
  const parsedDefinitions = resolveType(swaggerDefinitions);

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

  // 
  // 生成 Api 接口
  const swaggerPaths = swagger.paths;

  const zzApiPathsGroupedByController: Record<string, ZzApiPath[]> = {};

  for (const [urlPath, methodWithPath] of Object.entries(swaggerPaths)) {
    for (const [method, pathInfo] of Object.entries(methodWithPath)) {
      const tag = pathInfo.tags.find(tag => tag.startsWith("group(") && tag.endsWith(")"));
      if (!tag) {
        console.warn("找不到接口所在组");
        continue;
      }
      const group = tag.substring(6, tag.length - 1).replace(/-controller$/, "-api");
      const paths = zzApiPathsGroupedByController[group] ||= [];
      paths.push({ path: urlPath, method: method === "delete" ? "del" : method, pathConfig: pathInfo });
    }
  }

  for (const [group, pathAndInfos] of Object.entries(zzApiPathsGroupedByController)) {
    const fileContent = apiTemplate(group, pathAndInfos);

    fs.writeFileSync(path.resolve(srcDirApi, group + ".ts"), fileContent);
  }
}

main().catch(console.error);
