// 自动生成的代码块，首行
// 禁止修改 #HASH<b49c5231f79720b8fb2bd491f87f26059268ef12ed96dcb4196df58f8fb4b18c>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { basePath } from "./config";
import { post, get } from "./http";
import { SysQueryDataReq } from "../types/SysQueryDataReq";
import { SysQueryDataRes } from "../types/SysQueryDataRes";
import { SysQueryRes } from "../types/SysQueryRes";
import { SysQueryUserPlanRes } from "../types/SysQueryUserPlanRes";

/** 使用查询方案查询 */
async function getData(body: SysQueryDataReq): Promise<SysQueryDataRes> {
  return await post(`${basePath}/query/data`, body);
}

/** 获取默认的查询方案 */
async function doGet(tag: string): Promise<SysQueryRes> {
  return await get(`${basePath}/query/${tag}`);
}

/** 获取用户配置的查询方案或默认的查询方案 */
async function getPlan(tag: string): Promise<SysQueryUserPlanRes> {
  return await get(`${basePath}/query/${tag}/user-plan`);
}

export const sysQueryApi = {
  getData,
  doGet,
  getPlan,
};
// 自动生成的代码块，尾行
