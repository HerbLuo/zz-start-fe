export class TsType {
  public static ANY = "any";

  constructor(public readonly type: string, public readonly deps: readonly string[] = []) {}

  public mapType(fn: (type: string) => string): TsType {
    return new TsType(fn(this.type), this.deps);
  }
}

export const UnknownTsType = new TsType("unknown");
