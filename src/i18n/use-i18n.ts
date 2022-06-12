import { useState, useEffect, useMemo, useRef } from "react";
import { i18n } from "./i18n";
import { I18nMessages } from "./core-type";

export function useI18n(key: I18nMessages, ...args: any[]): string {
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

  const i18nMsg = useMemo(() => i18n(key, ...argsMemo), [key, argsMemo]);
  const [msg, setMsg] = useState<string>(typeof i18nMsg === "string" ? i18nMsg : key.replace(/[\s\S]/g, " "));

  useEffect(() => {
    if (typeof i18nMsg === "string") {
      setMsg(i18nMsg);
    } else {
      i18nMsg.then(k => setMsg(k));
    }
  }, [i18nMsg]);

  return msg;
}
