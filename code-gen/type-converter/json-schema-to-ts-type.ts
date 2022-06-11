import { TsType, UnknownTsType } from "../type/TsType";
import { JSONSchema7, JSONSchema7Definition, JSONSchema7TypeName } from "json-schema";
import { OpenApi3Format } from "../type/open-api";
import { logger } from "../utils/log";
import { openApi3ReferenceToTsType } from "./open-api-reference-to-ts-type";

type ToTsTypeFun = (property: JSONSchema7) => TsType | false;
type Definition = TsType | Partial<Record<OpenApi3Format | "default", TsType>> | ToTsTypeFun;
type JsonSchemaToJsTypeDefinition = Partial<Record<JSONSchema7TypeName | "default", Definition>>;
const jsonSchemaToTsTypeDefinitionMap: JsonSchemaToJsTypeDefinition = {
  "integer": new TsType("number"),
  "boolean": new TsType("boolean"),
  "number": new TsType("number"),
  "string": {
    "date": new TsType("Date"),
    "date-time": new TsType("Date"),
    "default": new TsType("string"),
  },
  "array": (jsonSchema: JSONSchema7) => {
    if (!jsonSchema.items || jsonSchema.items === true) {
      logger.warn("无法解析的JsonSchema，array类型必须存在items项");
      return UnknownTsType;
    }
    const items: JSONSchema7 | JSONSchema7Definition[] = jsonSchema.items;
    const itemSchema = items as JSONSchema7;
    return jsonSchemaToTsType(itemSchema).mapType(type => `${type}[]`);
  },
  "object": (jsonSchema: JSONSchema7) => {
    const { additionalProperties } = jsonSchema;
    if (!additionalProperties) {
      return false;
    }
    if (additionalProperties === true) {
      logger.warn("object type with true addition properties is not support.");
      return UnknownTsType;
    }
    return jsonSchemaToTsType(additionalProperties).mapType(type => `Record<string, ${type}>`);
  },
  "default": (jsonSchema: JSONSchema7) => {
    // 剩下的应当是ref类型的
    const ref = jsonSchema.$ref;
    if (!ref) {
      return UnknownTsType;
    }

    return openApi3ReferenceToTsType({$ref: ref});
  }
}

/**
 * JSON schema 转成TS类型
 * @param schema 
 * @returns 
 */
export function jsonSchemaToTsType(schema: JSONSchema7): TsType {
  let tsType: TsType | null = null;
  for (const [schemaTypeInConfig, definitionInConfig] of Object.entries(jsonSchemaToTsTypeDefinitionMap)) {
    // default, 按照定义事件的先后循序, default是最后一个循环到的
    if (schemaTypeInConfig === "default") {
      if (typeof definitionInConfig !== "function") {
        throw new Error("default类型的key只支持function类型的value.");
      }
      const tsTypeOrFalse = definitionInConfig(schema);
      if (tsTypeOrFalse === false) {
        continue;
      }
      tsType = tsTypeOrFalse;
      break;
    }

    // 如果schema的类型与配置的key不匹配, 跳过该配置
    if (schemaTypeInConfig !== schema.type) {
      continue;
    }

    // schemaType -> tsType
    if (definitionInConfig instanceof TsType) {
      tsType = definitionInConfig;
      break;
    }

    // type + format -> tsType
    if (typeof definitionInConfig === "object") {
      for (const [format, targetType] of Object.entries(definitionInConfig)) {
        if (format === "default" || format === schema.format) {
          tsType = targetType;
          break;
        }
      }
      if (tsType) {
        break;
      }
    }

    // type 自定义处理方法
    if (typeof definitionInConfig === "function") {
      const tsTypeOrFalse = definitionInConfig(schema);
      if (tsTypeOrFalse === false) {
        continue;
      }
      tsType = tsTypeOrFalse;
      break;
    }
  }

  if (!tsType) {
    return UnknownTsType;
  }

  return tsType.mapType(type => type.replace(/Array<([^<>]+)>/g, "$1[]"));
}
