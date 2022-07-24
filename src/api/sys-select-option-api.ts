// 自动生成的代码块，首行
// 禁止修改 #HASH<8ac04d1519716056c616f266f93c8fda889f275967aa387b3aa4725b331c4a78>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { get, RequestOptions } from "./http";
import { SysSelectOptionRes } from "../types/SysSelectOptionRes";

/** 使用key获取下拉列表 */
async function getByTableLabelValue(table: string, label: string, value: string, options?: RequestOptions): Promise<SysSelectOptionRes[]> {
  return await get(`${basePath}/select-option/table/${table}/label/${label}/value/${value}`, options);
}

/** 使用key获取下拉列表 */
async function getByKey(key: string, options?: RequestOptions): Promise<SysSelectOptionRes[]> {
  return await get(`${basePath}/select-option/${key}`, options);
}

export const sysSelectOptionApi = {
  getByTableLabelValue,
  getByKey,
};
// 自动生成的代码块，尾行
