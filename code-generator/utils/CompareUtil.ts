type Comparator<T = any> = (a: T, b: T) => boolean;

export class CompareUtil<T = any> {
  public static createShallow() {
    return new CompareUtil();
  }
  public static createDeep() {
    throw new Error("暂不支持");
  }
  public static create<T>(comparator: Comparator<T>): CompareUtil<T> {
    const util = new CompareUtil<T>();
    util.comparator = comparator;
    return util;
  }

  private comparator: Comparator<T> = (a, b) => a === b;
  private _onlyContent: boolean = false;
  private _ignoreCount: boolean = true;
  private constructor() { }

  public onlyContent(onlyContent: boolean = true): this {
    this._onlyContent = onlyContent;
    return this;
  }

  public ignoreCount(ignoreCount: boolean = true): this {
    this._ignoreCount = ignoreCount;
    return this;
  }

  private checkNull(a: any, b: any): boolean | null {
    if (a === b) {
      return true;
    }
    if (a === null || a === undefined) {
      return a === b;
    }
    if (b === null || b === undefined) {
      return false;
    }
    return null;
  }

  public compareBean(o1: any, o2: any): boolean {
    const res = this.checkNull(o1, o2);
    if (res !== null) {
      return res;
    }
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const k of keys1) {
      if (!this.comparator(o1[k], o2[k])) {
        return false;
      }
    }
    return true;
  }

  public compareArray(a1: T[], a2: T[]): boolean {
    const res = this.checkNull(a1, a2);
    if (res !== null) {
      return res;
    }

    if (this._onlyContent) {
      for (const it1 of a1) {
        if (this._ignoreCount) {
          const a2Filtered = a2.filter(it2 => !this.comparator(it1, it2));
          if (a2Filtered.length === a2.length) {
            return false;
          }
          a2 = a2Filtered;
        } else {
          const index = a2.findIndex(it2 => this.comparator(it1, it2));
          if (index < 0) {
            return false;
          }
          a2 = [...a2].splice(index, 1);
        }
      }
      if (a2.length > 0) {
        return false;
      }
      return true;
    }

    const a1Length = a1.length;
    if (a1Length !== a2.length) {
      return false;
    }
    for (let i = 0; i < a1Length; i++) {
      if (!this.comparator(a1[i], a2[i])) {
        return false;
      }
    }
    return true;
  }
}
