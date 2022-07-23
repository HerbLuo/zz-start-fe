/**
 * 在src/i18n/core.lang.ts中定义主语言和支持的语言
 * 执行 `yarn generate i18n`
 * 就会自动生成样板文件
 * 
 * 其中
 * i18n.主语言(.module)?.ts 无需更改
 * i18n.当地语言(.module)?.ts 中变量i18n的组成为 Record<以主语言定义的模板字符串, 翻译后的模版字符串>, 参考:
 * ```
 * export const i18n: I18nMessages<"global"> = {
 *   "解析JSON失败, 可能是网络不稳定, 尝试刷新。": "Failed to parse JSON, the network may be unstable, try to refresh.",
 *   "请求失败, 可能是网络原因。": "The request failed, possibly due to the network.",
 *   "共 {} 页": "{} Results",
 * };
 * ```
 */
import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";
import { trim_margin } from "../utils/trim_margin";

const srcDir = path.resolve(__dirname, "../../src/");
const srcDirI18n = path.resolve(srcDir, "i18n");

// 解析 core.lang.ts
const coreLangFilename = "core.lang.ts";
const coreLangFilepath = path.resolve(srcDirI18n, coreLangFilename);
const coreLangCode = fs.readFileSync(coreLangFilepath, { encoding: "utf-8" });
const coreLangSourceFile = ts.createSourceFile(coreLangFilename, coreLangCode, ts.ScriptTarget.Latest);
let mainLang: string | null = null;
for (const statement of coreLangSourceFile.statements) {
  const declaration = (statement as ts.VariableStatement).declarationList?.declarations[0];
  if (((declaration?.name) as ts.Identifier)?.escapedText === "mainLang") {
    mainLang = (declaration.initializer as ts.StringLiteral).text;
  }
}
if (!mainLang) {
  throw new Error("找不到mainLang");
}
const supportedLocaleNode = coreLangSourceFile.statements.find(s => (s as ts.TypeAliasDeclaration).name.escapedText === "SupportedLocale") as ts.TypeAliasDeclaration;
const supportedLocales = (supportedLocaleNode.type as unknown as ts.UnionType).types.map(t => (t as any).literal.text).filter(l => l !== mainLang);

// 解析主语言文件
const mainI18nFilename = `i18n.${mainLang}.ts`;
const mainI18nFile = path.resolve(srcDirI18n, mainI18nFilename);

const mainI18nCode = fs.readFileSync(mainI18nFile, { encoding: "utf-8" });

const node = ts.createSourceFile(mainI18nFilename, mainI18nCode, ts.ScriptTarget.Latest);

const I18nMessageKeys: ts.InterfaceDeclaration = 
  node.statements.find(s => (s as ts.InterfaceDeclaration).name?.escapedText === "I18nMessageKeys") as ts.InterfaceDeclaration;
if (!I18nMessageKeys) {
  throw new Error("can not find interface I18nMessageKeys.");
}

for (const member of I18nMessageKeys.members) {
  if (member.kind !== ts.SyntaxKind.PropertySignature) {
    throw new Error("child of I18nMessageKeys must be property.");
  }
  const property = member as ts.PropertySignature;
  const propertyName = property.name as ts.Identifier;
  const module = propertyName.escapedText;
  console.log("模块", module);
  // 如果主语言的module文件不存在，则生成它
  if (module !== "global") {
    const mainLangModuleTsFilename = `i18n.${mainLang}.${module}.ts`;
    const mainLangModuleTsFilepath = path.resolve(srcDirI18n, mainLangModuleTsFilename);
    if (!fs.existsSync(mainLangModuleTsFilepath)) {
      console.log(`未找到模块${module}的主语言文件，生成中。`);
      fs.writeFileSync(mainLangModuleTsFilepath, "export {};\n")
      console.log(`生成完毕`);
    }
  }

  if (property.type?.kind !== ts.SyntaxKind.UnionType) {
    throw new Error("I18nMessageKeys的属性必须为Union类型.");
  }
  const union = property.type as unknown as ts.UnionType;
  const mainLangMsgs = union.types.map(type => ((type as any).literal as ts.StringLiteral).text);

  // 处理本地化语言定义文件
  for (const locale of supportedLocales) {
    const localeFilename = `i18n.${locale}${module === "global" ? "" : `.${module}`}.ts`;
    const localeFilepath = path.resolve(srcDirI18n, localeFilename);

    let localeCode: string | null = null;
    let pre: string | null = null;
    let suf: string | null = null;
    let msgs: string | null = null;

    if (fs.existsSync(localeFilepath)) {
      localeCode = fs.readFileSync(localeFilepath, { encoding: "utf-8" });
      const matched = localeCode.match(/([\s\S]+i18n: I18nMessages<"[^"]+"> = \{)([\s\S]+)(\};?\s+configI18n\("[\s\S]+)/);
      if (!matched) {
        throw new Error("无法解析 " + localeFilename);
      }
      pre = matched[1];
      msgs = matched[2];
      suf = matched[3]
    }

    // 替换msgs
    msgs = msgs?.trim() ?? null;
    msgs = msgs?.endsWith(",") ? msgs.substring(0, msgs.length - 1) : msgs;
    const msgRecord = msgs === null ? {} : JSON.parse(`{${msgs}}`);
    const msgRecordSorted: Record<string, string> = {};
    for (const mainLangMsg of mainLangMsgs) {
      msgRecordSorted[mainLangMsg] = msgRecord[mainLangMsg] || "";
    }
    msgs = JSON.stringify(msgRecordSorted, undefined, 2);
    msgs = `\n  ${msgs.substring(1, msgs.length - 1).trim()},\n`;

    // 处理pre, suf
    pre = pre || trim_margin(`
      import { configI18n, I18nMessages } from "./core";

      export const i18n: I18nMessages<"${module}"> = {
    `);
    suf = suf || trim_margin(`
      };

      configI18n("${locale}", "${module}", i18n);
    ` + "\n");
    // 不存在则创建
    const newLocaleCode = `${pre}${msgs}${suf}`;
    if (newLocaleCode !== localeCode) {
      console.log(`生成${localeFilename}中。`);
      fs.writeFileSync(localeFilepath, newLocaleCode);
      console.log(`生成完毕。`);
    }
  }
}
