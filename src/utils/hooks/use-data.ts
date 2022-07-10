import { useEffect, useRef, useState } from "react";
import { areEqual } from "../array";

export function useData<A extends any[], R>(
  apiFunc: (...args: A) => Promise<R>,
  ...args: A
): R | undefined {
  const [state, setState] = useState<R>();
  const memoedArgs = useArgs(args);
  useEffect(() => {
    let ignore = false;
    apiFunc(...memoedArgs).then(r => {
      if (!ignore) {
        setState(r);
      }
    });
    return () => {
      ignore = true;
    };
  }, [apiFunc, memoedArgs]);
  return state;
}

function useArgs<A extends any[]>(args: A): A {
  const argsRef = useRef<A>();
  if (!areEqual(argsRef.current, args)) {
    argsRef.current = args;
  }
  return argsRef.current as A;
}

