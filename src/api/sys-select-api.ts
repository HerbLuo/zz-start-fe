// 自动生成的代码块，首行
// 禁止修改 #HASH<2e35a34d3a0e8bbf43df18db13ad036b6f14d7794101b8057ce5b118e99199b8>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { post, get, RequestOptions } from "./http";
import { SysSpDataReq } from "../types/SysSpDataReq";
import { SysSpDataRes } from "../types/SysSpDataRes";
import { SysSpUsrTblColEntity } from "../types/SysSpUsrTblColEntity";
import { SysSpUsrPlanRes } from "../types/SysSpUsrPlanRes";
import { SysSpRes } from "../types/SysSpRes";

/** 使用查询方案查询 */
async function getData(body: SysSpDataReq, options?: RequestOptions): Promise<SysSpDataRes> {
  return await post(`${basePath}/select/data`, body, options, { Accept: "application/x-ndjson" });
}

/** 保存用户列配置（排序信息，修改列的显示或隐藏，列宽等） */
async function saveUserColumns(body: SysSpUsrTblColEntity[], options?: RequestOptions): Promise<boolean> {
  return await post(`${basePath}/select/table-columns`, body, options);
}

/** 获取用户配置的查询方案或默认的查询方案 */
async function getPlan(pageTag: string, options?: RequestOptions): Promise<SysSpUsrPlanRes> {
  return await get(`${basePath}/select/${pageTag}/user-plan`, options);
}

/** 获取默认的查询方案 */
async function doGet(tag: string, options?: RequestOptions): Promise<SysSpRes> {
  return await get(`${basePath}/select/${tag}`, options);
}

export const sysSelectApi = {
  getData,
  saveUserColumns,
  getPlan,
  doGet,
};
// 自动生成的代码块，尾行
