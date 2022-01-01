import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { SwaggerDefinition, SwaggerDoc } from "../types";
import { trim_margin } from "../utils/trim_margin";
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from "typescript";
import { type } from "os";

const url = "http://127.0.0.1:8880/v2/api-docs";
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types")

// init
if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);

// interfaces
interface JsBeanProperties {
  property: string;
  type: string;
}

interface ParsedDefinition {
  properties: JsBeanProperties[];
}

// util functions
function resolveType(definitions: Record<string, SwaggerDefinition>) {
  const definitionEntries = Object.entries(definitions);
  for (const [typeName, definition] of definitionEntries) {
    console.log(typeName);
    console.log(definition);
    
  }
}

// main
async function main() {
  const swagger: SwaggerDoc = await fetch(url).then(r => r.json());
  const definitions = swagger.definitions;

  for (const [typeName, definition] of Object.entries(definitions)) {


    const typeFileContent = trim_margin(
      `
        // 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
        // 该文件的 HASH值为 ##， 
        // 如果你修改了该文件，会使它断开与 ZZ-CODE-GEN 的关联，即下次生成文件的时候，不会更新该文件
        export interface ${typeName} {
          ${Object.entries(definition.properties).map(([key, value]) => `${key}: ${value.type};`).join(`
          `)}
        }
      `
    ) + "\n";
    fs.writeFileSync(path.resolve(srcDirType, typeName + ".ts"), typeFileContent);
  }
}

main().catch(console.error);
