import * as path from "path";
import * as fs from "fs-extra";
import fetch from "node-fetch";
import { OpenApi3 } from "../type/open-api";
import { CodeGenerator } from "../utils/CodeGenerator";
import { ZzTypeSchemas } from "../type-converter/open-api-to-type-schema";
import { openApiToApiSchemas } from "../type-converter/open-api-to-api-schema";

const url = "http://127.0.0.1:8880/v3/api-docs";
const templateDir = path.resolve(__dirname, "../template");
const srcDir = path.resolve(__dirname, "../../src/");
const srcDirType = path.resolve(srcDir, "types");
const srcDirApi = path.resolve(srcDir, "api");

// init
if (!fs.existsSync(srcDir)) {
  throw new Error("找不到输出文件夹");
}
fs.ensureDirSync(srcDirType);

// main
async function main() {
  const openApi: OpenApi3 = await fetch(url).then(r => r.json());

  const typeSchemas = new ZzTypeSchemas(openApi);

  CodeGenerator.create()
    .withHash()
    .add({
      templateFilepath: path.join(templateDir, "type.ts.hbs"),
      targetDir: srcDirType,
      models: typeSchemas.schemas,
      filename: model => model.tsType + ".ts",
    })
    .add({
      templateFilepath: path.join(templateDir, "api.ts.hbs"),
      targetDir: srcDirApi,
      models: openApiToApiSchemas(openApi, typeSchemas),
      filename: model => model.group + ".ts",
    })
    .generate();
}

main().catch(console.error);
