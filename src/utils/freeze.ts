/**
 * JS Doc
 * @description 禁用所有按钮
 * @usage freeze(true); freeze(false);
 * @version 0.0.1
 */
export function freeze(status: boolean) {
  const rootEl = document.body;
  if (status) {
    rootEl.className = rootEl.className + " freeze-all";
  } else {
    rootEl.className = rootEl.className.replace(/ ?freeze-all/g, "");
  }
}
