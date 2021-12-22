import { i18n } from "../i18n/i18n";
import { showWarnAndLog } from "../utils/dialog";
import { TippedError } from "../utils/errors";
import {I18nString} from "../i18n/i18n.core.type";
import disableAutomock = jest.disableAutomock;

export const PostHeaders = {
  "Content-Type": "application/json"
};

function requestBad(url: string, params: any, e: any) {

}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const responseBodyText = await response.text();

  // 解析为JSON
  let responseBodyParsed: unknown;
  try {
    responseBodyParsed = JSON.parse(responseBodyText);
  } catch (e) {
    throw await showWarnAndLog(i18n("解析JSON失败，可能是网络不稳定，尝试刷新。"), e);
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
      throw await showWarnAndLog(i18n("服务器出了点小问题，尝试联系支持人员"), "服务器返回了异常结果(ok=-1)，但异常信息无法解析。", data);
    }
    if (data.alert) {
      throw await showWarnAndLog(data.alert, "[ALERT]服务器返回了一个alert", data);
    }
    throw await showWarnAndLog(i18n("服务器出了点问题，尝试联系支持人员"), "服务器返回了异常", data);
  }

  throw await showWarnAndLog(i18n("服务器出了点小问题，尝试联系支持人员"), "服务器返回了未知的数据", responseBodyParsed)
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
