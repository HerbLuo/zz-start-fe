// 自动生成的代码块，首行
// 禁止修改 #HASH<f6e673e667ec7428743f3d55fe9f77788413cb8f68514010d36be00090a70e99>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { post, get, RequestOptions } from "./http";
import { SysSelectDataReq } from "../types/SysSelectDataReq";
import { SysSelectDataRes } from "../types/SysSelectDataRes";
import { SysSelectUserPlanRes } from "../types/SysSelectUserPlanRes";
import { SysSelectRes } from "../types/SysSelectRes";

/** 使用查询方案查询 */
async function getData(body: SysSelectDataReq, options?: RequestOptions): Promise<SysSelectDataRes> {
  return await post(`${basePath}/select/data`, body, options, { Accept: "application/x-ndjson" });
}

/** 获取用户配置的查询方案或默认的查询方案 */
async function getPlan(pageTag: string, options?: RequestOptions): Promise<SysSelectUserPlanRes> {
  return await get(`${basePath}/select/${pageTag}/user-plan`, options);
}

/** 获取默认的查询方案 */
async function doGet(tag: string, options?: RequestOptions): Promise<SysSelectRes> {
  return await get(`${basePath}/select/${tag}`, options);
}

export const sysSelectApi = {
  getData,
  getPlan,
  doGet,
};
// 自动生成的代码块，尾行
