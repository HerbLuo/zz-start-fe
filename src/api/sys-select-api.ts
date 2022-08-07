// 自动生成的代码块，首行
// 禁止修改 #HASH<4a1a4cba454d9bb481ff95cb40c68cbb844bacc387d7333ba09dc878cc09eba7>HASH#
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
async function saveColumnSettings(body: SysSpUsrTblColEntity[], options?: RequestOptions): Promise<boolean> {
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
  saveColumnSettings,
  getPlan,
  doGet,
};
// 自动生成的代码块，尾行
