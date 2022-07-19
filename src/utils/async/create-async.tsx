/**
 * JS Doc
 * @description React异步套件
 * 对某个React组件的部分属性，增加其对异步的支持
 * @usage 
 * var AsyncInput = createAsync(Input, ["value", "disabled"])
 * <AsyncInput value={Promise.resolve("loaded")} disabled={Promise.resolve(true)}/>
 * @version 0.0.1
 */
import { ComponentPropsWithRef, ElementType, FC, useEffect, useMemo, useRef, useState } from "react"
import { areEqual } from "../array";
import { Promised } from "../ts";

type ReactNodeOrArray = React.ReactNode | React.ReactNode[];

export const Loading = Symbol();
const Error = Symbol();

type EleType = ElementType;
type PropsWithRef<T extends ElementType> = ComponentPropsWithRef<T>;

type DefaultAsyncProps<C extends EleType, K extends keyof PropsWithRef<C>> = 
  { [P in K]?: typeof Loading | PropsWithRef<C>[K] };

type SyncedProps<C extends EleType> = Partial<PropsWithRef<C>>

type CreateAsyncOptions<C extends EleType, K extends keyof PropsWithRef<C>> = {
  default?: DefaultAsyncProps<C, K>;
  loading?: ReactNodeOrArray;
}

interface CreateAsync {
  <C extends ElementType, K extends keyof PropsWithRef<C>>(
    Component: C, 
    keys: K[], 
    options?: CreateAsyncOptions<C, K>
  ): FC<Promised<PropsWithRef<C>, K>>;
}

export const createAsync: CreateAsync = 
<C extends ElementType, K extends keyof PropsWithRef<C>>(
  Component: C, 
  keys: K[], 
  options: CreateAsyncOptions<C, K> = {}
) => {
  return function AsyncWrapper(props: Promised<PropsWithRef<C>, K>) {
    const [syncedProps, setSyncedProps] = useState<SyncedProps<C>>(() => {
      const sp: SyncedProps<C> = {};
      const defAsyncProps = options.default || {} as DefaultAsyncProps<C, K>;
      const entries = Object.entries(defAsyncProps) as 
        [K, typeof Loading | PropsWithRef<C>[K]][];
      for (const [key, value] of entries) {
        sp[key] = value === Loading ? undefined : value;
      }
      return sp;
    });

    const memoedKeys = useArgs(keys);
    useEffect(() => {
      let ignore = false;
      for (const key of memoedKeys) {
        const promised = props[key];
        // eslint-disable-next-line
        Promise.resolve(promised).then(value => {
          if (!ignore) {
            setSyncedProps(props => ({
              ...props,
              [key]: value,
            }));
          }
        }).catch(() => {
          console.log(Error);
        });
      }
      return () => {
        ignore = true;
      };
    }, [props, memoedKeys]);

    const normalProps = useMemo<Partial<PropsWithRef<C>>>(() => {
      const np: Partial<PropsWithRef<C>> = {};
      const keyOfProps = Object.keys(props) as K[];
      for (const key of keyOfProps) {
        if (!memoedKeys.includes(key)) {
          np[key] = props[key];
        }
      }
      return np as any;
    }, [props, memoedKeys]);

    const componentPropsPart: Partial<PropsWithRef<C>> = {
      ...normalProps, 
      ...syncedProps
    };
    const componentProps = componentPropsPart as PropsWithRef<C>;
    return <Component  {...componentProps}/>
  };
};

function useArgs<A extends any[]>(args: A): A {
  const argsRef = useRef<A>();
  if (!areEqual(argsRef.current, args)) {
    argsRef.current = args;
  }
  return argsRef.current as A;
}
