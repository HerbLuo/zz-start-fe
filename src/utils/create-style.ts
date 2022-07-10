import { CSSProperties } from "react";

interface StyleDefinition { 
  [name: string]: CSSProperties | ((...args: any[]) => CSSProperties);
}
export const createStyle = <T extends StyleDefinition>(map: T): T => map;
