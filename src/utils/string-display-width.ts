import { wcwidth } from "./string-wcswidth";

type Font = string;
type Char = number;
const fontFamilyMapCharMapDisplayWidth: Record<Font, Record<Char, number>> = {};
const zhChar: number = '中'.codePointAt(0)!!;

/*
 * 1. 对于中日韩等语言，几乎都是等宽的，统一按照“中”计算长度即可
 * 2. 对于欧洲语言，其构成的字符并不多，预计算+缓存即可(英语字符只有26*2种)
 * 3. 对于其他语言，其单词的构成字符，也并不多，可以创建临时span元素获取到其宽度并缓存
 * 4. 对于其他语言，部分字符是上标或下标，其宽度为0，不计算即可
 * 
 * 使用wscwidth库，长度为2的几乎都是中日韩语言，长度为0的不计算长度，其他逐字符计算长度并缓存即可
 */
export const displayWidth = (str: string, fontFamily: string, fontSize: number): number => {
  return [...str].reduce((sum, it) => {
    const char = it.codePointAt(0) || 0;
    const w = wcwidth(char);
    if (w === 2) {
      return sum + charDisplayWidth(fontFamily, zhChar, fontSize);
    } else if (w === 0) {
      return sum;
    } else {
      return sum + charDisplayWidth(fontFamily, char, fontSize);
    }
  }, 0);
}

function charDisplayWidth(fontFamily: string, char: number, fontSize: number): number {
  const charMapDisplayWidth = fontFamilyMapCharMapDisplayWidth[fontFamily] ||= {};
  const displayWidth = charMapDisplayWidth[char];

  if (displayWidth) {
    return displayWidth * fontSize;
  }

  const el = document.createElement("span");
  el.style.fontFamily = fontFamily;
  el.style.fontSize = `${fontSize}px`;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.appendChild(el);
  el.innerText = String.fromCodePoint(char);
  const width = el.getBoundingClientRect().width;
  document.body.removeChild(el);

  charMapDisplayWidth[char] = width / fontSize;

  return width;
}
