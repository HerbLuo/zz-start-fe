/**
 * JS Doc
 * @description 预定义一个promise
 * @usage
 * var deferedP = defer();
 * setTimeout(() => {
 *   deferedP.resolve(123);
 * });
 * await defered.promise; 
 * @version 0.0.1
 */
interface IDefer<T> {
  promise: Promise<T>;
  resolve: (d: T) => void;
  reject: (e: any) => void;
}

export function defer<T>(): IDefer<T> {
  let resolve = (d: T) => { throw new Error("init failed"); };
  let reject = resolve;

  return {
    promise: new Promise<T>((res, rej) => {
      resolve = res as any;
      reject = rej as any;
    }),
    resolve(d: T) {
      resolve(d);
    },
    reject(e) {
      reject(e);
    },
  };
}
