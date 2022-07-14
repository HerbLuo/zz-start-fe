import { showWarn } from "../utils/dialog";
import { I18nString, i18n } from "../i18n/core";
import { autoLogin, goToLoginPage } from "./auto-login";
import { TokenExpired, HTTP_STATUS_UNAUTHORIZED } from "./constants";
import { delay } from "../utils/delay";

export const PostHeaders = {
  "Content-Type": "application/json"
};

export interface RequestOptions {
  autoLoginByRefreshToken?: boolean;
}

const autoLoginP = autoLogin();
export async function request<T>(url: string, init?: RequestInit, options: RequestOptions = {}): Promise<T> {
  await autoLoginP;

  await delay(1000);

  const response = await fetch(url, init).catch(async e => {
    throw await showWarn(i18n("服务器出了些问题, 尝试联系支持人员。"), e)
  });
  const responseBodyText = await response.text();

  // 解析为JSON
  let parsedJsonResponseBody: {};
  try {
    parsedJsonResponseBody = JSON.parse(responseBodyText);
  } catch (e) {
    throw await showWarn(i18n("解析JSON失败, 可能是网络不稳定, 尝试刷新。"), e);
  }

  // 已知的正确返回结果
  if ((parsedJsonResponseBody as { ok: unknown }).ok === 1) {
    const data = (parsedJsonResponseBody as { data: unknown }).data;
    if (data !== undefined) {
      return data as T;
    }
  }

  // 已知的异常返回结果
  if ((parsedJsonResponseBody as { ok: unknown }).ok === -1) {
    const data = (parsedJsonResponseBody as { data: void | { serial: string, code: number, message?: string, alert?: I18nString } }).data;
    if (!data || !data.serial || !data.code) {
      throw await showWarn(i18n("服务器出了点小问题, 尝试联系支持人员。"), "服务器返回了异常结果(ok=-1)，但异常信息无法解析。", data);
    }
    if (data.alert) {
      throw await showWarn(data.alert, "[ALERT]服务器返回了一个alert", data);
    }
    if (data.code === TokenExpired) {
      await autoLogin(true);
      if (options.autoLoginByRefreshToken !== false) {
        return await request(url, init, { autoLoginByRefreshToken: false });
      }
    }
    if (response.status === HTTP_STATUS_UNAUTHORIZED) {
      goToLoginPage();
      throw new Error("需要登陆但未登陆");
    }
    throw await showWarn(i18n("服务器出了些问题, 尝试联系支持人员。"), "服务器返回了异常", data);
  }

  // 返回了未知的JSON数据
  throw await showWarn(i18n("服务器出了点小问题, 尝试联系支持人员。"), "服务器返回了未知的JSON数据", parsedJsonResponseBody);
}

export async function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

export async function post<T>(url: string, body = {}): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: PostHeaders,
    method: "POST",
  });
}

export async function patch<T>(url: string, body = {}): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: PostHeaders,
    method: "PATCH",
  });
}

export async function put<T>(url: string, body = {}): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: PostHeaders,
    method: "PUT",
  });
}

export async function del<T>(url: string, body = {}): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: PostHeaders,
    method: "DELETE",
  });
}
