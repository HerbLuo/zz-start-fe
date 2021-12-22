type OpenCursorArgQuery = Parameters<IDBObjectStore["openCursor"]>[0];

const EndSymbol = Symbol("end");

export interface IDBCursorWithValueType<T> extends IDBCursorWithValue {
  value: T;
}

/**
 * 遍历
 */
export async function *cursorQuery<T>(
  store: IDBObjectStore | IDBIndex, 
  ...querys: OpenCursorArgQuery[]
): AsyncIterable<T> {
  yield * cursorQueryWithCallback(store, null, ...querys);
}

/**
 * 遍历并且删除
 */
export async function *cursorQueryAndDelete<T>(
  store: IDBObjectStore | IDBIndex, 
  ...querys: OpenCursorArgQuery[]
): AsyncIterable<T> {
  yield * cursorQueryWithCallback(store, c => c.delete(), ...querys);
}

export async function *cursorQueryWithCallback<T>(
  store: IDBObjectStore | IDBIndex, 
  callback: ((result: IDBCursorWithValueType<T>) => void) | null,
  ...querys: OpenCursorArgQuery[]
): AsyncIterable<T> {
  if (querys.length === 0) {
    querys.push(null);
  }
  for (const query of querys) {
    let end = false;
    let resolve: (r: T | typeof EndSymbol) => void;
    store.openCursor(query).onsuccess = (e) => {
      const cursor: IDBCursorWithValue = (e.target as any).result;
      if (!cursor) {
        end = true;
        return resolve(EndSymbol);
      }
      if (callback) {
        callback(cursor);
      }
      resolve(cursor.value);
      cursor.continue();
    }
    const executor = (r: typeof resolve) => {
      resolve = r;
    }
    while (!end) {
      const result = await new Promise(executor);
      if (result !== EndSymbol) {
        yield result;
      }
    }
  }
}
