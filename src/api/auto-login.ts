import { i18n } from "../i18n/i18n";
import { showWarnAndLog } from "../utils/dialog";
import { siteBasePath } from "../utils/site";

export function goToLoginPage() {
  const forward_to = new URL(window.location.href).searchParams.get("forward_to");
  window.location.href = `${siteBasePath}/login?forward_to=${encodeURIComponent(forward_to || window.location.href)}`;
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
  const response = await fetch(`/account/login/remember-me-token`, { method: "POST" });
  const responseBodyText = await response.text();
  try {
    const parsedJsonResponseBody: unknown = JSON.parse(responseBodyText);
    if ((parsedJsonResponseBody as { ok: unknown }).ok === -1) {
      goToLoginPage();
    }
  } catch (e) {
    throw await showWarnAndLog(i18n("解析JSON失败, 可能是网络不稳定, 尝试刷新。"), e);
  }
}
