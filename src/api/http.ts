import { i18n } from "../i18n/i18n";

export const PostHeaders = {
  "Content-Type": "application/json"
};

function requestBad(url: string, params: any, e: any) {

}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const responseBodyText = await response.text();
  
  let responseBodyParsed;
  try {
    responseBodyParsed = JSON.parse(responseBodyText);
  } catch (e) {
    throw new Error(i18n`解析JSON失败，${e}`)
  }

  try {
    if (response.status === 200) {
      if ((responseBodyParsed as any).ok) {
        const data = responseBodyParsed.data;
        if (data !== undefined) {
          return data;
        }
      }
    }
    requestBad(url, init);
    throw new Error("错误的状态")
  } catch (e) {
    throw requestBad(url, init, e);
  }
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
