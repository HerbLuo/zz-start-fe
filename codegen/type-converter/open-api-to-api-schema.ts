import { OpenApi3, HttpMethods, OpenApi3Operation, OpenApi3RequestBody, OpenApi3Reference, OpenApi3ParameterSchemaMode, OpenApi3Parameter } from "../type/open-api";
import { ApiSchema, ApiSchemaOperation, ApiSchemaJsonBody, ApiSchemaResponse, ApiSchemaParameter, ApiMethods } from "../type/schema.api";
import { dash_case2camelCase } from "../utils/camelCase";
import { ZzTypeSchemas } from "./open-api-to-type-schema";
import { openApi3ReferenceToTsType } from "./open-api-reference-to-ts-type";
import { jsonSchemaToTsType } from "./json-schema-to-ts-type";
import { javaPlainTypeMapTsPlainType } from "./generics-type-to-ts-type";

const supportedHttpMethods: HttpMethods[] = ["get", "post", "put", "patch", "delete"];
const usingMethodReg = new RegExp(`Using(${supportedHttpMethods.map(m => m.toUpperCase()).join("|")})`);

function areRequestBody(requestBody: OpenApi3RequestBody | OpenApi3Reference): requestBody is OpenApi3RequestBody {
  return !(requestBody as OpenApi3Reference).$ref;
}

function areRef(obj: any): obj is OpenApi3Reference {
  return !!(obj as OpenApi3Reference)?.$ref;
}

function areSchemaMode(parameter: OpenApi3Parameter): parameter is OpenApi3ParameterSchemaMode {
  return !!(parameter as OpenApi3ParameterSchemaMode).schema;
}

function fixOperationName(apiSchemas: ApiSchema[]): ApiSchema[] {
  for (const apiSchema of apiSchemas) {
    const { deps, methods, operations } = apiSchema;
    for (const operation of operations) {
      const operationName = operation.operationName;
      if (deps.includes(operationName) || methods.includes(operationName as ApiMethods)) {
        let fixed = `do${operationName[0].toUpperCase()}${operationName.substring(1)}`;
        while(true) {
          if (!operations.find(op => op.operationName === fixed)) {
            operation.operationName = fixed;
            break;
          }
          fixed = fixed + "$";
        }
      }
    }
  }
  return apiSchemas;
}

export function openApiToApiSchemas(openApi: OpenApi3, typeSchemas: ZzTypeSchemas): ApiSchema[] {
  const paths = openApi.paths;

  const operationsGrouped: Record<string, ApiSchemaOperation[]> = {}; 

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const [pathItemKey, pathItemValue] of Object.entries(pathItem)) {
      if (!supportedHttpMethods.includes(pathItemKey as any)) {
        continue;
      }
      const method = pathItemKey as HttpMethods;
      const operation = pathItemValue as OpenApi3Operation;

      const summary = operation.summary;
      const tag = operation.tags?.find(tag => tag.startsWith("group(") && tag.endsWith(")"));
      if (!tag) {
        console.warn("找不到接口所在组");
        continue;
      }
      const group = tag.substring(6, tag.length - 1).replace(/-controller$/, "-api");
      const operationSchemas = operationsGrouped[group] ||= [];

      const operationName = operation.operationId?.replace(usingMethodReg, "") ?? "makeOperator";
      const depSet: Set<string> = new Set();

      const openApiParameters = operation.parameters;
      const parameters: ApiSchemaParameter[] = openApiParameters?.map(parameter => {
        if (!parameter || areRef(parameter) || !areSchemaMode(parameter)) {
          throw new Error("不支持的请求参数定义: " + parameter);
        }
        const description = parameter.description;
        const name = parameter.style === "simple" 
          ? parameter.name 
          : parameter.name?.replace(/[^a-zA-Z0-9]/g, "_") || "_";;
        const schema = parameter.schema; 
        if (!schema || areRef(schema)) {
          console.warn("不支持的parameter类型");
          return { name, type: "unknown" };
        }
        const tsType = jsonSchemaToTsType(schema);
        let type = tsType.type;
        const descTypeMatched = description?.match(/type\(([^)]+)\)/);
        if (descTypeMatched) {
          const descType = descTypeMatched[1];
          if (descType.endsWith("[]")) {
            const arrType = descType.replace("[]", "");
            type = (javaPlainTypeMapTsPlainType[arrType] || "unknown") + "[]";
          }
        }

        return {
          name,
          type,
        }
      }) || [];

      let jsonBody: ApiSchemaJsonBody | undefined = undefined;
      const requestBody = operation.requestBody; 
      if (requestBody && areRequestBody(requestBody)) {
        const jsonRequestBody = requestBody.content?.["application/json"];
        if (!jsonRequestBody) {
          console.warn("不支持的 request body");
        } else {
          const schema = jsonRequestBody?.schema;
          if (areRef(schema)) {
            const jsType = openApi3ReferenceToTsType(schema, typeSchemas);
            jsonBody = {
              type: jsType.type,
              name: "body",
            };
            for (const dep of jsType.deps) {
              depSet.add(dep);
            }
          }
        }
      }

      const openApi3ResponseOrRef = operation.responses[200] || operation.responses.default;
      let response: ApiSchemaResponse = { type: "unknown" };
      if (openApi3ResponseOrRef && !areRef(openApi3ResponseOrRef)) {
        const schema = openApi3ResponseOrRef.content?.["*/*"]?.schema;
        if (schema) {
          const hasReqResType = areRef(schema) 
            ? openApi3ReferenceToTsType(schema, typeSchemas) 
            : jsonSchemaToTsType(schema);
          const tsType = typeSchemas.formatTsType(hasReqResType);
          response = {
            type: tsType.type,
          }
          for (const dep of tsType.deps) {
            depSet.add(dep);
          }
        }
      }

      const deps = [...depSet];
      const withParamsEs6PathString = path.replace(/{/g, "${")
      const apiSchemaOperation: ApiSchemaOperation = {
        path: withParamsEs6PathString,
        method: method === "delete" ? "del" : method, 
        operationName,
        parameters,
        deps,
        jsonBody,
        response,
        summary,
      };
      operationSchemas.push(apiSchemaOperation);
    }
  }

  const apiSchemas = Object.entries(operationsGrouped).map(([group, operations]) => ({
    group,
    camelCaseGroup: dash_case2camelCase(group),
    methods: [...new Set(operations.map(operation => operation.method))],
    deps: [...new Set(operations.map(operation => operation.deps).flat())],
    operations,
  }));
  return fixOperationName(apiSchemas);
}
