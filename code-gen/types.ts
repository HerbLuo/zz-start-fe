
export interface SwaggerDoc {
  basePath: string;
  definitions: Record<string, SwaggerDefinition>;
  host: string;
  info: {
    "version": "1.0",
    "title": "接口文档",
    "contact": {
      "name": "herbluo",
      "url": "https://cloudself.cn/",
      "email": "im.hb@qq.com"
    }
  };
  paths: Record<string, Record<SwaggerMethods, SwaggerPath>>;
  swagger: string;
  tags: SwaggerTag[];
}

export type SwaggerType = "object" | "string" | "integer" | "number" | "boolean" | "array";
export type SwaggerFormat = "int64" | "date-time" | "int32";

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

export interface SwaggerPath {
  tags: string[];
  summary: string;
  operationId: string;
  "consumes": [
    "application/json"
  ],
  "produces": [
    "*/*"
  ],
  "parameters": [
    {
      "in": "body",
      "name": "login",
      "description": "login",
      "required": true,
      "schema": {
        "$ref": "#/definitions/UsernamePassword"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "OK",
      "schema": {
        "$ref": "#/definitions/Token"
      }
    },
    "201": {
      "description": "Created"
    },
    "401": {
      "description": "Unauthorized"
    },
    "403": {
      "description": "Forbidden"
    },
    "404": {
      "description": "Not Found"
    }
  }
}
