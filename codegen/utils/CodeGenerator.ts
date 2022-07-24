import * as fs from "fs";
import Handlebars from "handlebars";
import * as HandlebarsHelpers from "handlebars-helpers";
import * as path from "path";
import { trim_margin } from "./trim_margin";
import { createHash } from "crypto";

const HashReg = /(\/\/ *禁止修改 #HASH)<([^<>]+)>(HASH#)/;
HandlebarsHelpers();

export interface GeneratorConfig {
  withHash: boolean;
}

export interface GeneratorTemplateConfig<T extends {}> {
  templateFilepath: string;
  models: T[];
  targetDir: string;
  filename: (model: T) => string;
}

class Model<T> {
  constructor(private readonly config: GeneratorTemplateConfig<T>, public readonly model: T) { }

  private targetFilepath: string | null = null;
  public getTargetFilepath() {
    if (!this.targetFilepath) {
      this.targetFilepath = path.join(this.config.targetDir, this.config.filename(this.model));
    }
   return this.targetFilepath;
  }
}

export class CodeGenerator {
  private readonly config: GeneratorConfig = { withHash: false };
  private readonly configs: GeneratorTemplateConfig<any>[] = [];

  private constructor() {}
  public static create() {
    return new CodeGenerator();
  }

  public withHash(withHash = true): this {
    this.config.withHash = withHash;
    return this;
  }

  public add<T>(config: GeneratorTemplateConfig<T>): this {
    this.configs.push(config);
    return this;
  }

  private beforeGenerate(model: Model<any>): boolean {
    const targetFilepath = model.getTargetFilepath();
    if (!fs.existsSync(targetFilepath)) {
      return true;
    }
    const context = fs.readFileSync(targetFilepath, { encoding: "utf-8" });
    const hash256 = CodeGenerator.calcHash(context);
    const hashMatched = context.match(HashReg);
    const oldHash = hashMatched?.[2];
    if (!oldHash || !oldHash.trim()) {
      return true;
    }
    if (hash256 !== oldHash) {
      return false;
    }
    return true;
  }

  private beforeWrite(content: string): string {
    if (!this.config.withHash) {
      return content;
    }
    content = trim_margin(`
      // 自动生成的代码块，首行
      // 禁止修改 #HASH< >HASH#
      // 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
      // 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
    `) + "\n" + content + trim_margin(`
      // 自动生成的代码块，尾行
    `) + "\n";

    const hash = CodeGenerator.calcHash(content);
    return content.replace(HashReg, `$1<${hash}>$3`);
  }

  private static calcHash(content: string) {
    content = content.replace(/\/\* 在此处编写业务代码 START \*\/[\s\S]*?\/\* 在此处编写业务代码 END \*\//, "");
    content = content.match(/\/\/ 自动生成的代码块，首行[\s\S]*\/\/ (自动生成的代码块，尾行)?/)?.[0] || content.trim();
    content = content.replace(HashReg, "").replace(/\r\n/g, "\n");

    const hasher = createHash("sha256");
    hasher.update(content);
    return hasher.digest("hex");
  }

  public generate() {
    for (const config of this.configs) {
      const templateFile = fs.readFileSync(config.templateFilepath, { encoding: "utf-8" });
      const template = Handlebars.compile(templateFile, { noEscape: true });
      for (const _model of config.models) {
        const model = new Model(config, _model);
        if (!this.beforeGenerate(model)) {
          continue;
        }
        const targetFilepath = model.getTargetFilepath();

        const targetFile = this.beforeWrite(template(model.model));
        fs.writeFileSync(targetFilepath, targetFile);
      }
    }
  }
}
