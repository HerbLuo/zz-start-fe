/**
 * JS Doc
 * @description 自动调整大小的输入框
 * @usage
 * <AutoSizeInput/>
 * @version 0.0.1
 */
import { Input, InputProps, InputRef } from "antd";
import { useMemo, useState, useEffect, useCallback, useRef, forwardRef, ForwardedRef } from "react";
import { displayWidth } from "./string-display-width";

interface Props extends Omit<InputProps, "value"> {
  value: string | null | undefined;
  extra?: number; // 宽度不足时，额外增加的宽度
  minWidth?: number;
  paddings?: number;
  version?: number; // 改变该值可以使该Pure组件重新render
}

export const AutoSizeInput = forwardRef((props: Props, ref: ForwardedRef<InputRef>) => {
  const { value, extra, minWidth, paddings, style, ...others } = {
    extra: 17,
    minWidth: 80,
    paddings: 17,
    ...props,
  };

  const inputRef = useRef<HTMLInputElement | null>();
  const [inputElLoaded, setInputElLoaded] = useState(false);
  const [width, setWidth] = useState(minWidth);
  const font = useMemo(() => {
    if (!inputElLoaded) {
      return null;
    }
    const inputEl = inputRef.current;
    if (!inputEl) {
      return null;
    }
    const style = window.getComputedStyle(inputEl);
    return {
      fontFamily: style.fontFamily,
      fontSize: Number(style.fontSize.replace("px", "")),
    };
  }, [inputRef, inputElLoaded]);

  useEffect(() => {
    if (!value || !font) {
      setWidth(minWidth);
      return;
    }
    const nextWidth = (displayWidth(value, font.fontFamily, font.fontSize) | 0) + paddings + font.fontSize;
    if (nextWidth > width) {
      setWidth(nextWidth + extra);
    }
    if (nextWidth < width - extra) {
      setWidth(Math.max(minWidth, nextWidth));
    }
  }, [minWidth, value, paddings, extra, font, width]);
 
  const finalStyle: React.CSSProperties = useMemo(() => ({
    width,
    ...style,
  }), [width, style]);

  const inputRefCallback = useCallback((r: InputRef | null) => {
    inputRef.current = r?.input;
    if (typeof ref === "function") {
      ref(r);
    } else if (ref) {
      ref.current = r;
    }
    setInputElLoaded(!!inputRef.current);
  }, [ref]);

  return (
    <Input ref={inputRefCallback} value={value || ""} style={finalStyle} {...others} />
  );
});
