export function nextInt(len: number = 3): number {
  return Math.floor(Math.random() * (10 ** len));
}

export function nextStr(len: number = 3, upperCase: Boolean = true): string {
  const hex10 = (Math.random() * (36 ** len + 1));
  const hex36 = Number(hex10.toFixed(0)).toString(36).padStart(len, "0");
  return upperCase ? hex36.toUpperCase() : hex36;
}

export function nextGoodStr(len: number = 3, upperCase: Boolean = true): string {
  return nextStr(len, upperCase).replace(BAD_STR_REG, "8");
}

/**
 * 一种正态分布
 */
export function normalRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5;
  if (num > 1 || num < 0) {
    return normalRandom();
  }
  return num;
}

export function nextId(len: number = 16, ...withSymbols: string[]): string {
  const loopTimes = Math.ceil(len / 4);
  return new Array(loopTimes).fill(null).map(() => ss4(...withSymbols)).join("").substring(0, len);
}

function ss4(...withSymbols: string[]): string {
  const randomNum = Math.floor(((Math.random() + 1) * ((CHARSET62.length + withSymbols.length) ** 4 - 1)));
  return baseXXEncodeReversed(randomNum, ...withSymbols).reverse().join("");
}

export function base64Encode(num: number): String {
  return baseXXEncodeReversed(num, "_", "-").reverse().join("");
}

/**
 * 给Int进行 baseXX编码
 * XX = 62 + withSymbols.size
 */
function baseXXEncodeReversed(num: number, ...withSymbols: string[]): string[] {
  if (num === 0) {
    return [CHARSET62[0]];
  }

  const charset62len = CHARSET62.length;
  const otherSymbolsLen = withSymbols.length;
  const totalLen = charset62len + otherSymbolsLen;

  let remainder = num;
  const chars: string[] = [];
  while (remainder > 0) {
    const index = Math.floor(remainder % totalLen);
    if (index < charset62len) {
      chars.push(CHARSET62[index]);
    } else {
      chars.push(withSymbols[index - charset62len]);
    }
    remainder = Math.floor(remainder / totalLen);
  }
  return chars;
}

const BAD_STR_REG = /IlO04/g;
const CHARSET62 = [...("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" as string)];
