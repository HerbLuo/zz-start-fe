import { useEffect, useRef } from "react";

export function useInit(func: () => void) {
  const funcRef = useRef(func);
  const initRef = useRef(false);
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      funcRef.current();
    }
  }, []);
}
