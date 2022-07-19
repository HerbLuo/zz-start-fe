/**
 * JS Doc
 * @description 自动调整大小的输入框
 * @usage
 * <AutoSizeInput/>
 * @version 0.0.1
 */
import { Input, InputProps, InputRef } from "antd";
import { useMemo, useState, useEffect, useCallback, useRef, forwardRef, ForwardedRef, useLayoutEffect } from "react";
import { displayWidth } from "../string-display-width";

interface Props extends Omit<InputProps, "value"> {
  value: string | null | undefined;
  /** 是否预留文字宽度，如果为否，输入框宽度将始终等于文字宽度。默认为是 */
  gap?: boolean;
  /** 预留文字宽度时，当前文字宽度+fontSize大于当前输入框宽度时，额外增加的宽度 */
  extra?: number;
  minWidth?: number;
  defaultWidth?: number;
  paddings?: number;
  version?: number; // 改变该值可以使该Pure组件重新render
}

export const AutoWidthInput = forwardRef((props: Props, ref: ForwardedRef<InputRef>) => {
  const { 
    extra, 
    minWidth, 
    paddings, 
    style, 
    gap, 
    defaultWidth, 
    value, 
    ...others 
  } = {
    extra: 17,
    minWidth: props.defaultWidth ? 0 : 80,
    paddings: 17,
    ...props,
  };

  const inputRef = useRef<HTMLInputElement | null>();
  const [inputElLoaded, setInputElLoaded] = useState(false);
  const [width, setWidth] = useState(defaultWidth || minWidth);
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
      if (font) {
        setWidth(minWidth);
      }
      return;
    }
    const curWidth = displayWidth(value, font.fontFamily, font.fontSize) | 0;
    const nextWidth = gap ? curWidth + paddings + font.fontSize : curWidth;
    console.log(nextWidth, width);
    if (nextWidth > width) {
      setWidth(gap ? nextWidth + extra : nextWidth);
    }
    if (nextWidth < width - extra) {
      setWidth(Math.max(minWidth, nextWidth));
    }
  }, [minWidth, value, paddings, extra, font, width, gap]);

  console.log(width);
 
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
