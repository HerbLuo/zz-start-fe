export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type TypedKey<O, T> = Exclude<{
  [K in keyof O]: T extends O[K] ? K : never;
}[keyof O], undefined>;

export type PromiseOr<T> = T | Promise<T>;

export type ArrayOr<T> = T | T[];

export type PromiseResolveType<T> = T extends Promise<infer R> ? R : never;

export type Pair<P, Q> = [P, Q];

export type UnionToIntersection<U> = 
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;

export type Promised<O, K extends keyof O> = Omit<O, K> & {
  [key in K]: PromiseOr<O[K]>;
}
