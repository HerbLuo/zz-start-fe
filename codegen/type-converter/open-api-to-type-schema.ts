import { OpenApi3, OpenApi3Reference, OpenApi3Schema, OpenApi3Component } from "../type/open-api";
import { TypeSchema, TypeSchemaProperty } from "../type/schema.type";
import { jsonSchemaToTsType } from "./json-schema-to-ts-type";
import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { CompareUtil } from "../utils/CompareUtil";
import { isGenericsType, genericsTypeToTsType } from "./generics-type-to-ts-type";
import { removeOnLog } from "../../src/utils/logger";
import { TsType } from "../type/TsType";

export const AsyncReg = /^Async«(.+)»$/;
export const PromiseReg = /^Promise«(.+)»$/;

function areObjectType(schema: OpenApi3Schema | OpenApi3Reference): schema is OpenApi3Schema {
  return (schema as OpenApi3Schema).type === "object";
}

export class ZzTypeSchemas {
  private readonly zzSchemas: Record<string, TypeSchema> = {};

  constructor(openApi: OpenApi3) {
    const schemas = openApi.components?.schemas;
    if (schemas == null) {
      return;
    }

    const typeSchemas = Object.values(schemas).map(schema => this.openApiSchemaToTypeSchema(schema));

    for (const typeSchema of typeSchemas) {
      this.zzSchemas[typeSchema.title] = typeSchema;
    }

    this.removeTypesWhichCouldMapToJsDirectly();
    this.removeReqRes();
  }

  public get schemas() {
    return Object.values(this.zzSchemas);
  }

  public getByReferenceType(type: string) {
    return this.zzSchemas[type];
  }

  public formatTsType(tsType: TsType): TsType {
    let type = this.toReqResRemovedTsType(tsType.type);
    type = type.replace(/Async<(.+)>/g, "$1");
    const deps = tsType.deps.map(dep => {
      const depSchema = this.zzSchemas[dep];
      if (!depSchema) {
        return dep;
      }
      return depSchema.tsType !== dep ? depSchema.tsType : dep;
    });
    return new TsType(type, deps);
  }

  private openApiSchemaToTypeSchema(schema: OpenApi3Reference | OpenApi3Schema<JSONSchema7TypeName>): TypeSchema {
    if (!areObjectType(schema)) {
      throw new Error("不支持type: object以外的schema。");
    }

    const title = schema.title;
    if (!title) {
      throw new Error("未知的类型名");
    }

    const properties = schema.properties;
    if (!properties) {
      throw new Error("找不到properties属性");
    }

    // 将openApiSchema转为typeSchema
    const deps: Set<string> = new Set<string>();
    const modelTypeProperties: TypeSchemaProperty[] = Object.entries(properties).map(([key, value]) => {
      const jsonSchema = value as JSONSchema7;
      const tsType = jsonSchemaToTsType(jsonSchema);

      for (const dep of tsType.deps) {
        if (dep !== title) {
          deps.add(dep);
        }
      }
      // 对于不规范的键名，使用双引号包裹
      if (!key.match(/^[0-9a-zA-Z_$]+$/)) {
        key = `"${key.replace(/"/g, "\\\"")}"`;
      }
      return {
        property: key,
        type: tsType.type,
        remark: jsonSchema.description
      };
    });
    return {
      tsType: title,
      title,
      properties: modelTypeProperties,
      deps: [...deps],
    };
  }

  private removeTypesWhichCouldMapToJsDirectly() {
    for (const type of Object.keys(this.zzSchemas)) {
      if (isGenericsType(type)) {
        delete this.zzSchemas[type];
      }
      if (["LocalTime", "Timestamp", "LocalTimeReq", "LocalTimeRes", "TimestampReq", "TimestampRes"].includes(type)) {
        delete this.zzSchemas[type];
      }
    }
  }

  private removeReqRes() {
    const map: Record<string, TypeSchema[]> = {};
    for (const zzSchema of Object.values(this.zzSchemas)) {
      const reqResRemovedType = zzSchema.tsType.replace(/(Req|Res)$/, "");
      (map[reqResRemovedType] ||= []).push(zzSchema);
    }

    for (const [removedName, schemas] of Object.entries(map)) {
      if (schemas.length === 1) {
        continue;
      }
      
      if (schemas.length === 2) {
        if (!areTypeSchemaEquals(schemas[0], schemas[1])) {
          continue;
        }
        schemas[0].tsType = removedName;
        schemas[1].tsType = removedName;
      }

      if (schemas.length === 3) {
        const baseSchema = schemas.find(schema => schema.tsType === removedName);
        if (!baseSchema) {
          continue;
        }
        for (const schema of schemas) {
          if (areTypeSchemaEquals(schema, baseSchema)) {
            schema.tsType = removedName;
          }
        }
      }
    } 

    let refreshed = false;
    for (const schema of Object.values(this.zzSchemas)) {
      schema.deps = schema.deps.map(dep => {
        const depSchema = this.zzSchemas[dep];
        if (depSchema.tsType !== dep) {
          refreshed = true;
          return depSchema.tsType;
        }
        return dep;
      });
      for (const prop of schema.properties) {
        prop.type = this.toReqResRemovedTsType(prop.type);
      }
    }

    if (refreshed) {
      this.removeReqRes();
    }
  }

  private toReqResRemovedTsType(type: string): string {
    if (isGenericsType(type)) {
      return genericsTypeToTsType(type, this).type;
    } else if (type.endsWith("[]")) {
      const innerType = type.substring(0, type.length - 2);
      const innerTypeSchema = this.zzSchemas[innerType];
      if (innerTypeSchema && innerTypeSchema.tsType !== innerType) {
        return innerTypeSchema.tsType + "[]";
      }
    } else {
      const propSchema = this.zzSchemas[type];
      if (propSchema && propSchema.tsType !== type) {
        return propSchema.tsType;
      }
    }
    return type;
  }
}

const refsComparator = CompareUtil.createShallow().onlyContent();
const propertiesComparator = CompareUtil.create<TypeSchemaProperty>((a, b) => a.property === b.property && a.type === b.type).onlyContent();
export function areTypeSchemaEquals(t1: TypeSchema, t2: TypeSchema): boolean {
  return refsComparator.compareArray(t1.deps, t2.deps) && propertiesComparator.compareArray(t1.properties, t2.properties);
}

// open api -> type schemas -> req res removed type schemas
export interface TypeSchemas {
  typeSchemas?: TypeSchema[];
  noReqResTypeSchemas?: TypeSchema[];
}
