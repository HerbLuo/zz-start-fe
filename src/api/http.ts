import { showWarn } from "../utils/dialog";
import { I18nString, i18n } from "../i18n/core";
import { autoLogin, goToLoginPage } from "./auto-login";
import { TokenExpired, HTTP_STATUS_UNAUTHORIZED, TokenWrong } from "./constants";
import { areDebug } from "../utils/env";
import { withCredentials } from "./config";
import { defer, IDefer } from "../utils/defer";
import { javaBeanReviver } from "../utils/json-parse-reviver";
import { delay } from "../utils/delay";
import { _logger } from "../utils/logger";
import { normalRandomEx } from "../utils/random";

const logger = _logger(import.meta.url);

export const PostHeaders = {
  "Content-Type": "application/json"
};

export const defaultInit: RequestInit = {
  credentials: withCredentials ? "include" : undefined,
};

export interface RequestOptions {
  autoLoginByRefreshToken?: boolean;
  alert?: boolean;
}

const textDecoder = new TextDecoder("utf-8");
const autoLoginP = autoLogin();
export async function request<T>(url: string, init?: RequestInit, options: RequestOptions = {}): Promise<T> {
  init = { ...defaultInit, ...init };
  await autoLoginP;

  if (areDebug) {
    const latency = normalRandomEx(300, 12000);
    logger.debug("模拟的网络延时为" + latency + "ms");
    await delay(latency);
  }

  const response = await fetch(url, init).catch(async e => {
    throw await showWarn(i18n("请求失败, 可能是网络原因。"), e)
  });
  let receivedResults: string[] = [];
  let reader: ReadableStreamDefaultReader | null = null;
  let done: boolean = true;
  let responseBodyText: string;
  const isNdJson = response.headers.get("content-type") === "application/x-ndjson";
  if (isNdJson) {
    const stream = response.body;
    if (!stream) {
      throw await showWarn(i18n("application/x-ndjson类型的响应体为空。"));
    }
    reader = stream.getReader();
    const res = await reader.read();
    done = res.done;
    responseBodyText = textDecoder.decode(res.value);
    if (responseBodyText.includes("\n")) {
      [responseBodyText, ...receivedResults] = responseBodyText.split("\n");
    }
  } else {
    responseBodyText = await response.text();
  }

  // 解析为JSON
  const parsedJsonResponseBody = await parseJson(responseBodyText);

  // 已知的正确返回结果
  if ((parsedJsonResponseBody as { ok: unknown }).ok === 1) {
    const data = (parsedJsonResponseBody as { data: unknown }).data;
    if (data !== undefined) {
      if (!isNdJson) {
        return data as T;
      } else {
        return mapPromise(data as {}, reader!, receivedResults, done) as T;
      }
    }
  }

  // const logOrShowWarn = options.alert === false ? logWarn : showWarn;

  // 已知的异常返回结果
  if ((parsedJsonResponseBody as { ok: unknown }).ok === -1) {
    const data = (parsedJsonResponseBody as { data: void | { serial: string, code: number, message?: string, alert?: I18nString } }).data;
    if (!data || !data.serial || !data.code) {
      throw await showWarn(i18n("服务器出了点小问题, 尝试联系支持人员。"), "服务器返回了异常结果(ok=-1)，但异常信息无法解析。", data);
    }
    if (data.alert) {
      if (options.alert) {
        throw await showWarn(data.alert, "[ALERT]服务器返回了一个alert", data);
      } else {
        logger.log("[ALERT]服务器返回了一个alert", data);
        throw data;
      }
    }
    if (data.code === TokenExpired || data.code === TokenWrong) {
      sessionStorage.removeItem("logged_in");
      await autoLogin(true);
      if (options.autoLoginByRefreshToken !== false) {
        return await request(url, init, { autoLoginByRefreshToken: false });
      }
    }
    if (response.status === HTTP_STATUS_UNAUTHORIZED) {
      goToLoginPage();
      throw new Error("需要登陆但未登陆");
    }
    if (options.alert) {
      throw await showWarn(i18n("服务器出了些问题, 尝试联系支持人员。"), "服务器返回了异常", data);
    } else {
      logger.log("服务器返回了异常", data);
      throw data;
    }
  }

  // 返回了未知的JSON数据
  throw await showWarn(i18n("服务器出了点小问题, 尝试联系支持人员。"), "服务器返回了未知的JSON数据", parsedJsonResponseBody);
}

async function parseJson(json: string): Promise<{}> {
  try {
    return JSON.parse(json, javaBeanReviver);
  } catch (e) {
    throw await showWarn(i18n("解析JSON失败, 可能是网络不稳定, 尝试刷新。"), e, "text: ", json);
  }
}

function mapPromisePlaceholder(data: {}, mapper: (id: string) => Promise<any>) {
  return Object.entries(data).map(([k, v]): [string, unknown] => {
    if (v && (v as any)["it's a promise"] === true) {
      return [k, mapper((v as any).id)];
    }
    return [k, v];
  }).reduce((sum, it) => {
    (sum as any)[it[0]] = it[1];
    return sum;
  }, {})
}

function mapPromise(data: {}, reader: ReadableStreamDefaultReader, receivedResults: string[], done: boolean) {
  const defers: Record<string, IDefer<unknown>> = {};
  data = mapPromisePlaceholder(data, id => (defers[id] = defer()).promise);
 
  const handleResult = async (str: string) => {
    str = str.trim();
    if (!str) {
      return
    }
    if (str.includes("\n")) {
      const [first, ...others] = str.split("\n");
      str = first;
      receivedResults.push(...others);
    }
    const json: {ok?: unknown} = await parseJson(str);
    if (json.ok === 1) {
      const data = (json as {data: {id: string, resolved: unknown}}).data;
      if (data.id) {
        defers[data.id]?.resolve(data.resolved);
      }
    }
    if (json.ok === -1) {
      const data = (json as { data: void | { serial: string, code: number, message?: string, alert?: I18nString } }).data;
      if (!data || !data.serial || !data.code) {
        throw await showWarn(i18n("服务器出了点小问题, 尝试联系支持人员。"), "服务器返回了异常结果(ok=-1)，但异常信息无法解析。", data);
      }
      if (data.alert) {
        throw await showWarn(data.alert, "[ALERT]服务器返回了一个alert", data);
      }
      throw await showWarn(i18n("服务器出了些问题, 尝试联系支持人员。"), "服务器返回了异常", data);
    }
  }

  (async function func() {
    for (const str of receivedResults) {
      handleResult(str);
    }

    while(!done) {
      const res = await reader.read();
      done = res.done;
      const str = textDecoder.decode(res.value);
      if (str.includes("\n")) {
        const [first, ...others] = str.split("\n");
        handleResult(first);
        for (const other of others) {
          handleResult(other);
        }
      }
    }
  })();
  return data;
}

export async function get<T>(url: string, options?: RequestOptions, headers?: HeadersInit): Promise<T> {
  return request<T>(url, headers ? { headers } : {}, options);
}

export async function post<T>(url: string, body = {}, options?: RequestOptions, headers?: HeadersInit): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: headers ? {...PostHeaders, ...headers} : PostHeaders,
    method: "POST",
  }, options);
}

export async function patch<T>(url: string, body = {}, options?: RequestOptions, headers?: HeadersInit): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: headers ? {...PostHeaders, ...headers} : PostHeaders,
    method: "PATCH",
  }, options);
}

export async function put<T>(url: string, body = {}, options?: RequestOptions, headers?: HeadersInit): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: headers ? {...PostHeaders, ...headers} : PostHeaders,
    method: "PUT",
  }, options);
}

export async function del<T>(url: string, body = {}, options?: RequestOptions, headers?: HeadersInit): Promise<T> {
  return request<T>(url, {
    body: JSON.stringify(body),
    headers: headers ? {...PostHeaders, ...headers} : PostHeaders,
    method: "DELETE",
  }, options);
}
