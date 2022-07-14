/**
 * JS Doc 
 * @description is 工具包
 * 包含 isArray isPromise isString isNumber isNaN
 */
export function isArray<T>(obj: any): obj is T[] {
  return obj instanceof Array;
}

export function isPromise<T>(obj: any): obj is Promise<T> {
  return obj && obj.then && obj.catch;
}

export function isString(obj: any): obj is string {
  return typeof obj === "string";
}

export function isNumber(obj: any): obj is number {
  return typeof obj === "number";
}

export function isNaN(obj: any): boolean {
  // eslint-disable-next-line no-self-compare
  return obj !== obj;
}

export function isNullOrUndefined(obj: any): obj is null | undefined {
  return obj === null || obj === undefined;
}

export function isObject(value: any): value is {} {
  return value !== null && typeof value === 'object'
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === "function";
}
