export interface SwaggerDoc {
  basePath: string;
  definitions: Record<string, SwaggerDefinition>;
  host: string;
  paths: Record<string, Record<SwaggerMethods, SwaggerPath>>;
  swagger: string;
  tags: SwaggerTag[];
}

export type SwaggerType = "object" | "string" | "integer" | "number" | "boolean" | "array";
export type SwaggerFormat = "int64" | "date" | "date-time" | "int32";

export interface SwaggerProperty {
  type?: SwaggerType;
  format?: string;
  items?: SwaggerProperty;
  additionalProperties?: SwaggerProperty;
  $ref?: string;
}

export interface SwaggerDefinition {
  type: SwaggerType;
  properties: Record<string, SwaggerProperty>;
  title: string;
  required: string[];
}

export type SwaggerMethods = "post" | "get" | "put" | "patch" | "delete" | "options";

export interface SwaggerTag {
  name: string;
  description: string;
}

export interface SwaggerParameter {
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

export interface SwaggerPath {
  tags: string[];
  summary: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: SwaggerParameter[];
  responses: Record<"200" | "201" | "401" | "403" | "404", SwaggerResponse>;
}
export interface ApiPathWithInfo { 
  path: string;
  method: string;
  info: SwaggerPath;
}
