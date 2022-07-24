import { isValidElement } from "react";
import { delay } from "./delay";
import { LoggedError, TippedError } from "./errors";
import { cursorQueryAndDelete } from "./indexeddb-helper";
import { nextId } from "./random";

type OnLog = (log: string, level: Level) => void;
export const throttedDuration = 3000;
const callbacks: OnLog[] = [];
const throttledCallbacks: Array<(logs: string[]) => void> = [];

enum Level {
  debug = "debug",
  log = "log",
  info = "info",
  warn = "warn",
  error = "error",
}

type Log = (...args: any[]) => void;
type Logger = { debug: Log; log: Log; info: Log; warn: Log; error: Log; }
type LoggerEx = Logger & { await: Logger, args: Logger };
export const _logger = (sourceCodeUrl?: string): LoggerEx => {
  const logger: LoggerEx = {
    args: {},
    await: {},
  } as any;

  const create = (logger: Logger, url?: string, opt?: CreateLoggerOptions) => 
    Object.values(Level).forEach(level => {
      logger[level] = createLogger(level, url, opt);
    });

  create(logger, sourceCodeUrl);
  create(logger.await, sourceCodeUrl, { awaitMode: true });
  create(logger.args, sourceCodeUrl, { awaitMode: true, argsMode: true });
    
  return logger;
};

export const logger: LoggerEx = _logger();

function formatDate(d: Date) {
  const to2 = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${to2(d.getMonth() + 1)}-${to2(d.getDate())} ${
    to2(d.getHours())}:${to2(d.getMinutes())}:${to2(d.getSeconds())}`;
}

function hasToStringFunc(obj: unknown): obj is { toString(): string } {
  return (obj as any)?.toString instanceof Function;
};

type GuessString = { 
  guess: string, 
  promise: Promise<string>, 
  value: Promise<string>,
};
const BeanProp = Reflect.getPrototypeOf({});
function toLogMsg(obj: unknown, level: number = 0): string | GuessString {
  if (level > 32) {
    return "this object might be cycle reference.";
  }
  if (obj === undefined || obj === null) {
    return obj + "";
  }
  if (obj instanceof Set) {
    obj = [...obj];
  }
  if (obj instanceof Array) {
    return `[${obj.map(o => toLogMsg(o, level + 1)).join(",")}]`;
  }
  if (obj instanceof Date) {
    return formatDate(obj);
  }
  if (obj instanceof WeakMap || obj instanceof WeakSet) {
    return obj.toString();
  }
  if (obj instanceof Error) {
    const extra = Object.entries(obj)
      .map(([k, v]) => `${k}: ${toLogMsg(v, level + 1)}`)
      .join("\n ");
    const { name, message, stack } = obj;
    return `${name} ${message}\n -----\n ${extra}\n Stack: ${stack || ""}`
  }
  if (obj instanceof Promise) {
    const pid = nextId();
    const value = obj
      .catch(e => Promise.reject(toLogMsg(e, level + 1)))
      .then(res => toLogMsg(res, level + 1) + "");
    return {
      guess: `Promise<${pid}>, resolving...`,
      promise: value
        .catch(e => Promise.reject(`Promise<${pid}>, rejected: ${e}`))
        .then(res => `Promise<${pid}>, resolved: ${res}`),
      value: value.then(r => `Promise<${r}>`),
    };
  }
  if (typeof obj === "object" && isValidElement(obj)) {
    return `react element: ${obj.type}, props: ${JSON.stringify(obj.props)}.`;
  }
  if (!hasToStringFunc(obj)) {
    return JSON.stringify(obj);
  }
  if (obj instanceof Map) {
    // obj.entries()
  }
  const str = obj.toString(); 
  if (str === "[object Object]") {
    const entries = Object.entries(obj);
    const msgs = entries.map(([k, v]) => [k, toLogMsg(v, level + 1)] as const);
    const hasGuess = msgs.find(([k, v]) => typeof v !== "string");
    if (hasGuess) {
      const pid = nextId();
      const guessMsgs = msgs
        .map(([k, v]) => `${k}: ${typeof v === "string" ? v : "Promise"}`)
        .join(", ");
      const promiseMsgs = Promise.all(msgs.map(async ([k, v]) => 
        `${k}: ${typeof v === "string" ? v : await v.value}`
      )).then(msgs => msgs.join(", "));
      const promiseMsgsWithTimeout = Promise.race([promiseMsgs, delay(60 * 1000)]);

      return {
        guess: `Object: Promise<${pid}>, resolving: {${guessMsgs}}`,
        promise: promiseMsgsWithTimeout
          .catch(e => Promise.reject(
            `Object: Promise<${pid}>, rejected. ${e}`
          ))
          .then(res => `Object: Promise<${pid}>, resolved: {${res}}`),
        value: promiseMsgsWithTimeout.then(v => `Object: {${v}}`),
      }
    } else {
      const isBean = Reflect.getPrototypeOf(obj) === BeanProp;
      return `${isBean ? "" : "Object: "}{${msgs.map(([k, v]) => `${k}: ${v}`).join(", ")}}`;
    }
  }
  return str;
}

interface CreateLoggerOptions {
  awaitMode?: boolean; 
  argsMode?: boolean;
}
function createLogger(
  level: Level, 
  sourceCodeUrl?: string, 
  { awaitMode, argsMode }: CreateLoggerOptions = {}
): Log {
  const module = sourceCodeUrl?.split("/src/").pop()?.replace(/\//g, ".");

  return function log(...msgs: any[]) {
    switch (msgs[0]) {
      case LoggedError:
        return "LoggedError";
      case TippedError:
        return "TippedError";
    }
    const DATE = formatDate(new Date());
    const LEVEL = level.toUpperCase().padEnd(5, " ");
    const module32LenMax = module
      ? module.length > 32
        ? "..." + module.substring(module.length - 29, module.length)
        : module
      : "";
    const MODULE = module32LenMax.padStart(32, " ");

    const logMsgs = (MSGS: string) => {
      const msgStr = `${DATE} ${LEVEL} ${MODULE} - ${MSGS}`;

      if (callbacks.length <= 1) {
        console.warn(
          "please use `onLog` to register log receiver," + 
          "e.g. `onLog((s, l) => console[l](s));`."
        );
        colorfulConsole(msgStr, level);
      } else {
        for (const callback of callbacks) {
          callback(msgStr, level);
        }
      }
    };

    if (argsMode) {
      const [first, ...others] = msgs;
      if (first instanceof Function) {
        msgs = ["NAME", first.name, ...others];
      } else if (msgs.length === 2 && typeof msgs[0] === "string") {
        msgs = ["NAME", msgs[0], msgs[1]];
      } 
      const args = msgs.pop();
      msgs.push("ARGUMENTS");
      msgs.push(args);
    }
    const withGuessMSGS = msgs.map(m => toLogMsg(m));
    const hasGuess = withGuessMSGS.find(it => typeof it !== "string");
    if (hasGuess) {
      if (awaitMode) {
        const msgsP = Promise.all(withGuessMSGS.map(
          async m => typeof m === "string" ? m : await m.value
        )).then(msgs => msgs.join(" "));
        msgsP.catch(e => logMsgs(e));
        msgsP.then(logMsgs);
      } else {
        const guessMsgs = withGuessMSGS
          .map(m => typeof m === "string" ? m : m.guess)
          .join(" ");
        logMsgs(guessMsgs);
        for (const withGuessMsg of withGuessMSGS) {
          if (typeof withGuessMsg === "string") {
            continue;
          }
          withGuessMsg.promise.catch(logMsgs);
          withGuessMsg.promise.then(logMsgs);
        }
      }
    } else {
      logMsgs(withGuessMSGS.join(" "));
    }
  };
};

interface LogData {
  session: string;
  data: string;
}

// 每次启动都需要将日志放置于indexedDB的不同 store中
const sessionTime = Date.now();

// 日志数据的indexedDB对象
let db: IDBDatabase | undefined = undefined;
async function initDb() {
  if (!db) {
    const request = indexedDB.open("logger", 1);
    await new Promise<void>((resolve, reject) => {
      request.onupgradeneeded = e => {
        db = (e.target as any).result;
        const store = db!.createObjectStore("logs", { autoIncrement: true });
        store.createIndex("session", "session", { unique: false });
        resolve();
      };
      request.onsuccess = (e) => {
        db = (e.target as any).result;
        resolve();
      };
      request.onerror = (e) => {
        reject();
      }
    });
  }
  const nonNullDb = db!;
  return {
    get logsStore() {
      return nonNullDb.transaction("logs", "readwrite").objectStore("logs");
    },
    db: nonNullDb,
  };
}

export function colorfulConsole(msg: string, level: Level) {
  // "", '', ``
  msg = msg.replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, "%CsS%(color: green)$1%CsS%()");
  // true false
  msg = msg.replace(/(true|false)([^a-zA-Z_]|$)/g, "%CsS%(color: blue)$1%CsS%()$2"); 
  // TS, TSX, JS, JSX
  msg = msg.replace(
    /([a-zA-Z._$-]+\.[tj]sx?)([ \]>}])/g, 
    "%CsS%(color: mediumslateblue)$1%CsS%()$2"
  ); 

  msg = msg.replace(
    /(NAME) /g,
    "%CsS%(color: mediumslateblue)$1 %CsS%()"
  );

  msg = msg.replace(
    /(ARGUMENTS) /g,
    "%CsS%(color: mediumslateblue)$1 %CsS%()"
  );

  // DATE TIME
  const times: string[] = [];
  msg = msg.replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, ($0) => {
    times.push(`%CsS%(color: gray)${$0}%CsS%()`);
    return "%TiME%";
  });
  // NUMBER
  msg = msg.replace(/(?<![a-zA-Z\d_$])(-?\d+(\.\d+)?)(?![a-zA-Z\d_$])/g, "%CsS%(color: blue)$1%CsS%()");
  let i = 0;
  msg = msg.replace(/%TiME%/g, () => times[i++]);

  // LEVEL
  for (const l of Object.values(Level)) {
    const css = "color: #555; background: " + ({
      "debug": "lightgreen",
      "log": "lightblue",
      "info": "lightblue",
      "warn": "lightsalmon",
      "error": "lightcoral",
    })[l];
    const upperCaseL = l.toUpperCase(); 
    msg = msg.replace(
      new RegExp(`^${upperCaseL} |( )${upperCaseL} `), 
      `$1%CsS%(${css})${upperCaseL}%CsS%() `
    );
  }

  const args: string[] = [];
  msg = msg.replace(/%CsS%\(([^)]*)\)/g, ($0, $1) => {
    args.push($1 || "");
    return `%c`;
  }); 
  console.log(msg, ...args);
}

// 实时输出日志
export function onLog(callback: OnLog) { 
  callbacks.push(callback);
}
export function removeOnLog(callback: any) {
  const index = callbacks.indexOf(callback);
  callbacks.splice(index, 1);
}
// 每隔一段时间发送一组日志，可以使用http请求将其保存至服务器
export function onLogThrottled(callbacks: (logs: string[]) => void) {
  throttledCallbacks.push(callbacks);
}

// 将数据存放至indexedDB中
// 为何？这是为了在用户重新打开界面时，将上次产生的日志发送到服务端
async function main() {
  // db 初始化完毕之前的日志临时存放在这里
  const logsBeforeInitted: string[] = [];
  const onLogBeforeInittedCallback = (log: string) => {
    logsBeforeInitted.push(log);
  }
  onLog(onLogBeforeInittedCallback);
  const db = await initDb();
  // 初始化完毕，开始实时接收并处理日志
  onLog(log => {
    db.logsStore.add({session: sessionTime, data: log});
  });
  // 移出临时日志回调并保存临时日志
  removeOnLog(onLogBeforeInittedCallback);
  for (const log of logsBeforeInitted) {
    db.logsStore.add({session: sessionTime, data: log});
  }
  if (throttledCallbacks.length > 0) {
    // 开始节流回调
    setInterval(async () => {
      const iter = cursorQueryAndDelete<LogData>(db.logsStore);
      const data: string[] = [];
      for await (const it of iter) {
        data.push(it.data);
      }
      for (const callback of throttledCallbacks) {
        callback(data);
      }
    }, throttedDuration);
  } 
}
// 执行主逻辑（将日志信息存放于indexedDB中），注意必须将这里的异常捕获，不然有无限递归的风险
main().catch(console.error);

window.addEventListener("error", e => {
  logger.error(e.error);
});
window.addEventListener("unhandledrejection", e => {
  logger.warn(e.reason);
});

// 将上次访问未发送的日志发送并清空
setTimeout(async () => {
  if (!throttledCallbacks.length) {
    return;
  }
  const db = await initDb();
  const store = db.logsStore.index("session");
  const rangeA = IDBKeyRange.upperBound(sessionTime, true);
  const rangeB = IDBKeyRange.lowerBound(sessionTime, true);
  const resultIter = cursorQueryAndDelete<LogData>(store, rangeA, rangeB);
  const logs: string[] = [];
  for await (const val of resultIter) {
    logs.push(val.data);
  }
   
  for (const callback of throttledCallbacks) {
    callback(logs);
  }
}, 1000);
