import { i18n } from "../i18n/core";
import { delay } from "../utils/delay";
import { showConfirm, showWarn } from "../utils/dialog";
import { siteBasePath } from "../utils/site";
import { basePath, withCredentials } from "./config";

export function goToLoginPage() {
  const forwardTo = new URL(window.location.href).searchParams.get("forward_to");
  Promise.race([
    showConfirm(i18n("登陆失败，{}秒后自动跳转", 5)),
    delay(5000),
  ]).then(() => {
    const encodeUrl = encodeURIComponent(forwardTo || window.location.href);
    window.location.href = `${siteBasePath}/login?forward_to=${encodeUrl}`;
  });
}

export async function autoLogin(requireLogin: boolean = false) { 
  if (sessionStorage.getItem("logged_in") === "yes") {
    return;
  };
  if (window.location.pathname === `${siteBasePath}/login`) {
    return;
  }
  if (localStorage.getItem("remember_me") !== "yes") {
    if (requireLogin) {
      goToLoginPage();
    }
    return;
  } 
  const response = await fetch(`${basePath}/account/login/remember-me-token`, { 
    method: "POST",
    credentials: withCredentials ? "include" : undefined,
  });
  const responseBodyText = await response.text();
  try {
    const parsedJsonResponseBody: unknown = JSON.parse(responseBodyText);
    if ((parsedJsonResponseBody as { ok: unknown }).ok === -1) {
      goToLoginPage();
    }
  } catch (e) {
    throw await showWarn(i18n("解析JSON失败, 可能是网络不稳定, 尝试刷新。"), e);
  }
}
