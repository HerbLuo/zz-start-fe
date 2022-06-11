// 自动生成的代码块，首行
// 禁止修改 #HASH<705ad5ac26e18d4c2d78ac19f2000480805e62d64f503b220764907e6c65a463>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { get } from "./http";
import { SysSelectOptionRes } from "../types/SysSelectOptionRes";

/** 使用key获取下拉列表 */
async function getByTableLabelValue(table: string, label: string, value: string): Promise<SysSelectOptionRes[]> {
  return await get(`/select-option/table/${table}/label/${label}/value/${value}`);
}

/** 使用key获取下拉列表 */
async function getByKey(key: string): Promise<SysSelectOptionRes[]> {
  return await get(`/select-option/${key}`);
}

export const sysSelectOptionApi = {
  getByTableLabelValue,
  getByKey,
};
// 自动生成的代码块，尾行
