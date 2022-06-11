// 自动生成的代码块，首行
// 禁止修改 #HASH<1893a5132ccabd9ea186f97893bcb15a7d154e8bf316e94e20ee75937ac38ac5>HASH#
// 如果该代码块被修改，下次执行生成操作时，则不会更新该代码块。
// 如果修改了代码块，且希望重新生成，可以删除这几行注释，该文件会强制重新生成。
import { post, get } from "./http";
import { SysSearchQueryReq } from "../types/SysSearchQueryReq";
import { SysSearchQueryRes } from "../types/SysSearchQueryRes";
import { SysSearchUserPlanRes } from "../types/SysSearchUserPlanRes";

/** 使用查询方案查询 */
async function getData(body: SysSearchQueryReq): Promise<SysSearchQueryRes> {
  return await post(`/search-plan/query`, body);
}

/** 获取用户配置的查询方案或默认的查询方案 */
async function getPlan(planName: string): Promise<SysSearchUserPlanRes[]> {
  return await get(`/search-plan/${planName}`);
}

export const sysSearchPlanApi = {
  getData,
  getPlan,
};
// 自动生成的代码块，尾行
