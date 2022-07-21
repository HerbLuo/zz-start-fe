import { HttpMethods } from "./open-api";

export type ApiMethods = Exclude<HttpMethods, "delete"> | "del";

export interface ApiSchemaParameter {
  name: string;
  type: string;
}

export interface ApiSchemaJsonBody {
  name: string;
  type: string;
}

export interface ApiSchemaResponse {
  type: string;
}

export interface ApiSchemaOperation {
  path: string;
  method: ApiMethods;
  operationName: string;
  parameters: ApiSchemaParameter[];
  deps: string[];
  jsonBody?: ApiSchemaJsonBody;
  response: ApiSchemaResponse;
  async: boolean;
  summary?: string;
}

export interface ApiSchema {
  group: string;
  camelCaseGroup: string;
  methods: ApiMethods[];
  deps: string[];
  operations: ApiSchemaOperation[];
}
