export type SwaggerType = "object" | "string" | "integer" | "number" | "boolean" | "array";
export type SwaggerFormat = "int64" | "date" | "date-time" | "int32";
export type SwaggerMethods = "post" | "get" | "put" | "patch" | "delete" | "options";

export interface SwaggerTag {
  name: string;
  description: string;
}

export interface SwaggerPathParameter {
  in: "body" | "path";
  name: string;
  description: string;
  required: boolean;
  type: string;
  schema: {
    $ref: string;
  };
}

export interface SwaggerResponse {
  description: string;
  schema: {
    $ref: string;
  }
}

export interface SwaggerPathConfig {
  tags: string[];
  summary: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: SwaggerPathParameter[];
  responses: Record<"200" | "201" | "401" | "403" | "404", SwaggerResponse>;
}

export interface SwaggerPropertyConfig {
  type?: SwaggerType;
  format?: string;
  items?: SwaggerPropertyConfig;
  additionalProperties?: SwaggerPropertyConfig;
  $ref?: string;
}

export interface SwaggerDefinition {
  type: SwaggerType;
  properties: Record<string, SwaggerPropertyConfig>;
  title: string;
  required: string[];
}

export interface SwaggerDoc {
  basePath: string;
  definitions: Record<string, SwaggerDefinition>;
  host: string;
  paths: Record<string, Record<SwaggerMethods, SwaggerPathConfig>>;
  swagger: string;
  tags: SwaggerTag[];
}

export interface ZzApiPath { 
  path: string;
  method: string;
  pathConfig: SwaggerPathConfig;
}
