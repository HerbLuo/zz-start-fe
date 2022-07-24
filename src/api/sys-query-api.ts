// 自动生成的代码块，首行
// 禁止修改 #HASH<2c0b79256c5c962b782b6d291df7172b998aee803c3fe5e9e33abda0c6721927>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { post, get, RequestOptions } from "./http";
import { SysQueryDataReq } from "../types/SysQueryDataReq";
import { SysQueryDataRes } from "../types/SysQueryDataRes";
import { SysQueryRes } from "../types/SysQueryRes";
import { SysQueryUserPlanRes } from "../types/SysQueryUserPlanRes";

/** 使用查询方案查询 */
async function getData(body: SysQueryDataReq, options?: RequestOptions): Promise<SysQueryDataRes> {
  return await post(`${basePath}/query/data`, body, options, { Accept: "application/x-ndjson" });
}

/** 获取默认的查询方案 */
async function doGet(tag: string, options?: RequestOptions): Promise<SysQueryRes> {
  return await get(`${basePath}/query/${tag}`, options);
}

/** 获取用户配置的查询方案或默认的查询方案 */
async function getPlan(tag: string, options?: RequestOptions): Promise<SysQueryUserPlanRes> {
  return await get(`${basePath}/query/${tag}/user-plan`, options);
}

export const sysQueryApi = {
  getData,
  doGet,
  getPlan,
};
// 自动生成的代码块，尾行
