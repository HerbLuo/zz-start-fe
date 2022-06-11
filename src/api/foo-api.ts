// 自动生成的代码块，首行
// 禁止修改 #HASH<13fc6870225d9d8f87d057f9c7a2daf3f54f7027ef98ddf782aabf52c282c7eb>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { put, post, patch, get, del } from "./http";
import { Foo } from "../types/Foo";

/** put */
async function doPut(body: Foo): Promise<boolean> {
  return await put(`/foo/`, body);
}

/** save */
async function save(body: Foo): Promise<Foo> {
  return await post(`/foo/`, body);
}

/** patch */
async function doPatch(body: Foo): Promise<boolean> {
  return await patch(`/foo/`, body);
}

/** postByForm */
async function postByForm(b: boolean, bc: number, d: number, date: Date, date2_date: number, date2_day: number, date2_hours: number, date2_minutes: number, date2_month: number, date2_nanos: number, date2_seconds: number, date2_time: number, date2_timezoneOffset: number, date2_year: number, date3_hour: number, date3_minute: number, date3_nano: number, date3_second: number, date4: Date, f: number, i: number, l: string[], l2: number[], l3: unknown[], m3: unknown, re_password: string, re_rememberMe: boolean, re_username: string, res_0__password: string, res_0__rememberMe: boolean, res_0__username: string, s: string, timestamps_0__date: number, timestamps_0__day: number, timestamps_0__hours: number, timestamps_0__minutes: number, timestamps_0__month: number, timestamps_0__nanos: number, timestamps_0__seconds: number, timestamps_0__time: number, timestamps_0__timezoneOffset: number, timestamps_0__year: number): Promise<Foo> {
  return await post(`/foo/form/`);
}

/** postAsMapForm */
async function postAsMapForm(foo: unknown): Promise<unknown> {
  return await post(`/foo/map-form/`);
}

/** postAsMap */
async function postAsMap(): Promise<Record<string, Foo>> {
  return await post(`/foo/map/`);
}

/** postMul */
async function postMul(): Promise<Foo[]> {
  return await post(`/foo/mul/`);
}

/** postAll */
async function postAll(str1: string, long1: number, longs1: number[], body: Foo): Promise<Record<string, Foo>> {
  return await post(`/foo/str1/${str1}/long1/${long1}/longs1/${longs1}`, body);
}

/** get */
async function doGet(id: number): Promise<Foo> {
  return await get(`/foo/${id}/`);
}

/** del */
async function doDel(id: number): Promise<boolean> {
  return await del(`/foo/${id}/`);
}

export const fooApi = {
  doPut,
  save,
  doPatch,
  postByForm,
  postAsMapForm,
  postAsMap,
  postMul,
  postAll,
  doGet,
  doDel,
};
// 自动生成的代码块，尾行
