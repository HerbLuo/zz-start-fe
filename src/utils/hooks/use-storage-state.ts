import { useState, useCallback, useEffect } from "react";
import { usePrevious } from "./use-previous";

/**
 * useStorageState
 * @param storageKey 
 * @param init 初始值
 * @param upgrade 用于更新版本
 * @returns 
 */
export function useStorageState<T>(
  storageKey: string, 
  init: T, 
  upgrade?: (d: T) => T
): [T, React.Dispatch<T>] {
  const parseFromStorage = useCallback(() => {
    const s = localStorage.getItem(storageKey);
    if (s === null || s === undefined) {
      return init;
    }
    const sd = JSON.parse(s);
    const d = upgrade ? upgrade(sd) : sd;
    if (d !== sd) {
      localStorage.setItem(storageKey, JSON.stringify(d));
    }
    return d;
  }, [storageKey, init, upgrade]);
  const [d, _setD] = useState(parseFromStorage);
  const previousStorageKey = usePrevious(storageKey);
  useEffect(() => {
    if (storageKey !== previousStorageKey) {
      _setD(parseFromStorage());
    }
  }, [storageKey, previousStorageKey, parseFromStorage]);

  const setD = useCallback((d: T) => {
    localStorage.setItem(storageKey, JSON.stringify(d));
    _setD(d);
  }, [_setD, storageKey]);
  return [d, setD];
}
