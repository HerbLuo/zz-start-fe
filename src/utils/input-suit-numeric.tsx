/**
 * JS Doc
 * @description 数字输入框
 * @usage
 * <NumericInput defaultValue={123} showAsMoney={true} />
 */
import { Input, InputProps, InputRef } from "antd";
import Big from "big.js";
import { AutoSizeInput } from "./input-suit-auto-size";
import React, { useState, useEffect, useCallback } from "react";
import { useRef } from "react";

interface Props extends Omit<InputProps, "defaultValue" | "value" | "onChange" | "onBlur" | "onPressEnter"> {
  autoWidth?: boolean;
  precision?: number;
  asMoney?: boolean;
  // bigNumber?: false | number; // 暂不支持
  value?: number | undefined | null; // 三选一
  defaultValue?: number | undefined | null; // 三选一
  indicateValue?: number | undefined | null; // 三选一，参考input-suit-with-indicate
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: number | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>, value: number | null) => void;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>, value: number | null) => void;
}

function toMoney(num: string | number): string {
  if (num === undefined || num === null) {
    return "";
  }
  return new Big(num || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}
 
function numToFixedText(
  num: number | null | undefined,
  precision: number | undefined | null,
  showAsMoney: boolean | undefined,
): string {
  if (num === undefined || num === null) {
    return "";
  }
  if (showAsMoney) {
    return toMoney(num);
  } else if (precision) {
    return Number(num).toFixed(precision);
  } else {
    return num.toString();
  }
}

// 1. 删除10000的首位1时，不符合直觉
// 2. 删除逗号时不对
function textToNumber(
  text: string, 
  precision: number, 
  asMoney: boolean, 
  cursorPosition: number = 0
): [string, number | null, number] {
  let newCursorPosition = cursorPosition;
  let stopped = false;
  let n = -1; // 小数点后 第几位, 当n > 0时，表示当前字符 c 在小数点后
  const formattedText = [...text].filter((c, i) => {
    if (c === "-" && i === 0) {
      return true;
    }
    if (stopped) {
      return false;
    }
    if (n >= precision) {
      stopped = true;
      return false;
    }
    if (precision === 0 && c === ".") {
      stopped = true;
      return false;
    }
    if (n === -1 && c === ".") {
      n = 0;
      return true;
    }
    // 非数字不需要
    if (/\D/.test(c)) {
      if (i < cursorPosition) {
        newCursorPosition--;
      }
      return false;
    }
    if (n >= 0) {
      n++;
    }
    return true;
  }).reduce((sum, it) => sum + it, "");

  if (formattedText === ".") {
    newCursorPosition = 2;
  }

  const startWith0 = formattedText.startsWith("0") && cursorPosition === 0;

  const formattedValue = formattedText ? Number(formattedText) : null;
  const textValue = startWith0 
    ? numToFixedText(Number("1" + formattedText), precision, asMoney).substring(1)
    : numToFixedText(formattedValue, precision, asMoney);

  if (formattedValue && asMoney) {
    const numLength = Math.log10(formattedValue);
    const commaAfterCursor = ((numLength - newCursorPosition) / 3) | 0;
    newCursorPosition = newCursorPosition + ((numLength / 3) | 0) - (commaAfterCursor > 0 ? commaAfterCursor : 0);
  }

  newCursorPosition = newCursorPosition < 0 ? 0 : newCursorPosition;

  return [textValue, formattedValue, newCursorPosition];
}

export function NumericInput(props: Props) {
  const {
    autoWidth,
    precision,
    asMoney,
    value: propValue,
    defaultValue,
    indicateValue,
    onChange: propOnChange,
    onBlur: propOnBlur,
    onPressEnter: propOnPressEnter,
    ...others
  } = {
    autoWidth: (props.width || props.style?.width) ? false : true,
    asMoney: false,
    precision: props.asMoney ? 2 : 4,
    ...props
  };
  const fullControlledMode = propValue !== null && propValue !== undefined;

  if (propValue && indicateValue) {
    console.error("不能同时指定value和indicateValue");
  }

  const valueRef = useRef<number | null>();
  const cursorRef = useRef<number | null>();
  const inputRef = useRef<InputRef | null>(null);
  const [version, setVersion] = useState(0);
  const [value, setValue] = useState<string>(
    () => numToFixedText(propValue ?? defaultValue, precision, asMoney)
  );
  const textRef = useRef<string | null>(value);

  useEffect(() => {
    const text = numToFixedText(propValue, precision, asMoney);
    valueRef.current = propValue;
    setValue(() => {
      const value = textRef.current;
      if (value?.startsWith("0") || value?.startsWith(",0")) {
        if (Number(value.replace(/,/g, "")) === propValue) {
          return value;
        }
      }
      return text;
    });
  }, [propValue, precision, asMoney]);

  useEffect(() => {
    const text = numToFixedText(indicateValue, precision, asMoney);
    valueRef.current = indicateValue;
    setValue(text);
  }, [indicateValue, precision, asMoney]);

  const cursor = cursorRef.current;
  useEffect(() => {
    if (cursor !== null && cursor !== undefined) {
      inputRef.current?.setSelectionRange(cursor, cursor);
    }
  }, [value, cursor, version]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (propOnChange) {
      let cursorPosition = e.target.selectionStart ?? undefined;
      let newText = e.target.value;
      if (cursorPosition && textRef.current) {
        const oldChar = textRef.current[cursorPosition];
        if (oldChar === ",") {
          if (textRef.current.length - 1 === newText.length) { // 肯定是删除，不会是粘贴
            newText = newText.substring(0, cursorPosition - 1) + newText.substring(cursorPosition);
            cursorPosition = cursorPosition - 1;
          }
        }
        if (oldChar === ".") {
          if (textRef.current.length - 1 === newText.length) {
            newText = newText.substring(0, cursorPosition) + "." + newText.substring(cursorPosition);
          }
        }
      }
      const [text, number, newCursorPosition] = textToNumber(newText, precision, asMoney, cursorPosition);
      cursorRef.current = newCursorPosition;
      setVersion(version => version + 1);
      valueRef.current = number;
      textRef.current = text;
      if (!fullControlledMode) {
        setValue(text);
      }
      if (propOnChange) {
        propOnChange(e, number);
      }
    } else {
      console.log(e.target.value);
      setValue(e.target.value);
    }
  }, [fullControlledMode, propOnChange, precision, asMoney]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (propOnChange) {
      if (propOnBlur) {
        propOnBlur(e, valueRef.current || null);
      }
    } else {
      const [text, number] = textToNumber(value, precision, asMoney);
      setValue(text);
      if (propOnBlur) {
        propOnBlur(e, number);
      }
    }
  }, [propOnBlur, value, propOnChange, precision, asMoney]);

  const onPressEnter = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (propOnChange) {
      if (propOnPressEnter) {
        propOnPressEnter(e, valueRef.current || null);
      }
    } else {
      const [text, number] = textToNumber(value, precision, asMoney);
      setValue(text);
      if (propOnPressEnter) {
        propOnPressEnter(e, number);
      }
    }
  }, [propOnPressEnter, value, propOnChange, precision, asMoney]);

  if (autoWidth) {
    return (
      <AutoSizeInput
        {...others}
        ref={inputRef}
        minWidth={58}
        extra={12}
        value={value}
        version={version}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    ); 
  } else {
    return (
      <Input
        {...others}
        ref={inputRef}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
      />
    );
  }
}
