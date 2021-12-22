import { LoggedError, TippedError } from "./errors";
import { cursorQueryAndDelete } from "./indexeddb-helper";

export const throttedDuration = 3000;
const callbacks: Array<(log: string) => void> = [];
const throttledCallbacks: Array<(logs: string[]) => void> = [];

enum Level {
  debug = "DEBUG",
  log = "LOG",
  info = "INFO",
  warn = "WARN",
  error = "ERROR",
}

const toString = (obj: unknown): string => {
  if (obj instanceof Array) {
    return JSON.stringify(obj);
  }
  if (obj === undefined || obj === null) {
    return obj + "";
  }
  const nonNullObj = obj as { toString: unknown };
  const str: false | string = nonNullObj.toString instanceof Function && nonNullObj.toString();
  if (!str) {
    return JSON.stringify(obj);
  }
  if (str.startsWith("[object")) {
    return JSON.stringify(obj);
  }
  return str;
}

const log = (level: Level) => (...msgs: any[]) => {
  switch (msgs[0]) {
    case LoggedError:
      return "LoggedError";
    case TippedError:
      return "TippedError";
  }
  const msgStr = `[${level}] ${new Date().toUTCString()} ${msgs.map(msg => {
    if (msg === undefined || msg === null) {
      return msg;
    }
    if (msg instanceof Error) {
      const extra = Object.entries(msg).map(([k, v]) => `${k}: ${toString(v)}`).join("\n ");
      return `${msg.name} ${msg.message}\n -----\n ${extra}\n Stack: ${msg.stack || ""}`
    }
    return toString(msg);
  }).join(", ")}`;

  for (const callback of callbacks) {
    callback(msgStr);
  }
};

export const logger = {
  debug: log(Level.debug),
  log: log(Level.log),
  info: log(Level.info),
  warn: log(Level.warn),
  error: log(Level.error),
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

// 实时输出日志
export function onLog(callback: (log: string) => void) {
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
