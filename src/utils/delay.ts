/**
 * JS Doc
 * @description 延时
 * @usage await delay(100)
 * @version 0.0.1
 */
export function delay(wait: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, wait));
}
