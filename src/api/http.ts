
export const PostHeaders = {
  "Content-Type": "application/json"
};

function requestBad(url: string, params: any) {

}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  try {
    const responseBodyText = await response.text();
    const responseBodyParsed = JSON.parse(responseBodyText);
    if (response.status === 200) {
      if ((responseBodyParsed as any).success) {
        const data = responseBodyParsed.data;
        if (data !== undefined) {
          return data;
        }
      }
    }
    requestBad(url, init);
    throw new Error("错误的状态")
  } catch (e) {
    requestBad(url, init);
    throw e;
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
