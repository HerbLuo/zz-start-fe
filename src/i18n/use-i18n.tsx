import { useState, useEffect, useMemo, useRef } from "react";
import { PromiseOr } from "../utils/ts";
import { i18n, I18nMessageKeys, I18nString, Modules } from "./core";

interface UseI18nFn<M extends Modules> {
  (key: I18nMessageKeys[M], ...args: any[]): string;
}

function makeUseI18n<M extends Modules>(module: M): UseI18nFn<M> {
  return function useI18n(key: I18nMessageKeys[M], ...args: any[]): string {
    const argsRef = useRef(args);
    const argsMemo = useMemo(() => {
      if (args.length !== argsRef.current.length) {
        argsRef.current = args;
      }
      const argsOld = argsRef.current;
      for (let i = args.length - 1; i >= 0; i--) {
        if (argsOld[i] !== args[i]) {
          argsRef.current = args;
          break;
        }
      }
      return argsRef.current;
    }, [args]);

    const { guess, exact } = useMemo(() => i18n.module(module)(true, key, ...argsMemo), [key, argsMemo]);
    const [msg, setMsg] = useState<string>(guess || key.replace(/[\s\S]/g, " "));

    useEffect(() => {
      exact.then(m => setMsg(m));
    }, [exact]);

    return msg;
  }
}

interface UseI18n extends UseI18nFn<"global"> {
  module<M extends Modules>(module: M): UseI18nFn<M>;
}

export const useI18n: UseI18n = makeUseI18n("global") as any;
export const useI18nGlobal = useI18n;
useI18n.module = (module) => makeUseI18n(module);

export function I18n(props: { text: PromiseOr<I18nString> }) {
  const propText = props.text;
  const isPromise = typeof propText !== "string";
  const [text, setText] = useState(() => isPromise ? null : propText);

  useEffect(() => {
    if (isPromise) {
      propText.then(t => {
        if (t !== text) {
          setText(t);
        }
      });
    }
  }, [isPromise, text, propText]); 

  return <>{text}</>;
}
