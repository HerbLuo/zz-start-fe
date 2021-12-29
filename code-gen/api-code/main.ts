import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { SwaggerDoc } from "../types";

const url = "http://127.0.0.1:8880/v2/api-docs";
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types")

if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);

function resolveType() {

}

async function main() {
  const swagger: SwaggerDoc = await fetch(url).then(r => r.json());
  const definitions = swagger.definitions;

  for (const [typeName, definition] of Object.entries(definitions)) {


    const typeFileContent = `
      // 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
      // 该文件的 HASH值为 ##， 
      // 如果你修改了该文件，会使它断开与 ZZ-CODE-GEN 的关联，即下次生成文件的时候，不会更新该文件
      export interface ${typeName} {
        ${Object.entries(definition.properties).map(([key, value]) => `${key}: ${value.type};`).join(`
        `)}
      }
    `;
    fs.writeFileSync(path.resolve(srcDirType, typeName + ".ts"), typeFileContent);
  }
}

main().catch(console.error);
