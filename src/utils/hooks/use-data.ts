import { useEffect, useRef, useState } from "react";
import isequal from "lodash.isequal";

export function useData<A extends any[], R>(
  apiFunc: (...args: A) => Promise<R>,
  ...args: A
): [R | undefined, undefined | false | Record<string, unknown>] {
  const [state, setState] = useState<R>();
  const [error, setError] = useState<false | {}>();
  const memoedArgs = useArgs(args);
  useEffect(() => {
    let ignore = false;
    apiFunc(...memoedArgs).then(r => {
      if (!ignore) {
        setState(r);
        setError(false);
      }
    }).catch(e => {
      if (!ignore) {
        setError(e);
      }
    });
    return () => {
      ignore = true;
    };
  }, [apiFunc, memoedArgs]);
  return [state, error];
}

function useArgs<A extends any[]>(args: A): A {
  const argsRef = useRef<A>();
  if (!isequal(argsRef.current, args)) {
    argsRef.current = args;
  }
  return argsRef.current as A;
}

