export interface TypeSchemaProperty {
  property: string;
  type: string;
  remark?: string;
}

export interface TypeSchema {
  tsType: string;
  title: string; // 原名称
  properties: TypeSchemaProperty[];
  deps: string[];
}
