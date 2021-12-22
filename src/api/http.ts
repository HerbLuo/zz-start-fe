import { i18n } from "../i18n/i18n";
import { showWarnAndLog } from "../utils/dialog";
import { I18nString } from "../i18n/i18n.core.type";

export const PostHeaders = {
  "Content-Type": "application/json"
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init).catch(async e => {
    throw await showWarnAndLog(i18n("The request failed, possibly due to the network."), e)
  });
  const responseBodyText = await response.text();

  // 解析为JSON
  let responseBodyParsed: unknown;
  try {
    responseBodyParsed = JSON.parse(responseBodyText);
  } catch (e) {
    throw await showWarnAndLog(i18n("Failed to parse JSON, the network may be unstable, try to refresh."), e);
  }

  // 已知的正确返回结果
  if ((responseBodyParsed as { ok: unknown }).ok === 1) {
    const data = (responseBodyParsed as { data: unknown }).data;
    if (data !== undefined) {
      return data as T;
    }
  }

  // 已知的异常返回结果
  if ((responseBodyParsed as { ok: unknown }).ok === -1) {
    const data = (responseBodyParsed as { data: void | { serial: string, code: number, message?: string, alert?: I18nString } }).data;
    if (!data || !data.serial || !data.code) {
      throw await showWarnAndLog(i18n("There is a problem with the server, try to contact support."), "服务器返回了异常结果(ok=-1)，但异常信息无法解析。", data);
    }
    if (data.alert) {
      throw await showWarnAndLog(data.alert, "[ALERT]服务器返回了一个alert", data);
    }
    throw await showWarnAndLog(i18n("Something went wrong with the server, try to contact support."), "服务器返回了异常", data);
  }

  // 返回了未知的JSON数据
  throw await showWarnAndLog(i18n("There is a problem with the server, try to contact support."), "服务器返回了未知的JSON数据", responseBodyParsed);
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
