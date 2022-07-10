import { useEffect, useCallback, useRef, useState } from "react";

/**
 * 输入框增强
 * 
 * 大多数输入框都可以使用以下模式优化
 * 
 * 使用indicateValue 初始化（原先你可能使用defaultValue初始化）
 * -> 用户输入
 * -> onBlur 的时候更新数据
 * -> onBlur 事件里使 indicateValue 改变
 * -> indicateValue 改变时，输入框内容随之变化（重点）
 * 
 * 上述模式带来的好处有：
 * 1. 输入框内容改变时，不会重新渲染父组件(仅在onBlur的时候，会重新渲染父组件)
 * 2. 你可以随时改变indicateValue，要求重置输入框的值
 * 
 * 使用方法：
 * const WivInput = withIndicateValue(Input);
 * 
 * const [value, setValue] = React.useState("default value");
 * React.useEffect(() => {
 *   setTimeout(() => {
 *     setValue("value changed by remote");
 *   }, 3000);
 * }, []);
 * <WivInput
 *   indicateValue={value}
 *   onBlur={setValue}
 * />
 */

type CheckProp<C extends React.ElementType, P> = P extends keyof React.ComponentProps<C> ? C : never;

type EventType<C extends React.ElementType, TRIGGER extends string> = 
  Parameters<React.ComponentProps<C>[TRIGGER]>[0];

type IndicateProps<C extends React.ElementType, VALUE, TRIGGER extends string> = 
  & Omit<React.ComponentPropsWithRef<C>, "value" | "defaultValue" | TRIGGER> 
  & { [K in TRIGGER]: ((event: EventType<C, TRIGGER>, value: VALUE) => void) } 
  & { indicateValue: VALUE };

interface WithIndicateValue {
  <C extends React.ElementType, V, TRIGGER extends string = "onBlur">(
    Component: CheckProp<C, "value"> & CheckProp<C, "onChange">,
    eventToValue?: (e: EventType<C, "onChange">) => V,
    trigger?: TRIGGER,
  ) : <VALUE extends V>(props: IndicateProps<C, VALUE, TRIGGER>) => React.ReactElement;
}

export const withIndicateValue: WithIndicateValue = (
  Component: React.ElementType, 
  eventToValue = (e: any) => e.target.value,
  trigger: string = "onBlur",
) => {
  return function WithIndicateFC({ indicateValue, value: _, onChange, ...others  }: any) {
    const [value, _setValue] = useState(indicateValue);
    const currentValueRef = useRef(value);
    const setValue = useCallback((value: any) => {
      _setValue(value);
      currentValueRef.current = value;
    }, [currentValueRef]);

    useEffect(() => {
      setValue(indicateValue);
    }, [indicateValue, setValue]);

    const handleChange = (e: any) => {
      setValue(eventToValue(e));
      if (onChange) {
        onChange(e);
      }
    };
    let otherProps = others;
    if (others[trigger]) {
      otherProps = {
        ...otherProps,
        [trigger]: (e: any) => {
          const onBlur = others[trigger];
          if (onBlur) {
            onBlur(e, currentValueRef.current);
          }
        }
      }
    }
    return <Component value={value} onChange={handleChange} {...otherProps}/>;
  }
}
