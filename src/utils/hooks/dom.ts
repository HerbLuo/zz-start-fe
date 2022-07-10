import { useState, useCallback } from "react";

export function useInput<T>(): [T | undefined, React.ChangeEventHandler<{ value: T }>] {
  const [state, setState] = useState<T>();
  const handler: React.ChangeEventHandler<{ value: T }> = useCallback((e) => {
    setState(e.target.value);
  }, []);
  return [state, handler];
}
