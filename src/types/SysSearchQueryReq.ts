// 该文件由 ZZ-CODE-GEN 管理，不要尝试改变它。
// 该文件的 HASH值为 ###H#A#S#H###f0dde5fc6ced2e4570939b9b12f6ef9a3731997340773ec2d3467c0a990ee986###H#A#S#H###， 
// 如果你修改了该文件，会使它断开与 ZZ-CODE-GEN 的关联，即下次生成文件的时候，不会更新该文件
import { SysSearchQueryCondition } from "./SysSearchQueryCondition";

export interface SysSearchQueryReq {
  asc: boolean;
  conditions: Array<SysSearchQueryCondition>;
  orderBy: string;
  page: number;
  pageSize: number;
  tag: string;
}
