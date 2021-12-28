
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

export interface SwaggerDefinition {
  "type": "object",
  "properties": {
    "prefetch": {
      "type": "integer",
      "format": "int32"
    }
  },
  "title": "Async«SysSearchQueryRes»"
}

export type SwaggerMethods = "post" | "get" | "put" | "patch" | "delete" | "op";

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
