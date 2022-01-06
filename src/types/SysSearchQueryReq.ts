// 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
// 该文件的 HASH值为 ###H#A#S#H###089a51543269d54a7c25bc5a4129bb8c0c42a97d6ba588724542784c3cec940b###H#A#S#H###， 
// 如果你修改了该文件，下次执行"code gen"操作时，不会更新该文件
import { SysSearchQueryCondition } from "./SysSearchQueryCondition";

export interface SysSearchQueryReq {
  asc: boolean;
  conditions: SysSearchQueryCondition[];
  orderBy: string;
  page: number;
  pageSize: number;
  tag: string;
}
