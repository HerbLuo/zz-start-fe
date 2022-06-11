import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
export type OpenApi3DataType = "integer" | "number" | "string" | "boolean";
export type OpenApi3Format = "int32" | "int64" | "float" | "double" | "byte" | "binary" | "date" | "date-time" | "password";

export type HttpMethods = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";
export type HttpStatusCode = 100 | 101 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 426 | 500 | 501 | 502 | 503 | 504 | 505;

export interface OpenApi3Info {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name?: string;
    url?: string;
  };
  version: string;
}

export interface OpenApi3Server {
  url: string;
  description?: string;
  variables?: Record<string, {
    enum?: string[];
    default: string;
    description?: string;
  }>;
}

export interface OpenApi3Reference {
  $ref: string;
}

export type OpenApi3SchemaType = JSONSchema7TypeName;

export interface OpenApi3Discriminator {
  propertyName: string;
  mapping?: Record<string, string>;
}

export interface OpenApi3Xml {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

export interface OpenApi3Schema<T extends JSONSchema7TypeName = JSONSchema7TypeName> extends JSONSchema7 {
  type: T;
  nullable?: boolean;
  discriminator?: OpenApi3Discriminator;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: OpenApi3Xml;
  externalDocs?: OpenApi3ExternalDocs;
  example?: any;
  deprecated?: boolean;
}

interface OpenApi3ParameterCommon {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  description?: string;
  required: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
}

interface OpenApi3ParameterSchemaModeCommon extends OpenApi3ParameterCommon {
  // style?: string; for query - form; for path - simple; for header - simple; for cookie - form.
  explode?: boolean;
  allowReserved?: boolean;
  example?: any;
  examples?: Record<string, OpenApi3Example | OpenApi3Reference>;
}

type OpenApi3SchemaPrimitive = OpenApi3DataType;

export interface OpenApi3ParameterSchemaModeMatrix extends OpenApi3ParameterSchemaModeCommon {
  style?: "matrix";
  in: "path";
  schema?: OpenApi3Schema<OpenApi3SchemaPrimitive | "array" | "object"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModeLabel extends OpenApi3ParameterSchemaModeCommon {
  style: "label";
  in: "path";
  schema?: OpenApi3Schema<OpenApi3SchemaPrimitive | "array" | "object"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModeForm extends OpenApi3ParameterSchemaModeCommon {
  style: "form";
  in: "query" | "cookie";
  schema?: OpenApi3Schema<OpenApi3SchemaPrimitive | "array" | "object"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModeSimple extends OpenApi3ParameterSchemaModeCommon {
  style: "simple";
  in: "path" | "header";
  schema?: OpenApi3Schema<"array"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModeSpaceDelimited extends OpenApi3ParameterSchemaModeCommon {
  style: "spaceDelimited";
  in: "query";
  schema?: OpenApi3Schema<"array"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModePipeDelimited extends OpenApi3ParameterSchemaModeCommon {
  style: "pipeDelimited";
  in: "query";
  schema?: OpenApi3Schema<"array"> | OpenApi3Reference;
}

export interface OpenApi3ParameterSchemaModeDeepObject extends OpenApi3ParameterSchemaModeCommon {
  style: "deepObject";
  in: "query";
  schema?: OpenApi3Schema<"object"> | OpenApi3Reference;
}

export type OpenApi3ParameterSchemaMode = OpenApi3ParameterSchemaModeMatrix | OpenApi3ParameterSchemaModeLabel | 
  OpenApi3ParameterSchemaModeForm | OpenApi3ParameterSchemaModeSimple | OpenApi3ParameterSchemaModeSpaceDelimited | 
  OpenApi3ParameterSchemaModePipeDelimited | OpenApi3ParameterSchemaModeDeepObject;

export interface OpenApi3ParamterContentMode extends OpenApi3ParameterCommon {
  content: Record<string, OpenApi3MediaType>
}

export type OpenApi3Parameter = OpenApi3ParameterSchemaMode | OpenApi3ParamterContentMode;

export type OpenApi3Header = Omit<OpenApi3Parameter, "name" | "in">;

export interface OpenApi3Response {
  description?: string;
  headers?: Record<string, OpenApi3Header>;
  content?: Record<string, OpenApi3MediaType>;
  links?: Record<string, OpenApi3Link | OpenApi3Reference>;
}

export type OpenApi3Callback = Record<string, OpenApi3PathItem>;

export interface OpenApi3Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: OpenApi3ExternalDocs;
  operationId?: string;
  parameters?: Array<OpenApi3Parameter | OpenApi3Reference>;
  requestBody?: OpenApi3RequestBody | OpenApi3Reference;
  responses: Record<"default" | HttpStatusCode, OpenApi3Response | OpenApi3Reference>;
  callbacks?: Record<string, OpenApi3Callback | OpenApi3Reference>;
  deprecated?: boolean;
  security?: OpenApi3Security;
  servers?: OpenApi3Server[];
}

export interface OpenApi3PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OpenApi3Operation;
  put?: OpenApi3Operation;
  post?: OpenApi3Operation;
  delete?: OpenApi3Operation;
  options?: OpenApi3Operation;
  head?: OpenApi3Operation;
  patch?: OpenApi3Operation;
  trace?: OpenApi3Operation;
  servers?: OpenApi3Server[];
  parameters?: Array<OpenApi3Parameter | OpenApi3Reference>;
}

export type OpenApi3Path = Record<string, OpenApi3PathItem>;

export interface OpenApi3Example {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: any;
}

export interface OpenApi3Encoding {
  contentType?: string;
  headers?: Record<string, OpenApi3Reference>;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface OpenApi3MediaType {
  schema?: OpenApi3Schema | OpenApi3Reference;
  example?: any;
  examples?: Record<string, OpenApi3Example | OpenApi3Reference>;
  encoding?: Record<string, OpenApi3Encoding>;
}

export interface OpenApi3RequestBody {
  description?: string;
  content?: Record<string, OpenApi3MediaType>;
  required?: boolean;
}

export interface OpenApi3SecuritySchema {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name: string;
  in: "query" | "header" | "cookie";
  schema: string;
  bearaerFormat?: string;
  flows: Record<"implicit" | "password" | "clientCredentials" | "authorizationCode", {
    authorizationUrl: string;
    tokenUrl: string;
    refreshUrl: string;
    scopes: Record<string, string>;
  }>;
  openIdConnectUrl: string;
}

export interface OpenApi3Link {
  operationRef?: string;
  operationId?: string;
  parameters?: Record<string, any | string>;
  requestBody?: Record<string, any | string>;
  description?: string;
  server: OpenApi3Server;
}

export interface OpenApi3Component {
  schemas?: Record<string, OpenApi3Schema | OpenApi3Reference>;
  responses?: Record<string, OpenApi3Response | OpenApi3Reference>;
  paramters?: Record<string, OpenApi3Component | OpenApi3Reference>;
  examples?: Record<string, OpenApi3Example | OpenApi3Reference>;
  requestBodies?: Record<string, OpenApi3RequestBody | OpenApi3Reference>;
  headers?: Record<string, OpenApi3Header | OpenApi3Reference>;
  securitySchemas?: Record<string, OpenApi3SecuritySchema | OpenApi3Reference>;
  links?: Record<string, OpenApi3Link | OpenApi3Reference>;
  callbacks?: Record<string, OpenApi3Callback | OpenApi3Reference>;
}

export interface OpenApi3Tag {
  name: string;
  description?: string;
  externalDocs?: OpenApi3ExternalDocs;
}

export type OpenApi3Security = Record<string, string[]>;

export interface OpenApi3ExternalDocs {
  description?: string;
  url: string;
}

export interface OpenApi3 {
  openapi: string; // version
  info: OpenApi3Info;
  servers?: OpenApi3Server[];
  paths: OpenApi3Path;
  components?: OpenApi3Component;
  security?: OpenApi3Security[];
  tags?: OpenApi3Tag[];
  externalDocs?: OpenApi3ExternalDocs;
}
